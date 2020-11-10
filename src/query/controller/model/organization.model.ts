import { Schema } from 'mongoose';

export const OrganizationSchema = new Schema({
    _id: { type: String, required: true },
    website: { type: String, required: false },
    contactName: { type: String, required: false },
    contactEmail: { type: String, required: false },
    contactPhone: { type: String, required: false },
}, {
  autoCreate: true,
});
