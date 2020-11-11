import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, ValidateIf } from 'class-validator';
import { ChangeOrganizationBody } from './change-organization.body';

export class RegisterOrganizationBody extends ChangeOrganizationBody {
  @ValidateIf(e => e.website !== '')
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The organization website.',
  })
  readonly website: string;
}
