import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ContactDetailsParams {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'The contact details ID.',
    })
    readonly contactDetailsId: string;
}
