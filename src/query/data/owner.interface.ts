import { Document } from 'mongoose';

export interface Owner extends Document {
    _id: string;
    nodeId: string;
    organisationName?: string;
    website?: string;
    name?: string;
    contactEmail: string;
    contactPhone: string;
}
