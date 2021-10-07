import { model, Schema, Document, Model } from 'mongoose';

export interface ILegalEntityDeviceCount extends Document {
    _id: string;
    count: number;
}

export const LegalEntityDeviceCountSchema = new Schema({
    _id: { type: String, required: true },
    count: { type: Number, required: true },
});

export const LegalEntityDeviceCount = model<ILegalEntityDeviceCount, Model<ILegalEntityDeviceCount>>(
    'LegalEntityDeviceCount',
    LegalEntityDeviceCountSchema,
);
