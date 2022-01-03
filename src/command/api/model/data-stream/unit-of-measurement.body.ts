import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UnitOfMeasurementBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Unit of measurement name.',
    })
    readonly name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Unit of measurement symbol.',
    })
    readonly symbol: string;
}
