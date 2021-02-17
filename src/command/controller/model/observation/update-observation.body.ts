import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ObservationBody } from './observation.body';

export class UpdateObservationBody extends ObservationBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Observation description.',
    })
    readonly description: string;
}
