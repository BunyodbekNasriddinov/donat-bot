import { FilterQuery, Model, Types } from "mongoose";
import { downloadSchema, IDownload, IUser, userSchema } from "../models";
import { IResponse } from "../types";

class DownloadService {
  protected downloadModel: Model<IDownload>;
  protected userModel: Model<IUser>;

  constructor(downloadModel: Model<IDownload>, userModel: Model<IUser>) {
    this.downloadModel = downloadModel;
    this.userModel = userModel;
  }

  async getOne(filterQuery: FilterQuery<IDownload>): Promise<IDownload> {
    const download = await this.downloadModel.findOne(filterQuery);

    if (!download) {
      throw new Error("Download not found");
    }
    return download;
  }

  async getAll(filterQuery: FilterQuery<IDownload>): Promise<IDownload[]> {
    const download = await this.downloadModel.find(filterQuery);

    if (!download) {
      throw new Error("Download not found");
    }
    return download;
  }

  async create(download: Partial<IDownload>): Promise<IResponse<IDownload>> {
    try {
      const newDownload = await this.downloadModel.create({
        _id: new Types.ObjectId(),
        ...download,
      });
      await newDownload.save();
      return { data: newDownload };
    } catch (error: any) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      return { message: "Error create download" };
    }
  }
}

export default new DownloadService(downloadSchema, userSchema);
