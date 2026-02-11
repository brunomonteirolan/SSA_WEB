import mongoose, { Document } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  status: "Pending" | "Active";
  confirmationCode: string;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
    confirmationCode: { type: String },
  },
  { timestamps: true }
);

const UserModel = (mongoose.models.User ||
  mongoose.model("User", UserSchema, "users")) as mongoose.Model<User & Document>;

export default UserModel;
