import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactDetailsDocument = IContactDetails & Document;

@Schema()
export class IContactDetails {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: false })
    name?: string;

    @Prop({ required: false })
    email?: string;

    @Prop({ required: false })
    phone?: string;

    @Prop({ required: true })
    isPublic: boolean;
}

export const contactDetailsSchema = SchemaFactory.createForClass(IContactDetails);

export type LegalEntityDocument = ILegalEntity & Document;

export class ILegalEntity {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true, index: true })
    name: string;

    @Prop({ required: false })
    website?: string;

    @Prop({ required: false })
    originSync?: string;

    @Prop({ type: [contactDetailsSchema], default: [] })
    contactDetails?: Types.Array<IContactDetails>;
}

// export const LegalEntity = model<ILegalEntity, Model<ILegalEntity>>('LegalEntity', LegalEntitySchema);
