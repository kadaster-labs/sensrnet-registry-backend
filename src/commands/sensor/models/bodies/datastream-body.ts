import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsUrl, IsNumber, IsUUID, 
    IsNotEmpty, IsOptional } from 'class-validator';


export class DataStreamBody {

    @IsUUID(4)
    @IsOptional()
    dataStreamId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'DataStream name.'
    })
    readonly name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Reason for the DataStream.'
    })
    readonly reason: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'DataStream description.'
    })
    readonly description: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'The property the DataStream observes (e.g. temperature).'
    })
    readonly observedProperty: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'DataStream unit of measurement.'
    })
    readonly unitOfMeasurement: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,        
        description: 'Whether the DataStream is public.'
    })
    readonly isPublic: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,        
        description: 'Whether the DataStream is considered open data.'
    })
    readonly isOpenData: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,        
        description: 'Whether the DataStream is reusable.'
    })
    readonly isReusable: boolean;

    @IsUrl()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,        
        description: 'A link to sensor documentation.'
    })
    readonly documentationUrl: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,        
        description: 'Data link.'
    })
    readonly dataLink: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,        
        description: 'Data frequency.'
    })
    readonly dataFrequency: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,        
        description: 'Data quality.'
    })
    readonly dataQuality: number;
}
