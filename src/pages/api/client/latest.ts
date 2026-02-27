import { NextApiHandler } from "next";
import SettingsModel from "../../../models/settings";
import connectToMongo from "../../../utils/mongoose";
import { backend } from "../../../configs";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Método não permitido" });

  try {
    await connectToMongo();
    const settings = await SettingsModel.findOne().lean();

    if (settings?.clientDownloadUrl) {
      return res.redirect(302, settings.clientDownloadUrl);
    }

    // Fallback: proxy to backend if configured
    if (backend.api) {
      return res.redirect(302, `${backend.api}/client/latest`);
    }

    return res.status(404).json({ message: "URL de download não configurada. Configure nas Configurações do sistema." });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Erro ao obter URL de download" });
  }
};

export default handler;
