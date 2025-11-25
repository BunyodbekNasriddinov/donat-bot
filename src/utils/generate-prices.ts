import fs from "fs";
import path from "path";
import { GameType } from "../types";
import { cb } from "../constants";

export function getPriceButtons(game: GameType, key = null) {
  const filePath = path.join(process.cwd(), "src/json/prices.json");
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const gameData = jsonData[game.toLowerCase()];
  if (!gameData) {
    return [[{ text: "❌ Narxlar topilmadi", callback_data: "no_prices" }]];
  }

  const firstKey = key || Object.keys(gameData)[0];
  const prices = gameData[firstKey] || [];

  const flatButtons = prices.map((item: any) => ({
    text: `${item.amount.toLocaleString()} ${firstKey} — ${item.price.toLocaleString()} so'm`,
    callback_data: `order_${game}_${item.amount}_${item.price}`,
  }));

  const inlineKeyboard: any[] = [];
  for (let i = 0; i < flatButtons.length; i += 2) {
    inlineKeyboard.push(flatButtons.slice(i, i + 2));
  }

  inlineKeyboard.push([{ text: cb.cancel, callback_data: cb.cancel }]);

  return inlineKeyboard;
}
