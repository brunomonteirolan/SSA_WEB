import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/mongoose";
import AppModel from "../../../models/app";
import AppVersionModel from "../../../models/appVersion";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET": {
      try {
        const app = await AppModel.findById(id).lean();
        if (!app) return res.status(404).json({ message: "App not found" });
        return res.status(200).json({ app });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "PATCH": {
      try {
        const { displayName, description, status, currentVersion, name } = req.body;
        const updates: Record<string, any> = {};
        if (displayName !== undefined) updates.displayName = displayName.trim();
        if (description !== undefined) updates.description = description?.trim();
        if (status !== undefined) updates.status = status;
        if (currentVersion !== undefined) updates.currentVersion = currentVersion;
        if (name !== undefined) updates.name = name.trim().toLowerCase().replace(/\s+/g, "-");

        const app = await AppModel.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true }
        );
        if (!app) return res.status(404).json({ message: "App not found" });
        return res.status(200).json({ app });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "DELETE": {
      try {
        const app = await AppModel.findByIdAndDelete(id);
        if (!app) return res.status(404).json({ message: "App not found" });
        // Also delete all versions
        await AppVersionModel.deleteMany({ app: id });
        return res.status(200).json({ message: "App deleted successfully" });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
