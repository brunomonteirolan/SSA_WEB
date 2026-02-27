import nodemailer from "nodemailer";
import SettingsModel from "../models/settings";
import connectToMongo from "./mongoose";

export async function getTransporter() {
  await connectToMongo();
  const settings = await SettingsModel.findOne().lean();

  if (!settings?.smtpHost || !settings?.smtpUser || !settings?.smtpPassword) {
    throw new Error("SMTP não configurado. Configure nas Configurações do sistema.");
  }

  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    secure: settings.smtpSecure ?? false,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPassword,
    },
  });
}

export async function sendActivationEmail(
  toEmail: string,
  toName: string,
  confirmationCode: string,
  baseUrl: string
) {
  const transporter = await getTransporter();
  const settings = await SettingsModel.findOne().lean();

  const activationLink = `${baseUrl}/first-access/${confirmationCode}`;
  const from = settings?.smtpFrom || settings?.smtpUser || "noreply@sacoa.com";
  const siteName = settings?.siteName || "Sacoa Super App";

  await transporter.sendMail({
    from: `"${siteName}" <${from}>`,
    to: toEmail,
    subject: `Bem-vindo ao ${siteName} — Ative seu acesso`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0A0A0A; padding: 40px 20px; min-height: 100vh;">
        <div style="max-width: 500px; margin: 0 auto; background: rgba(20,20,20,0.98); border: 1px solid rgba(227,0,27,0.2); border-radius: 16px; padding: 40px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
            <div style="width:40px;height:40px;border-radius:8px;background:#E3001B;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:white;">S</div>
            <div>
              <div style="font-size:16px;font-weight:700;color:white;letter-spacing:3px;">SACOA</div>
              <div style="font-size:9px;color:#E3001B;letter-spacing:2px;font-weight:600;">CASHLESS SYSTEM</div>
            </div>
          </div>

          <h1 style="color: white; font-size: 22px; margin: 0 0 8px 0;">Bem-vindo, ${toName}!</h1>
          <p style="color: #888; font-size: 14px; margin: 0 0 28px 0;">
            Sua conta foi criada no ${siteName}. Clique no botão abaixo para definir sua senha e ativar o acesso.
          </p>

          <a href="${activationLink}"
             style="display:block;width:100%;box-sizing:border-box;padding:14px;background:#E3001B;border:none;border-radius:8px;color:white;font-size:15px;font-weight:700;text-align:center;text-decoration:none;letter-spacing:0.5px;">
            Ativar minha conta
          </a>

          <p style="color:#555; font-size:12px; margin-top: 20px; text-align: center;">
            Ou copie este link: <br/>
            <span style="color:#888; word-break: break-all;">${activationLink}</span>
          </p>

          <p style="color:#444; font-size:11px; text-align:center; margin-top:24px;">
            Se você não esperava este e-mail, pode ignorá-lo com segurança.
          </p>
        </div>
      </div>
    `,
  });
}
