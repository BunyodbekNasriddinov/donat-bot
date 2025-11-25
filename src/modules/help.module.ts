import TelegramBot from "node-telegram-bot-api";
import { bot } from "../config";

class HelpModule {
  private bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  help() {
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        "Tushunmasangiz admin bilan bog'laning:\n@BunyodbekNasriddinov"
      );
    });
  }

  init() {
    this.help();
  }
}

export default new HelpModule(bot);
