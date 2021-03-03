import { SensorBody } from './sensor.body';
import { ApiProperty } from '@nestjs/swagger';
import { SensorType } from '../sensor-type.body';
import { IsString, IsOptional, MaxLength } from 'class-validator';

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
    description: 'The sensor description.',
  })
  readonly description: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    enum: SensorType,
    required: false,
    description: 'The sensor type.',
  })
  readonly type: string;
}
