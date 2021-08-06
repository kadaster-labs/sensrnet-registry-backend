import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ObservationGoalBody } from './observation-goal.body';

export class UpdateObservationGoalBody extends ObservationGoalBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Observation name.',
    })
    readonly name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Observation description.',
    })
    readonly description: string;
}
