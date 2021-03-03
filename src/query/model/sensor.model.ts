import { model, Schema, Document, Model } from 'mongoose';

export interface ISensor extends Document {
    _id: string;
    deviceId: string;
    name?: string;
    description?: string;
    type: string;
    manufacturer?: string;
    supplier?: string;
    documentation?: string;
}

export const SensorSchema = new Schema({
    _id: { type: String, required: true },
    deviceId: { type: String, required: true },
    name: { type: String, required: false },
    description: { type: String, required: false },
    type: { type: String, required: true },
    manufacturer: { type: String, required: false },
    supplier: { type: String, required: false },
    documentation: { type: String, required: false },
});
SensorSchema.index({ deviceId: 1 });

export const Sensor = model<ISensor, Model<ISensor>>('Sensor', SensorSchema);
