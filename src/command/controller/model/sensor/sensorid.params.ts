import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class SensorIdParams {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The id of the sensor.',
  })
  readonly sensorId: string;
}
