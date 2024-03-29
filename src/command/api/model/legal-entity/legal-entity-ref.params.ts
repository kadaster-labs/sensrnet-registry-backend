import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LegalEntityReferenceParams {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'The legal entity ID.',
    })
    readonly id: string;
}
