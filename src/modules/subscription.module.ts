import TelegramBot from 'node-telegram-bot-api';
import { bot } from '../config';
import { ms } from '../constants';
import adminService from '../services/admin.service';
import { channelLink, setChannelLink, setSubStatus, subStatus } from '../shared';
import { mp } from '../utils';

class SubscriptionModule {
	private bot: TelegramBot;

	constructor(bot: TelegramBot) {
		this.bot = bot;
	}

	subscripton() {
		this.bot.onText(/\/subscription/, async msg => {
			const chatId = msg.chat.id;
			try {
				const { success } = await adminService.isAdmin(chatId);
				if (success) {
					await bot.sendMessage(chatId, `Выберите действие\n\nchannel: ${channelLink}\nstatus: ${subStatus}`, { parse_mode: 'HTML', reply_markup: mp.subcription });
				} else {
					await this.bot.sendMessage(chatId, ms.not_admin, { parse_mode: 'Markdown' });
				}
			} catch (error: any) {
				await this.bot.sendMessage(chatId, `Error: ${error?.message}`, { parse_mode: 'Markdown' });
			}
		});
	}

	turnOnSubcription() {
		this.bot.onText(/\/turn_on_subscription/, async msg => {
			const chatId = msg.chat.id;
			try {
				const { success } = await adminService.isAdmin(chatId);

				if (success) {
					setSubStatus(true);
					await bot.sendMessage(chatId, `Обязательная подписка включена!`, { parse_mode: 'HTML', reply_markup: mp.subcription });
				} else {
					await this.bot.sendMessage(chatId, ms.not_admin, { parse_mode: 'Markdown' });
				}
			} catch (error: any) {
				await this.bot.sendMessage(chatId, `Error: ${error?.message}`, { parse_mode: 'Markdown' });
			}
		});
	}

	turnOffSubcription() {
		this.bot.onText(/\/turn_off_subscription/, async msg => {
			const chatId = msg.chat.id;
			try {
				const { success } = await adminService.isAdmin(chatId);

				if (success) {
					setSubStatus(false);
					await bot.sendMessage(chatId, `Обязательная подписка выключена!`, { parse_mode: 'HTML', reply_markup: mp.subcription });
				} else {
					await this.bot.sendMessage(chatId, ms.not_admin, { parse_mode: 'Markdown' });
				}
			} catch (error: any) {
				await this.bot.sendMessage(chatId, `Error: ${error?.message}`, { parse_mode: 'Markdown' });
			}
		});
	}

	changeChannel() {
		this.bot.onText(/\/change_channel/, async msg => {
			const chatId = msg.chat.id;
			try {
				const { success } = await adminService.isAdmin(chatId);
				if (success) {
					this.bot.sendMessage(chatId, ms.change_group, { parse_mode: 'Markdown' }).then(() => {
						this.newChannel();
					});
				} else {
					await this.bot.sendMessage(chatId, ms.not_admin, { parse_mode: 'Markdown' });
				}
			} catch (error: any) {
				await this.bot.sendMessage(chatId, `Error: ${error?.message}`, { parse_mode: 'Markdown' });
			}
		});
	}

	private newChannel() {
		this.bot.once('message', async msg => {
			const chatId = msg.chat.id;
			try {
				const { success } = await adminService.isAdmin(chatId);
				if (success) {
					setChannelLink(msg.text!);
					await this.bot.sendMessage(chatId, `Changed to ${channelLink}`, { parse_mode: 'Markdown', reply_markup: mp.subcription });
				} else {
					await this.bot.sendMessage(chatId, ms.not_admin, { parse_mode: 'Markdown' });
				}
			} catch (error: any) {
				await this.bot.sendMessage(chatId, `Error: ${error?.message}`, { parse_mode: 'Markdown' });
			}
		});
	}

	init() {
		this.subscripton();
		this.turnOnSubcription();
		this.turnOffSubcription();
		this.changeChannel();
	}
}

export default new SubscriptionModule(bot);
