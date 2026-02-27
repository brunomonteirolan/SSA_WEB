import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  // SMTP configuration
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  smtpSecure: boolean;
  // Client download
  clientDownloadUrl: string;
  // Site info
  siteName: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    smtpHost: { type: String, default: "" },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: "" },
    smtpPassword: { type: String, default: "" },
    smtpFrom: { type: String, default: "" },
    smtpSecure: { type: Boolean, default: false },
    clientDownloadUrl: { type: String, default: "" },
    siteName: { type: String, default: "Sacoa Super App" },
  },
  { timestamps: true }
);

const SettingsModel: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema, "settings");

export default SettingsModel;
