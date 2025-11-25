export interface IResponse<T = null> {
  message?: string;
  data?: T;
  success?: boolean;
}

export enum GameType {
  PUBG = "PUBG",
  MLBB = "MLBB",
}

export enum OrderStatusType {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  AWAITING_CONFIRM = "awaiting_confirm",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  REFUNDED = "refunded",
}

export enum FileType {
  IMAGE = "image",
  DOCUMENT = "document",
  VIDEO = "video",
}

export interface IReferralStats {
  name: string;
  count: number;
}

export interface IOrderData {
  uid: number;
  amount: number;
}
