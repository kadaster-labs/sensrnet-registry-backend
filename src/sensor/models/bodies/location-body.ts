import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';


export class LocationBody {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly lat: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly lon: number;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly height: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly baseObjectId: string;
}
