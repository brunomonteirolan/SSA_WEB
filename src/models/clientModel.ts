import mongoose, { Document, Schema, Types } from "mongoose";
import { CompanyDocument } from "./companyModel";

type ClientTypes = "Server";

export interface Client {
  storeId: string;
  company?: Types.ObjectId | Record<string, unknown>;
  type: ClientTypes;
  lastSocketId?: string;
  connected: boolean;
}

export interface ClientDocument extends Document {
  company?: CompanyDocument["_id"];
}

const ClientSchema = new Schema({
  storeId: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  type: { type: String, enum: ["Server"], default: "Server", required: true },
  lastSocketId: { type: String },
  connected: { type: Boolean, default: false },
});

const ClientModel = (mongoose.models.Client ||
  mongoose.model("Client", ClientSchema, "clients")) as mongoose.Model<ClientDocument>;

export default ClientModel;
