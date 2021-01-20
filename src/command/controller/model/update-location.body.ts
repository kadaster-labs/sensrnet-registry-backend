import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateLocationBody {
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(3)
    @ArrayMaxSize(3)
    @ApiProperty({
        type: Number,
        isArray: true,
    })
    @Type(() => Number)
    readonly location: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Reference to an external ID.',
    })
    readonly baseObjectId: string;
}
