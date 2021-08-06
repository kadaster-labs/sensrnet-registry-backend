export default interface Datastream {
    datastreamId: string;
    name?: string;
    description?: string;
    unitOfMeasurement?: Record<string, any>;
    observedArea?: Record<string, any>;
    theme?: string[];
    dataQuality?: string;
    isActive?: boolean;
    isPublic?: boolean;
    isOpenData?: boolean;
    containsPersonalInfoData?: boolean;
    isReusable?: boolean;
    documentation?: string;
    dataLink?: string;
}
