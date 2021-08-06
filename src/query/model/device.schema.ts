import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DatastreamDocument = IDatastream & Document;

@Schema()
export class IDatastream {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true })
    sensorId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    unitOfMeasurement?: Record<string, any>;

    @Prop({ required: false })
    observationArea?: Record<string, any>;

    @Prop({ required: false })
    theme?: string[];

    @Prop({ required: false })
    dataQuality?: string;

    @Prop({ required: false })
    isActive?: boolean;

    @Prop({ required: false })
    isPublic?: boolean;

    @Prop({ required: false })
    isOpenData?: boolean;

    @Prop({ required: false })
    containsPersonalInfoData?: boolean;

    @Prop({ required: false })
    isReusable?: boolean;

    @Prop({ required: false })
    documentation?: string;

    @Prop({ required: false })
    dataLink?: string;

    @Prop({ required: false })
    observationGoalIds?: string[];
}

export const datastreamSchema = SchemaFactory.createForClass(IDatastream);

export type SensorDocument = ISensor & Document;

@Schema()
export class ISensor {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: false })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: true })
    type?: string;

    @Prop({ required: false })
    manufacturer?: string;

    @Prop({ required: false })
    supplier?: string;

    @Prop({ required: false })
    documentation?: string;
}

export const sensorSchema = SchemaFactory.createForClass(ISensor);

export type LocationDetailsDocument = ILocationDetails & Document;

@Schema()
export class ILocationDetails {
    @Prop({ required: false })
    _id?: string;

    @Prop({ required: false })
    name?: string;

    @Prop({ required: false })
    description?: string;
}

export const locationDetailsSchema = SchemaFactory.createForClass(ILocationDetails);

export type LocationDocument = Location & Document;

@Schema()
export class Location {
    @Prop({ enum: ['Point'], required: false })
    type: 'Point';

    @Prop({ required: false })
    coordinates: number[];
}
export const locationSchema = SchemaFactory.createForClass(Location);

@Schema()
export class IDevice {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    category?: string;

    @Prop({ required: false })
    connectivity?: string;

    @Prop({ required: false })
    locationDetails?: ILocationDetails;

    @Prop({ type: locationSchema, required: false })
    location?: Location;

    @Prop({ type: [sensorSchema], default: [] })
    sensors: ISensor[];

    @Prop({ type: [datastreamSchema], default: [] })
    datastreams: IDatastream[];
}

export const deviceSchema = SchemaFactory.createForClass(IDevice);

deviceSchema.index({ location: '2dsphere' });
deviceSchema.index({ 'datastreams.observationGoalIds': 1 });
