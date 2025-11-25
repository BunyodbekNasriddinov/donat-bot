import { OrderStatusType } from "../types";

export const start_info = `💎 DonatBot — sizga kerakli o‘yin ichidagi valyutani ishonchli yetkazuvchi!

✅ 1000+ foydalanuvchilar ishonchi  
⚡ Tezkor to‘lov va yetkazish  
💰 Arzon narxlar

O‘yin tanlang va boshlang 👇

`;

export const send_pubg_id = `
📌 PUBG IDni yuboring✅
Masalan: 123456789
`;

export const send_mlbb_id = `
📌 MLBB IDni yuboring✅
Masalan: 123456789(123123)
Profil ID(ServerID)
`;

export const order_confirm_info = (
  game: string,
  amount: number,
  price: number,
  uid: string
) =>
  `
🧾 *Buyurtma tafsilotlari:
*🎮 O'yin: *${game}*
💎 Miqdor: *${amount}*
💰 Narx: *${price.toLocaleString()} so'm*
🆔 ID: *${uid}*
\nTasdiqlaysizmi?`;

export const order_card_number = (price: number) => `
💳 <b>Buyurtma tafsilotlari:</b>

💰 <b>Buyurtma tayyor!</b>

Quyidagi karta raqamiga to‘lovni amalga oshiring:

🏦 Karta: <b>${process.env.CARD_NUMBER}</b>
👤 Ism: <b>DONAT BOT ADMIN</b>
💸 Summa: <b>${price.toLocaleString()} so'm</b>

✅ To‘lovni amalga oshirgach, iltimos, to‘lov cheki (screenshot) ni shu yerga yuboring.  
Adminlar to‘lovni tasdiqlashadi va sizning buyurtmangiz <b>tez orada bajariladi.</b>

⚠️ Eslatma:
— To‘lovni <b>aniq summa</b> bo‘yicha amalga oshiring.  
— Screenshot aniq ko‘rinadigan bo‘lsin.  
— Buyurtma raqamingizni o‘chirmang, adminlar shu orqali tekshiradi.

🕒 Tasdiqlash vaqti odatda 5–10 daqiqa ichida bo‘ladi.
`;

export const paid_order_info = (
  status: OrderStatusType,
  game: string,
  amount: number,
  price: number,
  uid: string,
  chatId: number,
  username: string
) => `
🧾 <b>Buyurtma tafsilotlari:</b>
🟡 Holati: <b>${
  status === OrderStatusType.CONFIRMED
    ? "TASDIQLANGAN"
    : status === OrderStatusType.COMPLETED
    ? "YAKUNLANGAN"
    : status === OrderStatusType.PAID
    ? "TO'LOV QILINDI"
    : status === OrderStatusType.PENDING
    ? "KUTILMOQDA"
    : status === OrderStatusType.FAILED
    ? "XATOLIK BO'LGAN"
    : "TIZIM XATOLIGI"
}</b>
🎮 O'yin: <b>${game}</b>
💎 Miqdor: <b>${amount}</b>
💰 Narx: <b>${price.toLocaleString()} so'm</b>
🆔 ID: <code>${uid}</code>
👤 Chat ID: <code>${chatId}</code>
🎯 User: <b>@${username}</b>
`;

export const order_discard = `Buyurtma bekor qilindi!`;

//////////////////

export const profile_info = (balance: number) => `
    💳 Sizning hisobingiz: ${balance} so'm
`;

export const withdraw_info = (balance: number, minBalance: number) => `
Yechib olish uchun eng kamida ${minBalance} so'mni yechib olishingiz kerak!

Sizning hisobingizda ${balance} so'm mavjud!
    `;

export const invalid_url = "Нет ссылки или ссылка не валидна!";
export const too_much_urls =
  "Слишком много ссылок... Прикрепите только одну ссылку";

export const menu_message_ru = `
Привет, через этого бота вы можете скачивать видео из Instagram, TikTok и YouTube.

Отправьте ссылку на видео, которое хотите скачать:
`;

export const menu_message_uz = `
*Salom!*, ushbu bot yordamida Instagram, TikTok va YouTube dan video yuklab olishingiz mumkin.

Yuklash kerak bo'lgan video havolasini yuboring:
`;

export const channel_post_ru = `
Пожалуйста, чтобы пользоваться ботом подпишитесь на наш канал и нажмите на кнопку «Подтвердить» 👇🏻

`;

export const channel_post_uz = `
Iltimos, botdan foydalanish uchun kanalimizga obuna bo'ling va «Tasdiqlash» tugmasini bosing 👇🏻
`;

export const not_admin = "Siz admin emassiz!";
export const change_group =
  "Отправьте ссылку на канал для обязательной подписки. Аккаунт привзяанный к приложению телетона должен быть администратором канала";
