import mongoose, { model, Schema } from "mongoose";
import { FileType } from "../types";

export interface IDownload {
  _id: mongoose.Schema.Types.ObjectId;
  chat_id: number;
  data_of_join: string;
  url: string;
  type: FileType;
}

export const DownloadDocument = new Schema<IDownload>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  chat_id: { type: Number, required: false },
  data_of_join: { type: String, required: false },
  url: { type: String, required: true },
  type: {
    type: String,
    required: false,
    enum: [FileType.IMAGE, FileType.DOCUMENT, FileType.VIDEO],
  },
});

export const downloadSchema = model<IDownload>("downloads", DownloadDocument);
