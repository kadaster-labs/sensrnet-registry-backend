import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObservationGoalBody } from './observation-goal.body';

export class RegisterObservationGoalBody extends ObservationGoalBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Observation name.',
    })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Observation description.',
    })
    readonly description: string;
}
