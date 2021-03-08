import { Document, Schema, Types } from 'mongoose';

export interface IDataStream extends Document {
    _id: string;
    sensorId: string;
    name: string;
    description?: string;
    unitOfMeasurement?: Record<string, any>;
    observationArea?: Record<string, any>;
    theme?: string[];
    dataQuality?: string;
    isActive?: boolean;
    isPublic?: boolean;
    isOpenData?: boolean;
    containsPersonalInfoData?: boolean;
    isReusable?: boolean;
    documentation?: string;
    dataLink?: string;
    observationGoalIds?: string[];
}

export interface ISensor extends Document {
    _id: string;
    name: string;
    description?: string;
    type?: string;
    manufacturer?: string;
    supplier?: string;
    documentation?: string;
}

export interface ILocationDetails extends Document {
    _id?: string;
    name?: string;
    description?: string;
}

export interface IDevice extends Document {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    connectivity?: string;
    locationDetails?: ILocationDetails;
    location?: {
        type: 'Point',
        coordinates: Types.Array<number>,
    };
    sensors: Types.Array<ISensor>;
    dataStreams: Types.Array<IDataStream>;
}

export const DataStreamSchema = new Schema({
    _id: { type: String, required: true },
    sensorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    unitOfMeasurement: { type: Object, required: false },
    observationArea: { type: Object, required: false },
    theme: { type: [String], required: false },
    dataQuality: { type: String, required: false },
    isActive: { type: Boolean, required: false },
    isPublic: { type: Boolean, required: false },
    isOpenData: { type: Boolean, required: false },
    containsPersonalInfoData: { type: Boolean, required: false },
    isReusable: { type: Boolean, required: false },
    documentation: { type: String, required: false },
    dataLink: { type: String, required: false },
    observationGoalIds: { type: [String], required: false },
});
DataStreamSchema.index({ observationGoalIds: 1 });

export const SensorSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: false },
    description: { type: String, required: false },
    type: { type: String, required: true },
    manufacturer: { type: String, required: false },
    supplier: { type: String, required: false },
    documentation: { type: String, required: false },
});

export const LocationSchema = new Schema({
    _id: { type: String, required: false },
    name: { type: String, required: false },
    description: { type: String, required: false },
});

export const DeviceSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: false },
    connectivity: { type: String, required: false },
    locationDetails: { type: LocationSchema, required: false },
    location: {
        type: { type: String, enum: ['Point'], required: false },
        coordinates: { type: [Number], required: false },
    },
    dataStreams: [DataStreamSchema],
    sensors: [SensorSchema],
});
DeviceSchema.index({ location: '2dsphere' });
