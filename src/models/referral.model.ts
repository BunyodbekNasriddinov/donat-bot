import mongoose, { model, Schema } from "mongoose";

export interface IReferral {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  uuid: string;
}

export const ReferralDocument = new Schema<IReferral>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  uuid: { type: String, required: true },
});

export const referralSchema = model("referrals", ReferralDocument);
