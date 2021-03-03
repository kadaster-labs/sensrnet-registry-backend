import { model, Schema, Document, Model } from 'mongoose';

export enum RelationVariant {
    DEVICE_OWNER = 0,
    TECHNICAL_STEWARD = 1,
    LEGAL_STEWARD = 2,
    DATA_STEWARD = 3,
}

export interface IRelation extends Document {
    _id: string;
    legalEntityId: string;
    relationVariant: number;
    deviceId: string;
}

export const RelationSchema = new Schema({
    legalEntityId: { type: String, required: true },
    relationVariant: { type: Number, required: true },
    deviceId: { type: String, required: true },
});
RelationSchema.index({ legalEntityId: 1, relationVariant: 1 });

export const Relation = model<IRelation, Model<IRelation>>('Relation', RelationSchema);
