import { Document } from 'mongoose';

export interface Checkpoint extends Document {
    _id: string;
    offset: number;
}
