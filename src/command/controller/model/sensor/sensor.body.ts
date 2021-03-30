import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateIf, IsUrl, MaxLength } from 'class-validator';

export class SensorBody {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor manufacturer.',
  })
  readonly manufacturer: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor supplier.',
  })
  readonly supplier: string;

  @ValidateIf(e => e.documentation !== '')
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'A link to sensor documentation.',
  })
  readonly documentation: string;
}
