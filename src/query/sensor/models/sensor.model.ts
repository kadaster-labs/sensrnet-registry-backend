import { model, Schema } from 'mongoose';

export const SensorSchema = new Schema({
    _id: { type: String, required: true },
    nodeId: { type: String, required: true },
    ownerIds: { type: [String], required: false },
    name: { type: String, required: false },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    baseObjectId: { type: String, required: true },
    dataStreams: { type: [], required: false },
    aim: { type: String, required: false },
    description: { type: String, required: false },
    manufacturer: { type: String, required: false },
    active: { type: Boolean, required: true },
    observationArea: { type: Object, required: false },
    documentationUrl: { type: String, required: false },
    theme: { type: [String], required: false },
    typeName: { type: [String], required: true },
    typeDetails: { type: [Object], required: false },
});

SensorSchema.index({ location: '2dsphere' });
export const Sensor = model('Sensor', SensorSchema);
