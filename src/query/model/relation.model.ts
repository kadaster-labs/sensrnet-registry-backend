import { model, Schema, Document, Model } from 'mongoose';

export enum RelationVariant {
    ACCOUNTABLE = 0,
    RESPONSIBLE = 1,
    DATA_PROCESSOR = 2,
    METADATA_ADMINISTRATOR = 3,
}

export enum TargetVariant {
    DEVICE = 0,
    OBSERVATION_GOAL = 1,
}

export interface IRelation extends Document {
    _id: string;
    legalEntityId: string;
    relationVariant: number;
    targetVariant: number;
    targetId: string;
}

export const RelationSchema = new Schema({
    legalEntityId: { type: String, required: true },
    relationVariant: { type: Number, required: true },
    targetVariant: { type: Number, required: true },
    targetId: { type: String, required: true },
});
RelationSchema.index({ legalEntityId: 1, targetVariant: 1, targetId: 1 });

export const Relation = model<IRelation, Model<IRelation>>('Relation', RelationSchema);
