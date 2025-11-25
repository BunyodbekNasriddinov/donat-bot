import mongoose, { model, Schema, Types } from 'mongoose';

export interface IAds {
	_id: mongoose.Schema.Types.ObjectId;
	shortname: string;
	text: string;
	file_path: string;
	media_type: string;
	btn_text: string;
	btn_url: string;
}

export const AdsDocument = new Schema<IAds>({
	_id: { type: Types.ObjectId, required: true },
	shortname: { type: String, required: true },
	text: { type: String, required: true },
	file_path: { type: String, required: true },
	media_type: { type: String, required: true },
	btn_text: { type: String, required: true },
	btn_url: { type: String, required: true },
});

export const adsSchema = model<IAds>('ads', AdsDocument);
