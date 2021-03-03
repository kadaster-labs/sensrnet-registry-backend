import { SensorBody } from './sensor.body';
import { ApiProperty } from '@nestjs/swagger';
import { SensorType } from '../sensor-type.body';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AddSensorBody extends SensorBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The sensor name.',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The sensor description.',
  })
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    enum: SensorType,
    required: true,
    description: 'The sensor type.',
  })
  readonly type: string;
}
