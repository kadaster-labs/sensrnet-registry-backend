import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsUrl, IsNumber, IsUUID, 
    IsNotEmpty, IsOptional } from 'class-validator';


export class DataStreamBody {

    @IsUUID(4)
    @IsOptional()
    id: string;

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
        description: 'DataStream description.'
    })
    readonly description: string;

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
        description: 'Whether the DataStream is open data.'
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
