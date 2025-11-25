import { Model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IReferral, referralSchema } from "../models";
import { IReferralStats } from "../types";
import userService from "./user.service";

class ReferralService {
  protected referralModel: Model<IReferral>;

  constructor(referralModel: Model<IReferral>) {
    this.referralModel = referralModel;
  }

  async create(name: string): Promise<IReferral> {
    try {
      const referral = new this.referralModel({
        _id: new Types.ObjectId(),
        name,
        uuid: uuidv4(),
      });

      return await referral.save();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByUuid(uuid: string): Promise<IReferral> {
    return (await this.referralModel.findOne({ uuid })) as IReferral;
  }

  async getReferralStats(): Promise<Record<string, IReferralStats>> {
    try {
      const unique: string[] = [];
      const output: Record<string, IReferralStats> = {};

      const referrals = await this.referralModel.find().exec();

      for (let i = 0; i < referrals.length; i++) {
        const element = referrals[i];

        if (unique.includes(element.uuid) && element.uuid) {
          continue;
        } else {
          unique.push(element.uuid);
          output[element.uuid] = { name: element.name, count: 0 };
        }
      }

      const users = await userService.getUsers({});

      for (let i = 0; i < users.length; i++) {
        const element = users[i];

        if (unique.includes(element.referral_code) && element.referral_code) {
          output[element.referral_code].count += 1;
        }
      }

      return output;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new ReferralService(referralSchema);
