import { Document } from 'mongoose';

export interface Organization extends Document {
    _id: string;
    website?: string;
    originSync?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
}
