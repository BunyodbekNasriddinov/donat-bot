import TelegramBot from "node-telegram-bot-api";
import { bot, REFERRAL } from "../config";
import adminService from "../services/admin.service";
import referralService from "../services/referal.service";
import { mp } from "../utils";

class referralModule {
  private bot: TelegramBot;
  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  create() {
    this.bot.onText(/\/create_referral/, async (msg) => {
      const chatId = msg.chat.id;
      const { success } = await adminService.isAdmin(chatId);

      try {
        if (success) {
          this.bot
            .sendMessage(chatId, `Введите название для реферальной ссылки`, {
              parse_mode: "Markdown",
              reply_markup: mp.cancel,
            })
            .then(() => {
              this.addReferral();
            });
        } else {
          await this.bot.sendMessage(
            chatId,
            "Необходимо быть администратором",
            { parse_mode: "Markdown" }
          );
        }
      } catch (error: any) {
        this.bot.sendMessage(chatId, `Error: ${error?.message}`, {
          parse_mode: "Markdown",
        });
      }
    });
  }

  addReferral() {
    this.bot.once("message", async (msg) => {
      const chatId = msg.chat.id;

      try {
        if (msg.text === "Calcel") {
          await this.bot.sendMessage(chatId, "Adminka", {
            parse_mode: "Markdown",
            reply_markup: mp.admin_menu,
          });
        } else {
          const { uuid } = await referralService.create(msg.text as string);

          await this.bot.sendMessage(
            chatId,
            `${msg.text} : ${REFERRAL}${uuid}`,
            { reply_markup: mp.admin_menu }
          );
        }
      } catch (error: any) {
        this.bot.sendMessage(chatId, `Error: ${error?.message}`, {
          parse_mode: "Markdown",
        });
      }
    });
  }

  stat() {
    this.bot.onText(/\/referal_stat/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        const { success } = await adminService.isAdmin(chatId);
        if (success) {
          const stats = await referralService.getReferralStats();
          let msg = "";
          for (const key in stats) {
            msg += `${stats[key].name} <code>${key}</code> : <code>${stats[key].count}</code>\n\n`;
          }

          await this.bot.sendMessage(
            chatId,
            `Статистика реферальных кодов:\n${msg}`,
            { parse_mode: "HTML" }
          );
        } else {
          await this.bot.sendMessage(
            chatId,
            "Необходимо быть администратором",
            { parse_mode: "Markdown" }
          );
        }
      } catch (error: any) {
        this.bot.sendMessage(chatId, `Error: ${error?.message}`, {
          parse_mode: "Markdown",
        });
      }
    });
  }

  init() {
    this.create();
    this.stat();
  }
}

export default new referralModule(bot);
