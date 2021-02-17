import { model, Schema, Document, Model } from 'mongoose';

export interface IDataStream extends Document {
    _id: string;
    sensorId: string;
    name: string;
    description?: string;
    unitOfMeasurement?: string;
    isPublic?: boolean;
    isOpenData?: boolean;
    isReusable?: boolean;
    containsPersonalInfoData?: boolean;
    documentationUrl?: string;
    dataLink?: string;
    dataFrequency?: number;
    dataQuality?: number;
    theme?: string[];
    observation?: {
        description?: string,
        observedProperty?: string,
        observedArea?: Record<string, any>,
        legalGround?: string,
    };
}

const ObservationSchema = new Schema({
    description: { type: String, required: false },
    observedProperty: { type: String, required: false },
    observedArea: { type: Object, required: false },
    legalGround: { type: String, required: false },
});

export const DataStreamSchema = new Schema({
    _id: { type: String, required: true },
    sensorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    unitOfMeasurement: { type: String, required: false },
    isPublic: { type: Boolean, required: false },
    isOpenData: { type: Boolean, required: false },
    isReusable: { type: Boolean, required: false },
    containsPersonalInfoData: { type: Boolean, required: false },
    documentationUrl:  { type: String, required: false },
    dataLink:  { type: String, required: false },
    dataFrequency:  { type: Number, required: false },
    dataQuality:  { type: Number, required: false },
    theme:  { type: [String], required: false },
    observation: ObservationSchema,
});
DataStreamSchema.index({ sensorId: 1 });

export const DataStream = model<IDataStream, Model<IDataStream>>('DataStream', DataStreamSchema);
