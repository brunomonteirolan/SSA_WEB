import { NextApiHandler } from "next";
import * as yup from "yup";
import bcrypt from "bcryptjs";

import UserModel from "../../../../models/user";
import { validate } from "../../../../utils/api/middleware";
import connectToMongo from "../../../../utils/mongoose";

const confirmationSchema = yup.object({
  password: yup.string().min(8).required(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.redirect(301, "/api/auth/signin");

  try {
    await connectToMongo();

    const { confirmationCode } = req.query as { confirmationCode: string };
    const value = req.body as { password: string };

    const user = await UserModel.findOne({ confirmationCode, status: "Pending" });

    if (!user) throw new Error("Invalid confirmation code");

    user.password = bcrypt.hashSync(value.password, 10);
    user.status = "Active";
    await user.save();

    res.json({ message: "Password registered successfully" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Error registering password" });
  }
};

export default validate(handler, confirmationSchema, "body");
