import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import dbConnect from "../../../../../utils/mongoose";
import AppVersionModel from "../../../../../models/appVersion";
import AppModel from "../../../../../models/app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET": {
      try {
        const versions = await AppVersionModel.find({ app: id })
          .sort({ releaseDate: -1 })
          .lean();
        return res.status(200).json({ versions });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "POST": {
      try {
        const { version, name, releaseDate, notes, fileUrl, fileName, fileSize, status } = req.body;
        if (!version || !name || !releaseDate) {
          return res.status(400).json({ message: "Version, name, and release date are required" });
        }

        // Check if app exists
        const app = await AppModel.findById(id);
        if (!app) return res.status(404).json({ message: "App not found" });

        const appVersion = await AppVersionModel.create({
          app: id,
          version: version.trim(),
          name: name.trim(),
          releaseDate: new Date(releaseDate),
          notes: notes?.trim(),
          fileUrl: fileUrl?.trim(),
          fileName: fileName?.trim(),
          fileSize: fileSize?.trim(),
          status: status || "active",
        });

        // Update the app's current version
        await AppModel.findByIdAndUpdate(id, { $set: { currentVersion: version.trim() } });

        return res.status(201).json({ version: appVersion });
      } catch (err: any) {
        if (err.code === 11000) {
          return res.status(409).json({ message: "A version with this number already exists for this app" });
        }
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
