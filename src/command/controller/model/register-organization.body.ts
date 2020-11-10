import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class RegisterOrganizationBody {
  @ValidateIf(e => e.website !== '')
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
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
