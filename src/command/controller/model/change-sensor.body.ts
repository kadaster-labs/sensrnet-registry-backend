import { Theme } from './theme.body';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsArray, IsUrl, IsOptional, ValidateIf } from 'class-validator';

export class ChangeSensorBody {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor goal.',
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
    description: 'Name of the sensor manufacturer.',
  })
  readonly manufacturer: string;

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

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Object,
    required: false,
    description: 'Type-specific characteristics of the sensor.',
  })
  readonly typeDetails: Record<string, any>;
}
