import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../utils/mongoose";
import UserModel from "../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const users = await UserModel.find({}).select("-password").sort({ createdAt: -1 }).lean();
        return res.status(200).json({ users });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "PATCH": {
      try {
        const { id, status, role, permissions, name } = req.body;
        if (!id) return res.status(400).json({ message: "User ID is required" });

        const updates: Record<string, any> = {};
        if (status !== undefined) updates.status = status;
        if (role !== undefined) updates.role = role;
        if (permissions !== undefined) updates.permissions = permissions;
        if (name !== undefined) updates.name = name;

        const user = await UserModel.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    case "DELETE": {
      try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: "User ID is required" });

        const user = await UserModel.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User deleted successfully" });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
