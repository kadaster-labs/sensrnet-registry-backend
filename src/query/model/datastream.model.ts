import { model, Schema, Document, Model } from 'mongoose';

export interface IDataStream extends Document {
    _id: string;
    sensorId: string;
    deviceId: string;
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
    observationGoals?: [{
        _id: string,
        name: string,
        description?: string,
        legalGround?: string,
        legalGroundLink?: string,
    }];
}

export const DataStreamSchema = new Schema({
    _id: { type: String, required: true },
    sensorId: { type: String, required: true },
    deviceId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    unitOfMeasurement: { type: Object, required: false },
    observationArea: { type: Object, required: false },
    theme:  { type: [String], required: false },
    dataQuality:  { type: String, required: false },
    isActive: { type: Boolean, required: false },
    isPublic: { type: Boolean, required: false },
    isOpenData: { type: Boolean, required: false },
    containsPersonalInfoData: { type: Boolean, required: false },
    isReusable: { type: Boolean, required: false },
    documentation:  { type: String, required: false },
    dataLink:  { type: String, required: false },
    observationGoals: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: false },
        legalGround: { type: String, required: false },
        legalGroundLink: { type: String, required: false },
    }],
});
DataStreamSchema.index({ sensorId: 1 });

export const DataStream = model<IDataStream, Model<IDataStream>>('DataStream', DataStreamSchema);
