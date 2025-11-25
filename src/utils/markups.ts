import mongoose, { Types } from "mongoose";
import { cb } from "../constants";

export const cancel = {
  inline_keyboard: [[{ text: cb.cancel, callback_data: cb.cancel }]],
};

export const admin_menu = {
  keyboard: [
    [{ text: "/stat" }, { text: "/create_referal" }],
    [{ text: "/referal_stat" }, { text: "/mail_users" }],
    [{ text: "/subscription" }, { text: "/ads" }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
};

export const game_menu = {
  inline_keyboard: [
    [{ text: cb.pubg, callback_data: cb.pubg }],
    [{ text: cb.mlbb, callback_data: cb.mlbb }],
  ],
};

export const order_confirm = {
  inline_keyboard: [
    [{ text: cb.confirm, callback_data: cb.confirm }],
    [{ text: cb.discard, callback_data: cb.discard }],
  ],
};

export const admin_order_confirm = (
  orderId: mongoose.Schema.Types.ObjectId | undefined,
  msgId?: number
) => ({
  inline_keyboard: [
    [
      {
        text: cb.admin_confirm,
        callback_data: `${cb.admin_confirm}_${orderId}_${msgId}`,
      },
    ],
    [
      {
        text: cb.admin_discard,
        callback_data: `${cb.admin_discard}_${orderId}_${msgId}`,
      },
    ],
  ],
});

export const admin_payment_confirm = (
  orderId: mongoose.Schema.Types.ObjectId | undefined,
  msgId?: number
) => ({
  inline_keyboard: [
    [
      {
        text: cb.admin_payment_confirm,
        callback_data: `${cb.admin_payment_confirm}_${orderId}_${msgId}`,
      },
    ],
  ],
});

/////////////////////////////////////

export const profile_menu = {
  inline_keyboard: [
    [{ text: cb.withdraw, callback_data: cb.withdraw }],
    [{ text: cb.cancel, callback_data: cb.cancel }],
  ],
};

export function getStatMsg(
  number_of_users: number,
  users_today: number,
  all_downloads: number,
  today_downloads: number,
  youtube: number,
  tiktok: number,
  instagram: number,
  youtube_shorts: number
): string {
  const msg = `
Статистика бота

Количество всех пользователей бота: ${number_of_users}
Количество пользователей за сегодня: ${users_today}
Количество всех скачанных видео: ${all_downloads}
Количество всех скачанных видео за сегодня: ${today_downloads}
Количество скачанных видео (за все время) из тикток: ${tiktok}
Количество скачанных видео (за все время) из инстаграм: ${instagram}
Количество скачанных аудио (за все время) из ютуб: ${youtube}
Колличество скачанных видео (за все время) из ютуб: ${youtube_shorts}
    `;
  return msg;
}

export const subcription = {
  keyboard: [
    [{ text: "/turn_on_subscription" }],
    [{ text: "/turn_off_subscription" }],
    [{ text: "/change_channel" }],
    [{ text: "/admin_menu" }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
};
