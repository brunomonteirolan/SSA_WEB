import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getTransporter } from "../../../utils/mailer";
import SettingsModel from "../../../models/settings";
import connectToMongo from "../../../utils/mongoose";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Método não permitido" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Não autorizado" });
  if ((session.user as any).role !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Informe um e-mail para teste" });

  try {
    await connectToMongo();
    const transporter = await getTransporter();
    const settings = await SettingsModel.findOne().lean();
    const siteName = settings?.siteName || "Sacoa Super App";
    const from = settings?.smtpFrom || settings?.smtpUser || "noreply@sacoa.com";

    await transporter.sendMail({
      from: `"${siteName}" <${from}>`,
      to: email,
      subject: `[Teste] Configuração SMTP — ${siteName}`,
      html: `<p style="font-family:sans-serif;">E-mail de teste enviado pelo <strong>${siteName}</strong>. Se você recebeu este e-mail, o SMTP está configurado corretamente!</p>`,
    });

    return res.json({ message: "E-mail de teste enviado com sucesso!" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Erro ao enviar e-mail de teste" });
  }
};

export default handler;
