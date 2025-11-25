import TelegramBot from "node-telegram-bot-api";
import { ADMIN_PASS, bot } from "../config";
import { ms } from "../constants";
import adminService from "../services/admin.service";
import { extractUniqueCode, mp } from "../utils";

class AdminModule {
  private bot: TelegramBot;
  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  admin() {
    this.bot.onText(/\/(admin|admin_menu)/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      try {
        const code = extractUniqueCode(msg.text!);
        const { success } = await adminService.isAdmin(chatId);

        if (success) {
          await this.admin_options(chatId, username || "");
        } else if (!success && code == ADMIN_PASS) {
          await adminService.create({ chat_id: chatId, username });
          await this.admin_options(chatId, username || "");
        } else {
          await this.bot.sendMessage(chatId, ms.not_admin, {
            parse_mode: "Markdown",
          });
        }
      } catch (error: any) {
        this.bot.sendMessage(chatId, `Error: ${error?.message}`, {
          parse_mode: "Markdown",
        });
      }
    });
  }

  private async admin_options(chatId: number, username: string) {
    await this.bot.sendMessage(chatId, `Admin : ${username}`, {
      parse_mode: "Markdown",
      reply_markup: mp.admin_menu,
    });
  }

  init() {
    this.admin();
  }
}

export default new AdminModule(bot);
