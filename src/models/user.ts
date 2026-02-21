import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "admin" | "manager" | "viewer";
export type UserPermission = "stores" | "apps" | "users";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  status: "Active" | "Inactive" | "Pending";
  confirmed: boolean;
  confirmationCode?: string | null;
  role: UserRole;
  permissions: UserPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export type User = IUser;

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Pending",
      index: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirmationCode: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "viewer"],
      default: "viewer",
    },
    permissions: {
      type: [String],
      enum: ["stores", "apps", "users"],
      default: ["stores"],
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

UserSchema.index({ email: 1, status: 1 });

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
