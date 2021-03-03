import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export abstract class ObservationGoalBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Legal ground for the observation.',
    })
    readonly legalGround: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Legal ground link for the observation.',
    })
    readonly legalGroundLink: string;
}
