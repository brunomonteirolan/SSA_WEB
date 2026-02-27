import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "./auth/[...nextauth]";
import { backend } from "../../configs";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Método não permitido" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Não autorizado" });

  const { storeId, message } = req.body;
  if (!storeId) return res.status(400).json({ message: "storeId é obrigatório" });

  try {
    const { data } = await axios.post(
      `${backend.api}/stores/${storeId}/notify`,
      { message: message || "Loja atualizada" }
    );
    return res.json(data);
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || "Erro ao enviar notificação";
    return res.status(err.response?.status || 500).json({ message: errMsg });
  }
};

export default handler;
