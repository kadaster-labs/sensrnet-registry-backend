import { Schema } from 'mongoose';

export const OwnerSchema = new Schema({
    _id: { type: String, required: true },
    nodeId: { type: String, required: true },
    organisationName: { type: String, required: false },
    website: { type: String, required: false },
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: false },
});
