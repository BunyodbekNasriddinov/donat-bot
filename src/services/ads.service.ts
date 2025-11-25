import { Model } from 'mongoose';
import { adsSchema, IAds } from '../models';
import { IResponse } from '../types';

class AdsService {
	protected adsModel: Model<IAds>;
	constructor(adsModel: Model<IAds>) {
		this.adsModel = adsModel;
	}

	async create(ads: Partial<IAds>): Promise<IResponse<IAds>> {
		const existAds = await this.adsModel.findOne({ shortname: ads.shortname });
		if (existAds) {
			return { message: 'Ads already exist', data: existAds };
		}

		try {
			const newAds = new this.adsModel(ads);
			return { data: await newAds.save() };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async getAll(): Promise<IAds[]> {
		return await this.adsModel.find({});
	}

	async getOne(shortname: string): Promise<IResponse<IAds>> {
		const ads = await this.adsModel.findOne({ shortname });
		if (!ads) {
			return { message: 'Ads not found' };
		}
		return { data: ads };
	}

	async deleteAds(shortname: string): Promise<IResponse<string>> {
		const ads = await this.adsModel.find({ shortname });
		if (!ads) {
			return { message: 'Ads not found', data: shortname };
		}
		await this.adsModel.deleteMany({ shortname });
		return { message: 'Ads deleted successfully', data: shortname };
	}
}

export default new AdsService(adsSchema);
