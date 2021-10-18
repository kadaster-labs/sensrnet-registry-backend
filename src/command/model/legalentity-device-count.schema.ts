import { Document, Schema } from 'mongoose';

export interface IDeviceCount extends Document {
    _id: string;
    deviceIds: string[];
}

export const DeviceCountSchema = new Schema({
    _id: { type: String, required: true },
    deviceIds: { type: [String], required: true },
});
