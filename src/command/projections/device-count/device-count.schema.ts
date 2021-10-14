import { Document, Schema } from 'mongoose';

export interface IDeviceCount extends Document {
    _id: string;
    count: number;
}

export const DeviceCountSchema = new Schema({
    _id: { type: String, required: true },
    count: { type: Number, required: true },
});
