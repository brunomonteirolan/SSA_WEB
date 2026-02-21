import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAppVersion extends Document {
  app: Types.ObjectId;
  version: string;
  name: string;
  releaseDate: Date;
  notes?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const AppVersionSchema = new Schema<IAppVersion>(
  {
    app: {
      type: Schema.Types.ObjectId,
      ref: "SsaApp",
      required: true,
      index: true,
    },
    version: {
      type: String,
      required: [true, "Version is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: [true, "Release date is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "app_versions",
  }
);

AppVersionSchema.index({ app: 1, version: 1 }, { unique: true });

const AppVersionModel: Model<IAppVersion> =
  mongoose.models.AppVersion ||
  mongoose.model<IAppVersion>("AppVersion", AppVersionSchema, "app_versions");

export default AppVersionModel;
