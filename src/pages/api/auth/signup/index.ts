import { NextApiHandler } from "next";
import * as yup from "yup";
import crypto from "crypto";

import UserModel from "../../../../models/user";
import { validate } from "../../../../utils/api/middleware";
import connectToMongo from "../../../../utils/mongoose";

const userSchema = yup.object({
  name: yup.string().trim().required(),
  email: yup.string().email().trim().required(),
  role: yup.string().oneOf(["admin", "manager", "viewer"]).optional(),
  permissions: yup.array().of(yup.string()).optional(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.redirect(301, "/api/auth/signin");

  try {
    await connectToMongo();

    const value = req.body;
    const confirmationCode = crypto.randomBytes(12).toString("hex");

    const user = await UserModel.create({ ...value, confirmationCode });

    res.json({ user });
  } catch (err: any) {
    const message = err.message
      ? err.message.includes("duplicate key") || err.code === 11000
        ? "Email already registered"
        : err.message
      : "Error creating user";

    return res.status(400).json({ message });
  }
};

export default validate(handler, userSchema, "body");
