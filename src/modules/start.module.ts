import TelegramBot from "node-telegram-bot-api";
import { bot } from "../config";
import { cb, ms } from "../constants";
import { getPriceButtons } from "../utils/generate-prices";
import { FileType, GameType, OrderStatusType } from "../types";
import orderService from "../services/order.service";
import { extractFileInfo, extractUniqueCode } from "../utils";
import downloadService from "../services/download.service";
import userService from "../services/user.service";
import { mp } from "../utils";

interface IUserOrderFlow {
  step: "chooseGame" | "chooseAmount" | "enterId" | "uploadCheck";
  data: any;
}

const orderSteps: Record<number, IUserOrderFlow> = {};

class OrderFlow {
  private bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  init() {
    this.start();
    this.callbacks();
    this.listenMessages();
  }

  private start() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const code = extractUniqueCode(msg.text as string);
      if (code) {
        await userService.create({
          chat_id: chatId,
          username: msg.chat.username,
          date_of_join: new Date(),
          referral_code: code,
        });
      } else {
        await userService.create({
          chat_id: chatId,
          username: msg.chat.username,
          date_of_join: new Date(),
        });
      }
      this.bot.sendMessage(chatId, ms.start_info, {
        parse_mode: "Markdown",
        reply_markup: mp.game_menu,
      });
    });
  }

  private callbacks() {
    this.bot.on("callback_query", async (query) => {
      const chatId = query.message?.chat.id!;
      const data = query.data!;
      const orderConfirmedChannelId = process.env.CONFIRMED_ORDER_CHANNEL_ID;
      const orderChannelId = process.env.AWAIT_ORDER_CHANNEL_ID;

      console.log({ data });
      // select game
      if (data === cb.pubg || data === cb.mlbb) {
        const type = data === cb.pubg ? GameType.PUBG : GameType.MLBB;
        orderSteps[chatId] = { step: "chooseAmount", data: { type } };

        const buttons = getPriceButtons(type);
        await this.bot.sendMessage(
          chatId,
          `💰 ${type} narxlaridan birini tanlang:`,
          {
            reply_markup: { inline_keyboard: buttons },
          }
        );
      }

      // order_PUBG_50_9000
      else if (data.startsWith("order_")) {
        const [, game, amountStr, priceStr] = data.split("_");
        const amount = Number(amountStr);
        const price = Number(priceStr);

        orderSteps[chatId] = {
          step: "enterId",
          data: { type: game, amount, price },
        };

        await this.bot.sendMessage(
          chatId,
          game === GameType.PUBG
            ? `🆔 Iltimos, ${game} o‘yindagi ID raqamingizni kiriting:`
            : `🆔 Iltimos, ${game} o‘yindagi ID (Server ID) raqamingizni kiriting:`
        );
      }

      // admin confirm order
      else if (data.startsWith(cb.admin_confirm)) {
        const [, orderId, msgId] = data.split("_");
        const order = (await orderService.getOne({ _id: orderId })).data;
        const user = await userService.getOne({ chat_id: order?.chatId });
        console.log({ ok: "okeeeee", msgId });

        if (!order) {
          await this.bot.answerCallbackQuery(query.id, {
            text: "❌ Buyurtma topilmadi!",
            show_alert: true,
          });
          return;
        }

        order.status = OrderStatusType.CONFIRMED;
        await orderService.update(order);

        if (
          orderConfirmedChannelId &&
          order.screen &&
          "type" in order.screen &&
          order.screen.type === FileType.IMAGE
        ) {
          // sent order channel
          const sentPhoto = await this.bot.sendPhoto(
            orderConfirmedChannelId,
            order.screen.url,
            {
              caption: ms.paid_order_info(
                OrderStatusType.CONFIRMED,
                order.type,
                order.data.amount,
                order.price,
                order.data.uid.toString(),
                order.chatId,
                user.username
              ),
              parse_mode: "HTML",
            }
          );

          // update inline keyboard callback data
          await this.bot.editMessageReplyMarkup(
            mp.admin_payment_confirm(order._id, sentPhoto.message_id),
            {
              chat_id: orderConfirmedChannelId,
              message_id: sentPhoto.message_id,
            }
          );

          // edit waiting order
          console.log({ order });
          await this.bot.editMessageCaption(
            ms.paid_order_info(
              OrderStatusType.CONFIRMED,
              order.type,
              order.data.amount,
              order.price,
              order.data.uid.toString(),
              order.chatId,
              user.username
            ),
            {
              chat_id: orderChannelId,
              message_id: Number(msgId),
              parse_mode: "HTML",
              reply_markup: { inline_keyboard: [] },
            }
          );

          await this.bot.answerCallbackQuery(query.id, {
            text: "✅ Buyurtma qabul qilindi!",
            show_alert: true,
          });
        } else if (
          orderConfirmedChannelId &&
          order.screen &&
          "type" in order.screen &&
          order.screen.type === FileType.DOCUMENT
        ) {
          // sent order channel
          const sentDocument = await this.bot.sendDocument(
            orderConfirmedChannelId,
            order.screen.url,
            {
              caption: ms.paid_order_info(
                OrderStatusType.CONFIRMED,
                order.type,
                order.data.amount,
                order.price,
                order.data.uid.toString(),
                order.chatId,
                user.username
              ),
              parse_mode: "HTML",
            }
          );

          // update inline keyboard callback data
          await this.bot.editMessageReplyMarkup(
            mp.admin_payment_confirm(order._id, sentDocument.message_id),
            {
              chat_id: orderConfirmedChannelId,
              message_id: sentDocument.message_id,
            }
          );

          // edit waiting order
          await this.bot.editMessageCaption(
            ms.paid_order_info(
              OrderStatusType.CONFIRMED,
              order.type,
              order.data.amount,
              order.price,
              order.data.uid.toString(),
              order.chatId,
              user.username
            ),
            {
              chat_id: orderChannelId,
              message_id: Number(msgId),
              parse_mode: "HTML",
              reply_markup: { inline_keyboard: [] },
            }
          );

          await this.bot.answerCallbackQuery(query.id, {
            text: "✅ Buyurtma qabul qilindi!",
            show_alert: true,
          });
        }
      }
      // admin discard order
      else if (data.startsWith(cb.admin_discard)) {
        const [, orderId, msgId] = data.split("_");
        const order = (await orderService.getOne({ _id: orderId })).data;
        const user = await userService.getOne({ chat_id: order?.chatId });

        if (!order) {
          await this.bot.answerCallbackQuery(query.id, {
            text: "❌ Buyurtma topilmadi!",
            show_alert: true,
          });
          return;
        }

        order.status = OrderStatusType.FAILED;
        await orderService.update(order);
        await this.bot.editMessageCaption(
          ms.paid_order_info(
            OrderStatusType.FAILED,
            order.type,
            order.data.amount,
            order.price,
            order.data.uid.toString(),
            order.chatId,
            user.username
          ),
          {
            chat_id: orderChannelId,
            message_id: Number(msgId),
            reply_markup: { inline_keyboard: [] },
            parse_mode: "HTML",
          }
        );

        await this.bot.answerCallbackQuery(query.id, {
          text: "❌ Buyurtma bekor qilindi!",
          show_alert: true,
        });
      }

      // admin completed order
      else if (data.startsWith(cb.admin_payment_confirm)) {
        const [, orderId, msgId] = data.split("_");
        const order = (await orderService.getOne({ _id: orderId })).data;
        const user = await userService.getOne({ chat_id: order?.chatId });

        if (!order) {
          await this.bot.answerCallbackQuery(query.id, {
            text: "❌ Buyurtma topilmadi!",
            show_alert: true,
          });
          return;
        }

        order.status = OrderStatusType.COMPLETED;
        await orderService.update(order);

        await this.bot.editMessageCaption(
          ms.paid_order_info(
            OrderStatusType.COMPLETED,
            order.type,
            order.data.amount,
            order.price,
            order.data.uid.toString(),
            order.chatId,
            user.username
          ),
          {
            chat_id: orderConfirmedChannelId,
            message_id: Number(msgId),
            reply_markup: { inline_keyboard: [] },
            parse_mode: "HTML",
          }
        );

        await this.bot.answerCallbackQuery(query.id, {
          text: "✅ Buyurtma yakunlandi!",
          show_alert: true,
        });
      }
      // cancel button
      else if (data === cb.cancel) {
        await this.bot.answerCallbackQuery(query.id);
        await this.bot.sendMessage(chatId, ms.start_info, {
          parse_mode: "Markdown",
          reply_markup: mp.game_menu,
        });
      }
    });
  }

  private listenMessages() {
    this.bot.on("message", async (msg) => {
      if (msg.text === "/start" || msg.text === "/help") return;
      const orderChannelId = process.env.AWAIT_ORDER_CHANNEL_ID;
      const chatId = msg.chat.id;
      const uid = msg.text?.trim();
      const stepData = orderSteps[chatId];

      if (!stepData) return;

      // user ID input
      if (stepData.step === "enterId") {
        if (
          stepData.data.type === GameType.PUBG &&
          uid &&
          !/^\d{9,10}$/.test(uid)
        ) {
          await this.bot.sendMessage(
            chatId,
            "❌ Xato ID! 9–10 ta raqamdan iborat bo‘lishi kerak."
          );
          return;
        }

        if (
          stepData.data.type === GameType.MLBB &&
          uid &&
          !/^\d{6,12}\s*\(\d{3,5}\)$/.test(uid)
        ) {
          await this.bot.sendMessage(
            chatId,
            "❌ Xato ID! 123456789(1234) shunday formatda bo‘lishi kerak."
          );
          return;
        }

        stepData.data.uid = uid;
        stepData.step = "uploadCheck";

        await this.bot.sendMessage(
          chatId,
          ms.order_card_number(stepData.data.price),
          {
            parse_mode: "HTML",
          }
        );
        return;
      }

      // send order screen
      if (stepData.step === "uploadCheck") {
        const file = extractFileInfo(msg);
        const user = await userService.getOne({ chat_id: chatId });

        if (!file) {
          await this.bot.sendMessage(
            chatId,
            "❗ Iltimos, rasm yoki PDF fayl yuboring."
          );
          return;
        }

        // save file to db
        const orderScreen = await downloadService.create({
          chat_id: chatId,
          url: file.file_id,
          type: file.file_type,
        });

        // create temporary order
        console.log({ stepData });
        const newOrder = await orderService.create({
          chatId,
          type: stepData.data.type,
          price: stepData.data.price,
          data: {
            uid: Number(stepData.data.uid),
            amount: stepData.data.amount,
          },
          status: OrderStatusType.PAID,
          screen: orderScreen.data?._id,
          paidAt: new Date(),
        });

        if (orderChannelId && orderScreen.data?.type === FileType.IMAGE) {
          const sentPhoto = await this.bot.sendPhoto(
            orderChannelId,
            orderScreen.data?.url,
            {
              caption: ms.paid_order_info(
                OrderStatusType.PAID,
                stepData.data.type,
                stepData.data.amount,
                stepData.data.price,
                stepData.data.uid,
                chatId,
                user?.username
              ),
              parse_mode: "HTML",
            }
          );
          await this.bot.editMessageReplyMarkup(
            mp.admin_order_confirm(newOrder.data?._id, sentPhoto.message_id),
            { chat_id: orderChannelId, message_id: sentPhoto.message_id }
          );
          console.log({ sentPhoto });
        } else if (
          orderChannelId &&
          orderScreen.data?.type === FileType.DOCUMENT
        ) {
          const sentDocument = await this.bot.sendDocument(
            orderChannelId,
            orderScreen.data?.url,
            {
              caption: ms.paid_order_info(
                OrderStatusType.PAID,
                stepData.data.type,
                stepData.data.amount,
                stepData.data.price,
                stepData.data.uid,
                chatId,
                user?.username
              ),
              parse_mode: "HTML",
            }
          );
          await this.bot.editMessageReplyMarkup(
            mp.admin_order_confirm(newOrder.data?._id, sentDocument.message_id),
            {
              chat_id: orderChannelId,
              message_id: sentDocument.message_id,
            }
          );
        }

        delete orderSteps[chatId]; // step end
        await this.bot.sendMessage(
          chatId,
          "✅ To‘lov cheki qabul qilindi! Admin tekshiradi va tez orada buyurtmangiz bajariladi. 😊"
        );
      }
    });
  }
}

export default new OrderFlow(bot);
