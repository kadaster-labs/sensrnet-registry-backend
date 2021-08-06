import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RetrieveObservationGoalsBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Name filter.',
    })
    @Type(() => String)
    readonly name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Field to sort.',
    })
    @Type(() => String)
    readonly sortField: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Direction to sort.',
    })
    @Type(() => String)
    readonly sortDirection: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,
        description: 'Page index.',
    })
    @Type(() => Number)
    readonly pageIndex: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,
        description: 'Page size.',
    })
    @Type(() => Number)
    readonly pageSize: number;
}
