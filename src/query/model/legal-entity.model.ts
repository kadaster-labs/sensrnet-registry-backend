import { model, Schema, Document, Model } from 'mongoose';

export interface ILegalEntity extends Document {
    _id: string;
    website: string;
    originSync?: string;
    contactDetails?: {
        name: string,
        email: string,
        phone: string,
    };
}

const ContactDetailsSchema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
});

export const LegalEntitySchema = new Schema({
    _id: { type: String, required: true },
    website: { type: String, required: true },
    originSync: { type: Boolean, required: false },
    contactDetails: ContactDetailsSchema,
});
LegalEntitySchema.index({ name: 1 });

export const LegalEntity = model<ILegalEntity, Model<ILegalEntity>>('LegalEntity', LegalEntitySchema);
