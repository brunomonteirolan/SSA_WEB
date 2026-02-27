import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import SettingsModel from "../../../models/settings";
import connectToMongo from "../../../utils/mongoose";

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if ((session.user as any).role !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }

  await connectToMongo();

  if (req.method === "GET") {
    let settings = await SettingsModel.findOne().lean();
    if (!settings) {
      settings = await SettingsModel.create({});
    }
    // Mask the SMTP password in response
    return res.json({
      settings: {
        ...settings,
        smtpPassword: settings.smtpPassword ? "••••••••" : "",
      },
    });
  }

  if (req.method === "PATCH") {
    const {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpFrom,
      smtpSecure,
      clientDownloadUrl,
      siteName,
    } = req.body;

    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = new SettingsModel({});
    }

    if (smtpHost !== undefined) settings.smtpHost = smtpHost;
    if (smtpPort !== undefined) settings.smtpPort = Number(smtpPort);
    if (smtpUser !== undefined) settings.smtpUser = smtpUser;
    // Only update password if a real value is provided (not the masked placeholder)
    if (smtpPassword !== undefined && smtpPassword !== "••••••••") {
      settings.smtpPassword = smtpPassword;
    }
    if (smtpFrom !== undefined) settings.smtpFrom = smtpFrom;
    if (smtpSecure !== undefined) settings.smtpSecure = Boolean(smtpSecure);
    if (clientDownloadUrl !== undefined) settings.clientDownloadUrl = clientDownloadUrl;
    if (siteName !== undefined) settings.siteName = siteName;

    await settings.save();

    return res.json({ message: "Configurações salvas com sucesso!" });
  }

  return res.status(405).json({ message: "Método não permitido" });
};

export default handler;
