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

async function sendEmail(resendKey: string, to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "VVVA Developer <noreply@vvvadeveloper.com>",
      to: [to],
      subject,
      html,
    }),
  });
  return res;
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

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const notifyEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");

    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    // POST /admin-auth/send-otp
    if (action === "send-otp" && req.method === "POST") {
      const { email, mode } = await req.json();

      if (!email || !mode) {
        return json({ error: "email and mode are required" }, 400);
      }

      if (!resendKey) {
        return json({ error: "Email service not configured" }, 500);
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (mode === "signup") {
        // Check email not already registered
        const { data: existing } = await supabaseAdmin
          .from("admin_users")
          .select("id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (existing) {
          return json({ error: "An account with this email already exists. Please sign in." }, 409);
        }

        if (!notifyEmail) {
          return json({ error: "Admin notification email not configured" }, 500);
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

        // Send OTP to ADMIN_NOTIFICATION_EMAIL — owner must approve the signup
        const resendRes = await sendEmail(
          resendKey,
          notifyEmail,
          `Admin Signup Approval Required — OTP for ${normalizedEmail}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #eee;">
              <div style="text-align:center; margin-bottom: 28px;">
                <span style="background:#FF5500; color:white; font-size:18px; font-weight:bold; padding: 8px 20px; border-radius:8px;">VVVA Developer</span>
              </div>
              <div style="background:#fff3e0; border-left:4px solid #FF5500; padding:12px 16px; border-radius:4px; margin-bottom:20px;">
                <p style="margin:0; font-size:14px; color:#b84a00; font-weight:600;">Action Required: Admin Account Signup</p>
              </div>
              <p style="color:#555; margin-bottom:8px;">Someone is requesting to create an admin account with the following email:</p>
              <p style="font-size:16px; font-weight:700; color:#FF5500; margin-bottom:20px;">${normalizedEmail}</p>
              <p style="color:#555; margin-bottom:20px;">If you <strong>authorised</strong> this request, share the OTP below with them. If not, <strong>ignore this email</strong> — the request will expire in 10 minutes.</p>
              <div style="background:#f5f5f5; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
                <p style="margin:0 0 8px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">One-Time Password</p>
                <span style="font-size:40px; font-weight:bold; letter-spacing:12px; color:#FF5500;">${code}</span>
              </div>
              <p style="color:#999; font-size:12px; text-align:center;">This OTP expires in <strong>10 minutes</strong> and can only be used once.</p>
            </div>
          `
        );

        if (!resendRes.ok) {
          const err = await resendRes.text();
          console.error("Resend error:", err);
          return json({ error: "Failed to send approval email" }, 500);
        }

        return json({ success: true, message: "Approval OTP sent to admin owner. Please contact the owner for the code." });
      }

      if (mode === "signin") {
        // Check email exists
        const { data: existing } = await supabaseAdmin
          .from("admin_users")
          .select("id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (!existing) {
          return json({ error: "No admin account found for this email. Please sign up first." }, 404);
        }

        // Invalidate any existing unused OTPs
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

        // Send OTP directly to the user's email for signin
        const resendRes = await sendEmail(
          resendKey,
          normalizedEmail,
          `Your VVVA Admin Sign-In OTP: ${code}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #eee;">
              <div style="text-align:center; margin-bottom: 24px;">
                <span style="background:#FF5500; color:white; font-size:20px; font-weight:bold; padding: 8px 20px; border-radius:8px;">VVVA Developer</span>
              </div>
              <h2 style="color:#1a1a1a; margin-bottom:8px;">Your sign-in OTP</h2>
              <p style="color:#555; margin-bottom:24px;">Use this code to sign in to your admin account. It expires in <strong>10 minutes</strong>.</p>
              <div style="background:#f5f5f5; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
                <span style="font-size:40px; font-weight:bold; letter-spacing:12px; color:#FF5500;">${code}</span>
              </div>
              <p style="color:#999; font-size:13px;">If you didn't request this, please ignore this email.</p>
            </div>
          `
        );

        if (!resendRes.ok) {
          const err = await resendRes.text();
          console.error("Resend error:", err);
          return json({ error: "Failed to send OTP email" }, 500);
        }

        return json({ success: true, message: "OTP sent to your email" });
      }

      return json({ error: "Invalid mode" }, 400);
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

        // Send confirmation notification to admin owner
        if (resendKey && notifyEmail) {
          const createdAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
          await sendEmail(
            resendKey,
            notifyEmail,
            "New Admin Account Created — VVVA Developer",
            `
              <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #eee;">
                <div style="text-align:center; margin-bottom: 28px;">
                  <span style="background:#FF5500; color:white; font-size:18px; font-weight:bold; padding: 8px 20px; border-radius:8px;">VVVA Developer</span>
                </div>
                <div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:12px 16px; border-radius:4px; margin-bottom:20px;">
                  <p style="margin:0; font-size:14px; color:#2e7d32; font-weight:600;">Admin Account Successfully Created</p>
                </div>
                <p style="color:#555; margin-bottom:20px;">A new admin account has been created on the VVVA Developer platform.</p>
                <table style="width:100%; border-collapse:collapse; background:#f9f9f9; border-radius:8px; overflow:hidden;">
                  <tr>
                    <td style="padding:12px 16px; color:#888; font-size:13px; width:40%;">Email</td>
                    <td style="padding:12px 16px; color:#1a1a1a; font-weight:600; font-size:14px;">${normalizedEmail}</td>
                  </tr>
                  <tr style="border-top:1px solid #eee;">
                    <td style="padding:12px 16px; color:#888; font-size:13px;">Created At</td>
                    <td style="padding:12px 16px; color:#1a1a1a; font-size:14px;">${createdAt} IST</td>
                  </tr>
                </table>
                <p style="color:#999; font-size:12px; margin-top:24px;">If you did not authorise this, review your admin access immediately.</p>
              </div>
            `
          ).catch((err) => console.error("Confirmation email failed:", err));
        }

        // Create a session via magic link
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
