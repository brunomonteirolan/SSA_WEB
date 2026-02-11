import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

import UserModel from "../../models/user";
import connectToMongo from "../../utils/mongoose";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") return res.redirect(301, "/");

  try {
    await connectToMongo();

    const session = await getServerSession(req, res, authOptions);

    if (!session)
      return res.status(403).json({ message: "You must be authenticated to view this content" });

    const users = await UserModel.find();

    res.json({ users });
  } catch (err) {
    res.status(400).json({ message: "Error" });
  }
};

export default handler;
