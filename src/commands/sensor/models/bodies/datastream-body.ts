import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';


export class DataStreamBody {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;
}
