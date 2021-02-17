import { ApiProperty } from '@nestjs/swagger';
import { Description } from '../description.body';
import { SensorBody } from './sensor.body';
import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateSensorBody extends SensorBody {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor name.',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The associated deviceId.',
  })
  readonly deviceId: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    enum: Description,
    required: false,
    description: 'The sensor description.',
  })
  readonly description: string;
}
