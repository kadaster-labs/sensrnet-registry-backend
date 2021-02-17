import { model, Schema, Document, Types, Model } from 'mongoose';
import { DeviceSchema } from './device.model';

export interface ISensor extends Document {
    _id: string;
    name?: string;
    deviceId?: string;
    description?: string;
    supplier?: string;
    manufacturer?: string;
    documentationUrl?: string;
    active: boolean;
    location: {
        type: 'Point',
        coordinates: Types.Array<number>,
    };
}

export const SensorSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: false },
    deviceId: { type: String, required: false },
    description: { type: String, required: false },
    supplier: { type: String, required: false },
    manufacturer: { type: String, required: false },
    documentationUrl: { type: String, required: false },
    active: { type: Boolean, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
});
SensorSchema.index({ deviceId: 1 });
SensorSchema.index({ location: '2dsphere' });

export const Sensor = model<ISensor, Model<ISensor>>('Sensor', SensorSchema);
