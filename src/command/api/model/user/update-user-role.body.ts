import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateUserRoleBody {
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        description: 'The user role.',
    })
    readonly role: number;
}
