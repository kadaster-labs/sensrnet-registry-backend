import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObservationBody } from './observation.body';

export class RegisterObservationBody extends ObservationBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Observation description.',
    })
    readonly description: string;
}
