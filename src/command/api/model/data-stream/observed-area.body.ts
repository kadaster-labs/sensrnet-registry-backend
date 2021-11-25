import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class ObservedAreaBody {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        required: true,
        description: 'Observed area radius.',
    })
    readonly radius: number;
}
