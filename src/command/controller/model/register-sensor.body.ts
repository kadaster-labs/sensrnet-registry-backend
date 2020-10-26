import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationBody } from './location.body';
import { Theme } from './theme.body';
import { DatastreamBody } from './datastream.body';
import { IsString, IsNotEmpty, IsBoolean, IsObject, IsArray, IsUrl, ValidateNested, IsOptional, ValidateIf } from 'class-validator';

export class RegisterSensorBody {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the sensor.',
  })
  readonly name: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({
    type: LocationBody,
  })
  @Type(() => LocationBody)
  readonly location: LocationBody;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: DatastreamBody,
    isArray: true,
  })
  @Type(() => DatastreamBody)
  @ValidateNested({ each: true })
  readonly dataStreams: DatastreamBody[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The goal of the sensor.',
  })
  readonly aim: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'A description of the sensor.',
  })
  readonly description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the sensor manufacturer.',
  })
  readonly manufacturer: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    default: true,
    required: false,
    description: 'Whether the sensor is active.',
  })
  readonly active: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Object,
    required: false,
    description: 'GeoJSON of a drawn area (https://openlayers.org/en/latest/examples/draw-freehand.html?q=freehand).',
  })
  readonly observationArea: Record<string, any>;

  @ValidateIf(e => e.documentationUrl !== '')
  @IsUrl()
  @IsOptional()
  @ApiProperty({
      type: String,
      required: false,
      description: 'A link to sensor documentation.',
  })
  readonly documentationUrl: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
      type: String,
      isArray: true,
      required: false,
      enum: Theme,
      description: 'The sensor theme.',
  })
  readonly theme: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The type of sensor.',
  })
  readonly typeName: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Object,
    required: false,
    description: 'Type-specific characteristics of the sensor.',
  })
  readonly typeDetails: Record<string, any>;
}
