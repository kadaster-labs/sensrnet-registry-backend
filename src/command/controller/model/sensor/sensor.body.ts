import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, ValidateIf, IsUrl, MaxLength } from 'class-validator';

export class SensorBody {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor supplier.',
  })
  readonly supplier: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor manufacturer.',
  })
  readonly manufacturer: string;

  @ValidateIf(e => e.documentationUrl !== '')
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'A link to sensor documentation.',
  })
  readonly documentationUrl: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    default: true,
    required: false,
    description: 'Whether the sensor is active.',
  })
  readonly active: boolean;
}
