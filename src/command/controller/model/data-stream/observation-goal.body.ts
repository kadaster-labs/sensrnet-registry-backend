import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export abstract class ObservationGoalBody {
    @IsUUID(4)
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'The id of the observation goal.',
    })
    readonly observationGoalId: string;
}
