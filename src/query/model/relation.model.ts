import { model, Schema, Document, Model } from 'mongoose';

export enum RelationVariant {
    DEVICE_OWNER = 0,
    TECHNICAL_STEWARD = 1,
    LEGAL_STEWARD = 2,
    DATA_STEWARD = 3,
}

export enum ObjectVariant {
    DEVICE = 0,
    SENSOR = 1,
    DATA_STREAM = 2,
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
