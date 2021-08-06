import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

export type RelationDocument = IRelation & Document;

@Schema()
export class IRelation {
    @Prop({ required: true })
    _id: string;
    @Prop({ required: true, index: true })
    legalEntityId: string;
    @Prop({ required: true })
    relationVariant: number;
    @Prop({ required: true })
    targetVariant: number;
    @Prop({ required: true })
    targetId: string;
}

export const relationSchema = SchemaFactory.createForClass(IRelation);
relationSchema.index({ targetVariant: 1, targetId: 1 });

// export const Relation = model<IRelation, Model<IRelation>>('Relation', RelationSchema);
