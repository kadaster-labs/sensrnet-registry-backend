import { model, Schema, Document, Model } from 'mongoose';

export enum RelationVariant {
    DEVICE_OWNER,
    SENSOR_OWNER,
    TECHNICAL_STEWARD,
    LEGAL_STEWARD,
    DATA_STEWARD,
}

export enum ObjectVariant {
    DEVICE,
    SENSOR,
    DATA_STREAM,
}

export interface IRelation extends Document {
    _id: string;
    legalEntityId: string;
    relationVariant: number;
    objectVariant: number;
    objectId: string;
}

export const RelationSchema = new Schema({
    legalEntityId: { type: String, required: true },
    relationVariant: { type: Number, required: true },
    objectVariant: { type: Number, required: true },
    objectId: { type: String, required: true },
});
RelationSchema.index({ legalEntityId: 1, objectVariant: 1 });
RelationSchema.index({ objectVariant: 1, objectId: 1 });

export const Relation = model<IRelation, Model<IRelation>>('Relation', RelationSchema);
