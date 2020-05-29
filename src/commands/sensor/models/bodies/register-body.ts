import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationBody } from './location-body';
import { Theme } from './theme-body';
import { DataStreamBody } from './datastream-body';
import { IsString, IsNotEmpty, IsBoolean, IsUUID, IsObject, IsArray, IsUrl, 
  ValidateNested, IsOptional } from 'class-validator';


  export class RegisterSensorBody {

  @IsOptional()
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Owner IDs.'
  })
  @IsUUID(4, {each: true})
  readonly ownerIds: Array<string>;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the sensor.'
  })
  readonly name: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    type: LocationBody
  })
  readonly location: LocationBody;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: DataStreamBody,
    isArray: true
  })
  @Type(() => DataStreamBody)
  @ValidateNested({ each: true })
  readonly dataStreams: Array<DataStreamBody>;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The goal of the sensor.'
  })
  readonly aim: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'A description of the sensor.'
  })
  readonly description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the sensor manufacturer.'
  })
  readonly manufacturer: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    default: true,
    required: false,
    description: 'Whether the sensor is active.'
  })
  readonly active: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Object,
    required: false,
    description: 'GeoJSON of a drawn area (https://openlayers.org/en/latest/examples/draw-freehand.html?q=freehand).'
  })
  readonly observationArea: object;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
      type: String,
      required: false,        
      description: 'A link to sensor documentation.'
  })
  readonly documentationUrl: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
      type: String,
      isArray: true,
      required: false,
      enum: Theme,  
      description: 'The sensor theme.'
  })
  readonly theme: Array<string>;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,     
    description: 'The type of sensor.'
  })
  readonly typeName: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Object,     
    description: 'Type-specific characteristics of the sensor.'
  })
  readonly typeDetails: object;
}
