import mongoose, { Document, Schema, Types } from "mongoose";
import { ClientDocument } from "./clientModel";

export interface Company {
  name: string;
  clients: Array<Types.ObjectId | Record<string, unknown>>;
}

export interface CompanyDocument extends Document {
  clients: ClientDocument["_id"][];
}

const CompanySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    clients: [{ type: Schema.Types.ObjectId, ref: "Client" }],
  },
  { timestamps: true }
);

const CompanyModel = (mongoose.models.Company ||
  mongoose.model("Company", CompanySchema, "companies")) as mongoose.Model<CompanyDocument>;

export default CompanyModel;
