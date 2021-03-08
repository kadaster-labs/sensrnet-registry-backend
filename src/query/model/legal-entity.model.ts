import { model, Schema, Document, Model, Types } from 'mongoose';

export interface IContactDetails extends Document {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
}

export interface ILegalEntity extends Document {
    _id: string;
    website: string;
    originSync?: string;
    contactDetails?: Types.Array<IContactDetails>;
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
    contactDetails: [ContactDetailsSchema],
});
LegalEntitySchema.index({ website: 1 });

export const LegalEntity = model<ILegalEntity, Model<ILegalEntity>>('LegalEntity', LegalEntitySchema);
