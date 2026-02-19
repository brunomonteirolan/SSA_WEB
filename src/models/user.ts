import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  status: string;
  confirmed: boolean;
  confirmationCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
      required: [true, "Password is required"],
      select: false, // Por padrão não retorna a senha
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Índices compostos para melhorar performance
UserSchema.index({ email: 1, status: 1 });

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
