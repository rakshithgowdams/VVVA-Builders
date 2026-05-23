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

// ── Shared email logo header ──────────────────────────────────────────────────
const LOGO_HEADER = `
  <div style="text-align:center; padding: 28px 32px 20px; background:#1c1c1c; border-radius:12px 12px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="vertical-align:middle; padding-right:10px;">
          <!-- V chevron mark -->
          <div style="width:36px; height:36px; background:#FF5500; border-radius:8px; display:flex; align-items:center; justify-content:center;">
            <span style="color:white; font-size:22px; font-weight:900; font-family:Georgia,serif; line-height:1;">V</span>
          </div>
        </td>
        <td style="vertical-align:middle;">
          <span style="color:#ffffff; font-size:18px; font-weight:700; font-family:Georgia,'Times New Roman',serif; letter-spacing:1px;">VVVA Developer</span>
        </td>
      </tr>
    </table>
    <p style="margin:10px 0 0; color:#aaa; font-size:11px; font-family:Arial,sans-serif; letter-spacing:0.5px;">ADMIN PORTAL</p>
  </div>
`;

// ── OTP block (compact) ───────────────────────────────────────────────────────
function otpBlock(code: string): string {
  // Render each digit as its own cell for perfect spacing in all email clients
  const digits = code.split("").map(d =>
    `<td style="padding:0 4px;">
      <span style="
        display:inline-block;
        width:32px; height:40px; line-height:40px;
        background:#fff; border:1.5px solid #FF5500;
        border-radius:8px; text-align:center;
        font-size:22px; font-weight:700;
        color:#FF5500; font-family:Monaco,Courier,monospace;
      ">${d}</span>
    </td>`
  ).join("");

  return `
    <div style="background:#fff8f5; border-radius:10px; padding:20px 16px; text-align:center; margin-bottom:20px; border:1px solid #ffe0cc;">
      <p style="margin:0 0 12px; font-size:11px; color:#aaa; text-transform:uppercase; letter-spacing:1.5px; font-family:Arial,sans-serif;">One-Time Password</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>${digits}</tr>
      </table>
      <p style="margin:12px 0 0; font-size:11px; color:#bbb; font-family:Arial,sans-serif;">Expires in <strong style="color:#888;">10 minutes</strong> &middot; Single use only</p>
    </div>
  `;
}

// ── Email wrapper ─────────────────────────────────────────────────────────────
function emailWrapper(bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0; padding:0; background:#f0ede8;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ede8; padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <tr><td>${LOGO_HEADER}</td></tr>
              <tr>
                <td style="padding:28px 32px 32px; font-family:Arial,sans-serif;">
                  ${bodyHtml}
                </td>
              </tr>
              <tr>
                <td style="background:#f9f6f2; padding:16px 32px; text-align:center; border-top:1px solid #eee;">
                  <p style="margin:0; font-size:11px; color:#bbb; font-family:Arial,sans-serif;">
                    &copy; ${new Date().getFullYear()} VVVA Developer &mdash; Authorized admin access only
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
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

        const bodyHtml = `
          <div style="background:#fff8f0; border-left:3px solid #FF5500; padding:12px 16px; border-radius:4px; margin-bottom:20px;">
            <p style="margin:0; font-size:13px; color:#b84a00; font-weight:600;">Action Required: Admin Account Signup Request</p>
          </div>
          <p style="color:#444; font-size:14px; margin:0 0 6px;">Someone is requesting to create an admin account:</p>
          <p style="font-size:14px; font-weight:700; color:#FF5500; margin:0 0 18px; background:#fff8f5; display:inline-block; padding:6px 12px; border-radius:6px; border:1px solid #ffe0cc;">${normalizedEmail}</p>
          <p style="color:#555; font-size:13px; margin:0 0 20px; line-height:1.6;">If you <strong>authorised</strong> this request, share the OTP below with them. If not, <strong>ignore this email</strong> — it expires in 10 minutes.</p>
          ${otpBlock(code)}
          <p style="color:#bbb; font-size:12px; margin:0; text-align:center;">Do not share this code with anyone you do not trust.</p>
        `;

        const resendRes = await sendEmail(
          resendKey,
          notifyEmail,
          `Admin Signup Approval Required — OTP for ${normalizedEmail}`,
          emailWrapper(bodyHtml)
        );

        if (!resendRes.ok) {
          const err = await resendRes.text();
          console.error("Resend error:", err);
          return json({ error: "Failed to send approval email" }, 500);
        }

        return json({ success: true, message: "Approval OTP sent to admin owner. Please contact the owner for the code." });
      }

      if (mode === "signin") {
        const { data: existing } = await supabaseAdmin
          .from("admin_users")
          .select("id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (!existing) {
          return json({ error: "No admin account found for this email. Please sign up first." }, 404);
        }

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

        const bodyHtml = `
          <h2 style="color:#1a1a1a; font-size:18px; margin:0 0 8px; font-family:Georgia,serif;">Your sign-in code</h2>
          <p style="color:#555; font-size:13px; margin:0 0 22px; line-height:1.6;">Use the code below to sign in to your VVVA Developer admin account. It is valid for <strong>10 minutes</strong> and can only be used once.</p>
          ${otpBlock(code)}
          <p style="color:#bbb; font-size:12px; margin:0; text-align:center;">If you did not request this, you can safely ignore this email.</p>
        `;

        const resendRes = await sendEmail(
          resendKey,
          normalizedEmail,
          `Your VVVA Admin Sign-In Code`,
          emailWrapper(bodyHtml)
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

      await supabaseAdmin
        .from("otp_codes")
        .update({ used: true })
        .eq("id", otpRecord.id);

      if (mode === "signup") {
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

        if (resendKey && notifyEmail) {
          const createdAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
          const confirmBody = `
            <div style="background:#f0faf0; border-left:3px solid #4caf50; padding:12px 16px; border-radius:4px; margin-bottom:20px;">
              <p style="margin:0; font-size:13px; color:#2e7d32; font-weight:600;">New admin account created successfully</p>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f9; border-radius:8px; overflow:hidden; margin-bottom:20px;">
              <tr>
                <td style="padding:12px 16px; color:#888; font-size:12px; width:40%; border-bottom:1px solid #eee;">Email</td>
                <td style="padding:12px 16px; color:#1a1a1a; font-weight:600; font-size:13px; border-bottom:1px solid #eee;">${normalizedEmail}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; color:#888; font-size:12px;">Created At</td>
                <td style="padding:12px 16px; color:#1a1a1a; font-size:13px;">${createdAt} IST</td>
              </tr>
            </table>
            <p style="color:#bbb; font-size:12px; margin:0; text-align:center;">If you did not authorise this, review your admin access immediately.</p>
          `;
          await sendEmail(
            resendKey,
            notifyEmail,
            "New Admin Account Created — VVVA Developer",
            emailWrapper(confirmBody)
          ).catch((err) => console.error("Confirmation email failed:", err));
        }

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
