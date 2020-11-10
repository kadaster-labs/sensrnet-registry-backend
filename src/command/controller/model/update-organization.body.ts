import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class UpdateOrganizationBody {
  @ValidateIf(e => e.website !== '')
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The organization website.',
  })
  readonly website: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Name of the contact person.',
  })
  readonly contactName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Email of the contact person.',
  })
  readonly contactEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Phone number of the contact person.',
  })
  readonly contactPhone: string;
}
