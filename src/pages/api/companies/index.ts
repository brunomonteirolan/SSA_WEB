import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import * as yup from "yup";
import ClientModel from "../../../models/clientModel";
import CompanyModel from "../../../models/companyModel";
import connectToMongo from "../../../utils/mongoose";

interface CompanySchema {
  name: string;
  storesId: string[];
}

const companySchema = yup.object({
  name: yup.string().trim().required(),
  storesId: yup.array().of(yup.string().required()).default([]).required(),
});

const handler: NextApiHandler = async (req, res) => {
  if (!["GET", "POST"].includes(req.method ?? "")) return res.redirect(301, "/");

  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.status(403).json({ message: "You must be authenticated to view this content" });

  await connectToMongo();

  if (req.method === "POST") {
    try {
      const company = await companySchema.validate(req.body) as CompanySchema;

      const clients = await Promise.all(
        company.storesId.map((storeId) => ClientModel.findOne({ storeId }))
      );

      const validClients = clients.filter(Boolean);

      const newCompany = new CompanyModel({
        name: company.name,
        clients: validClients.map((c) => c!._id),
      });

      await newCompany.save();
      await Promise.all(
        validClients.map((client) => {
          client!.company = newCompany._id;
          return client!.save();
        })
      );

      return res.json({ company: newCompany, clients: validClients });
    } catch (err: any) {
      const message =
        err.code === 11000
          ? "Company name already in use"
          : err.message;

      return res.status(400).json({ message });
    }
  } else {
    try {
      const companies = await CompanyModel.find();
      return res.json({ companies });
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "Error getting companies" });
    }
  }
};

export default handler;
