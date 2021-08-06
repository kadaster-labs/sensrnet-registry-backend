import { model, Schema, Document, Model, Types } from 'mongoose';

export interface IContactDetails extends Document {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    isPublic: boolean;
}

export interface ILegalEntity extends Document {
    _id: string;
    name: string;
    website?: string;
    originSync?: string;
    contactDetails?: Types.Array<IContactDetails>;
}

export const ContactDetailsSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    isPublic: { type: Boolean, required: true },
});

export const LegalEntitySchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    website: { type: String, required: false },
    originSync: { type: Boolean, required: false },
    contactDetails: [ContactDetailsSchema],
});
LegalEntitySchema.index({ name: 1 });

export const LegalEntity = model<ILegalEntity, Model<ILegalEntity>>('LegalEntity', LegalEntitySchema);
