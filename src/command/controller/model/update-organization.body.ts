import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';
import { ChangeOrganizationBody } from './change-organization.body';

export class UpdateOrganizationBody extends ChangeOrganizationBody {
  @ValidateIf(e => e.website !== '')
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The organization website.',
  })
  readonly website: string;
}
