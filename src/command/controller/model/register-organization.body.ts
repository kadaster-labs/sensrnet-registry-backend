import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChangeOrganizationBody } from './change-organization.body';

export class RegisterOrganizationBody extends ChangeOrganizationBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The organization name.',
  })
  readonly name: string;
}
