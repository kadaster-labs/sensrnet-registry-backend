import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class ObservationGoalIdParams {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The id of the device.',
  })
  readonly deviceId: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The id of the datastream.',
  })
  readonly dataStreamId: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The id of the observation goal.',
  })
  readonly observationGoalId: string;
}
