import { model, Schema, Document, Model, Types } from 'mongoose';

export interface IDevice extends Document {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    connectivity?: string;
    locationName?: string;
    locationDescription?: string;
    location: {
        type: 'Point',
        coordinates: Types.Array<number>,
    };
}

export const DeviceSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: false },
    connectivity: { type: String, required: false },
    locationName: { type: String, required: true },
    locationDescription: { type: String, required: false },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
});
DeviceSchema.index({ location: '2dsphere' });

export const Device = model<IDevice, Model<IDevice>>('Device', DeviceSchema);
