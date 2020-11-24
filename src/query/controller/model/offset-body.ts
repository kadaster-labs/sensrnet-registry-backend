import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class OffsetBody {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        required: true,
        description: 'New offset.',
    })
    readonly offset: number;

}
