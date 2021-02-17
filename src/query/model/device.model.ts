import { model, Schema, Document, Model, Types } from 'mongoose';
import { SensorSchema } from './sensor.model';

export interface IDevice extends Document {
    _id: string;
    description: string;
    connectivity?: string;
    location: {
        type: 'Point',
        coordinates: Types.Array<number>,
    };
}

export const DeviceSchema = new Schema({
    _id: { type: String, required: true },
    description: { type: String, required: false },
    connectivity: { type: String, required: false },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
});
DeviceSchema.index({ location: '2dsphere' });

export const Relation = model<IDevice, Model<IDevice>>('Device', DeviceSchema);
