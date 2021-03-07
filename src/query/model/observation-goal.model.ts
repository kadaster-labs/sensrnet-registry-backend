import { Schema, Document, Types } from 'mongoose';

export interface IObservationGoal extends Document {
    _id: string;
    name: string;
    description?: string;
    legalGround?: string;
    legalGroundLink?: string;
}

export const ObservationGoalSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    legalGround: { type: String, required: false },
    legalGroundLink: { type: String, required: false },
});
