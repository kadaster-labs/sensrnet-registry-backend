import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthenticateBody {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'The user name.',
    })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'The user password.',
    })
    readonly password: string;
}
