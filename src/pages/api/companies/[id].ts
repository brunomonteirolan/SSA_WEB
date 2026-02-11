import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import CompanyModel from "../../../models/companyModel";
import connectToMongo from "../../../utils/mongoose";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.redirect(301, "/");

  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.status(403).json({ message: "You must be authenticated to view this content" });

  try {
    await connectToMongo();
    const { id } = req.query as { id: string };

    const company = await CompanyModel.findById(id);

    if (!company) throw new Error("Company not found");

    return res.json({ company });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Error getting companies" });
  }
};

export default handler;
