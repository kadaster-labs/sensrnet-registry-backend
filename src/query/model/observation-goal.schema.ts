import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObservationGoalDocument = IObservationGoal & Document;

@Schema()
export class IObservationGoal {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    legalGround?: string;

    @Prop({ required: false })
    legalGroundLink?: string;
}

export const observationGoalSchema = SchemaFactory.createForClass(IObservationGoal);
