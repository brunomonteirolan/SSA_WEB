import mongoose, { Document, Model, Schema } from "mongoose";

export interface IApp extends Document {
  name: string;
  displayName: string;
  description?: string;
  status: "active" | "inactive";
  currentVersion?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppSchema = new Schema<IApp>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    currentVersion: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "apps",
  }
);

const AppModel: Model<IApp> =
  mongoose.models.SsaApp || mongoose.model<IApp>("SsaApp", AppSchema, "apps");

export default AppModel;
