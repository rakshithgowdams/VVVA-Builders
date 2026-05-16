import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    // POST /admin-auth/send-otp
    if (action === "send-otp" && req.method === "POST") {
      const { email, mode } = await req.json();

      if (!email || !mode) {
        return json({ error: "email and mode are required" }, 400);
      }

      const normalizedEmail = email.toLowerCase().trim();

      // For signup: check email is not already registered
      if (mode === "signup") {
        const { data: existing } = await supabaseAdmin
          .from("admin_users")
          .select("id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (existing) {
          return json({ error: "An account with this email already exists. Please sign in." }, 409);
        }
      }

      // For signin: check email exists
      if (mode === "signin") {
        const { data: existing } = await supabaseAdmin
          .from("admin_users")
          .select("id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (!existing) {
          return json({ error: "No admin account found for this email. Please sign up first." }, 404);
        }
      }

      // Invalidate any existing unused OTPs for this email
      await supabaseAdmin
        .from("otp_codes")
        .update({ used: true })
        .eq("email", normalizedEmail)
        .eq("used", false);

      const code = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabaseAdmin.from("otp_codes").insert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt,
        used: false,
      });

      // Send OTP via Resend
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) {
        return json({ error: "Email service not configured" }, 500);
      }

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "VVVA Developer <noreply@vvvadeveloper.com>",
          to: [normalizedEmail],
          subject: `Your VVVA Admin OTP: ${code}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff;">
              <div style="text-align:center; margin-bottom: 24px;">
                <span style="background:#FF5500; color:white; font-size:20px; font-weight:bold; padding: 8px 20px; border-radius:8px;">VVVA Developer</span>
              </div>
              <h2 style="color:#1a1a1a; margin-bottom:8px;">Your one-time password</h2>
              <p style="color:#555; margin-bottom:24px;">Use this OTP to ${mode === "signup" ? "complete your registration" : "sign in to your admin account"}. It expires in <strong>10 minutes</strong>.</p>
              <div style="background:#f5f5f5; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
                <span style="font-size:40px; font-weight:bold; letter-spacing:12px; color:#FF5500;">${code}</span>
              </div>
              <p style="color:#999; font-size:13px;">If you didn't request this, please ignore this email.</p>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const err = await resendRes.text();
        console.error("Resend error:", err);
        return json({ error: "Failed to send OTP email" }, 500);
      }

      return json({ success: true, message: "OTP sent to your email" });
    }

    // POST /admin-auth/verify-otp
    if (action === "verify-otp" && req.method === "POST") {
      const { email, code, mode } = await req.json();

      if (!email || !code || !mode) {
        return json({ error: "email, code and mode are required" }, 400);
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Find a valid unused OTP
      const { data: otpRecord } = await supabaseAdmin
        .from("otp_codes")
        .select("*")
        .eq("email", normalizedEmail)
        .eq("code", code)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!otpRecord) {
        return json({ error: "Invalid or expired OTP. Please request a new one." }, 400);
      }

      // Mark OTP as used
      await supabaseAdmin
        .from("otp_codes")
        .update({ used: true })
        .eq("id", otpRecord.id);

      if (mode === "signup") {
        // Create auth user + admin_users record
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail,
          email_confirm: true,
        });

        if (authError || !authData.user) {
          return json({ error: authError?.message || "Failed to create user" }, 500);
        }

        await supabaseAdmin.from("admin_users").insert({
          id: authData.user.id,
          email: normalizedEmail,
        });

        // Create a session
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: normalizedEmail,
        });

        if (sessionError) {
          return json({ error: sessionError.message }, 500);
        }

        return json({ success: true, action_link: sessionData.properties?.action_link });
      }

      if (mode === "signin") {
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: normalizedEmail,
        });

        if (sessionError) {
          return json({ error: sessionError.message }, 500);
        }

        return json({ success: true, action_link: sessionData.properties?.action_link });
      }

      return json({ error: "Invalid mode" }, 400);
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    console.error("admin-auth error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
