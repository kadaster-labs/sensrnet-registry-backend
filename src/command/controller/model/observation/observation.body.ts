import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export abstract class ObservationBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Observed property.',
    })
    readonly observedProperty: string;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: Object,
        required: false,
        description: 'Bounding box of the observed area.',
    })
    readonly observedArea: Record<string, any>;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Legal ground for the observation.',
    })
    readonly legalGround: string;
}
