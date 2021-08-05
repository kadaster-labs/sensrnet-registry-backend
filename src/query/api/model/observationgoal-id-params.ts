import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class ObservationGoalIdParams {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly observationGoalId: string;
}
