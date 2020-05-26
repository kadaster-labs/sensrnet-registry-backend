import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from "class-validator";

export class SensorIdParams {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The sensorId of the sensor.'
  })
  readonly id: string;
}

export class DataStreamIdParams {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The sensorId of the sensor.'
  })
  readonly id: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The datastreamId of the datastream.'
  })
  readonly dataStreamId: string;
}
