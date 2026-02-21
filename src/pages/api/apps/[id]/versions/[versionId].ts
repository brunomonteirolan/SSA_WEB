import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import dbConnect from "../../../../../utils/mongoose";
import AppVersionModel from "../../../../../models/appVersion";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();
  const { versionId } = req.query;

  switch (req.method) {
    case "PATCH": {
      try {
        const { version, name, releaseDate, notes, fileUrl, fileName, fileSize, status } = req.body;
        const updates: Record<string, any> = {};
        if (version !== undefined) updates.version = version.trim();
        if (name !== undefined) updates.name = name.trim();
        if (releaseDate !== undefined) updates.releaseDate = new Date(releaseDate);
        if (notes !== undefined) updates.notes = notes?.trim();
        if (fileUrl !== undefined) updates.fileUrl = fileUrl?.trim();
        if (fileName !== undefined) updates.fileName = fileName?.trim();
        if (fileSize !== undefined) updates.fileSize = fileSize?.trim();
        if (status !== undefined) updates.status = status;

        const appVersion = await AppVersionModel.findByIdAndUpdate(
          versionId,
          { $set: updates },
          { new: true, runValidators: true }
        );
        if (!appVersion) return res.status(404).json({ message: "Version not found" });
        return res.status(200).json({ version: appVersion });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "DELETE": {
      try {
        const appVersion = await AppVersionModel.findByIdAndDelete(versionId);
        if (!appVersion) return res.status(404).json({ message: "Version not found" });
        return res.status(200).json({ message: "Version deleted successfully" });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
