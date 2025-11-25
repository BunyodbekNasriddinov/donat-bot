import { Message } from "node-telegram-bot-api";
import { FileType } from "../types";

export interface IFileInfo {
  file_id: string;
  file_type: FileType;
  file_name?: string;
}

export function extractFileInfo(msg: Message): IFileInfo | null {
  // Rasm yuborilgan bo‘lsa
  if (msg.photo && msg.photo.length > 0) {
    const photo = msg.photo[msg.photo.length - 1]; // eng sifatli variant
    return {
      file_id: photo.file_id,
      file_type: FileType.IMAGE,
    };
  }

  // Fayl (PDF yoki boshqa hujjat) yuborilgan bo‘lsa
  if (msg.document) {
    const doc = msg.document;
    return {
      file_id: doc.file_id,
      file_type: FileType.DOCUMENT,
      file_name: doc.file_name,
    };
  }

  return null;
}
