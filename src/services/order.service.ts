import { FilterQuery, Model, Types } from "mongoose";
import { IResponse } from "../types";
import { IOrder, orderSchema } from "../models/order.model";
import { IDownload } from "../models";

class OrderService {
  protected orderModel: Model<IOrder>;
  private _order = {};

  constructor(orderModel: Model<IOrder>) {
    this.orderModel = orderModel;
  }

  async getOne(filterQuery: FilterQuery<IOrder>): Promise<IResponse<IOrder>> {
    try {
      const order = await this.orderModel
        .findOne(filterQuery)
        .populate<{ screen: IDownload }>("screen");
      if (!order) throw new Error("Order not found");
      return { data: order };
    } catch (error) {
      if (error instanceof Error) {
        return { message: error?.message };
      }
      return { message: "Error get order!" };
    }
  }

  async create(order: Partial<IOrder>): Promise<IResponse<IOrder>> {
    try {
      const newOrder = await this.orderModel.create({
        _id: new Types.ObjectId(),
        ...order,
      });
      await newOrder.save();
      return { data: newOrder };
    } catch (error) {
      if (error instanceof Error) {
        return { message: error?.message };
      }
      return { message: "Error create order!" };
    }
  }

  async update(order: Partial<IOrder>) {
    try {
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(order._id, order, { new: true })
        .populate("screen");
      return { data: updatedOrder };
    } catch (error) {
      if (error instanceof Error) {
        return { message: error?.message };
      }
      return { message: "Error update order!" };
    }
  }

  get order() {
    return this._order;
  }

  set order(order) {
    this._order = { ...this._order, ...order };
  }
}

export default new OrderService(orderSchema);
