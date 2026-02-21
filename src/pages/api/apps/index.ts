import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/mongoose";
import AppModel from "../../../models/app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const apps = await AppModel.find({}).sort({ displayName: 1 }).lean();
        return res.status(200).json({ apps });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "POST": {
      try {
        const { name, displayName, description, status } = req.body;
        if (!name || !displayName) {
          return res.status(400).json({ message: "Name and display name are required" });
        }

        const app = await AppModel.create({
          name: name.trim().toLowerCase().replace(/\s+/g, "-"),
          displayName: displayName.trim(),
          description: description?.trim(),
          status: status || "active",
        });

        return res.status(201).json({ app });
      } catch (err: any) {
        if (err.code === 11000) {
          return res.status(409).json({ message: "An app with this name already exists" });
        }
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
