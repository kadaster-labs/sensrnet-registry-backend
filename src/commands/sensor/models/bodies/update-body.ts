import { Theme } from './theme-body';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsObject, IsOptional, IsArray } from 'class-validator';

export class UpdateSensorBody {

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the sensor.',
  })
  readonly name: string;

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

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Object,
    required: false,
    description: 'GeoJSON of a drawn area (https://openlayers.org/en/latest/examples/draw-freehand.html?q=freehand).',
  })
  readonly observationArea: object;

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
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
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
  readonly typeDetails: object;
}
