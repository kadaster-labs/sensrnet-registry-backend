import { model, Schema, Document, Model } from 'mongoose';

export interface ILegalEntityDeviceCount extends Document {
    _id: string;
    deviceIds: string[];
}

export const LegalEntityDeviceCountSchema = new Schema({
    _id: { type: String, required: true },
    deviceIds: { type: [String], required: true },
});

export const LegalEntityDeviceCount = model<ILegalEntityDeviceCount, Model<ILegalEntityDeviceCount>>(
    'LegalEntityDeviceCount',
    LegalEntityDeviceCountSchema,
);
