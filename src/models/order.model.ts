import mongoose, { model, Schema, Types } from "mongoose";
import { GameType, IOrderData, OrderStatusType } from "../types";
import { IDownload } from "./download.model";

export interface IOrder extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  chatId: number;
  type: GameType;
  status: OrderStatusType;
  price: number;
  screen: IDownload | mongoose.Schema.Types.ObjectId;
  data: IOrderData;
  paidAt: Date;
}

export const OrderDocument = new Schema<IOrder>({
  _id: { type: Types.ObjectId, required: true },
  chatId: { type: Number, required: true },
  type: { type: String, enum: [GameType.PUBG, GameType.MLBB], required: true },
  status: {
    type: String,
    enum: [
      OrderStatusType.PENDING,
      OrderStatusType.PAID,
      OrderStatusType.FAILED,
      OrderStatusType.AWAITING_CONFIRM,
      OrderStatusType.COMPLETED,
      OrderStatusType.REFUNDED,
    ],
    default: OrderStatusType.PENDING,
  },
  price: { type: Number, required: true },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "downloads",
    required: false,
  },
  data: { type: Schema.Types.Mixed, required: true },
  paidAt: { type: Schema.Types.Date, required: false },
});

export const orderSchema =
  mongoose.models.orders || model<IOrder>("orders", OrderDocument);
