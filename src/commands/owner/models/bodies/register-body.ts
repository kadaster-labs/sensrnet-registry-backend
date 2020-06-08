import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class RegisterOwnerBody {

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The SSO ID of the owner.',
  })
  readonly ssoId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The email of the owner.',
  })
  readonly email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The public name (alias) of the owner.',
  })
  readonly publicName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The name of the owner.',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the company the owner is associated with.',
  })
  readonly companyName: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The website of the owner (company).',
  })
  readonly website: string;
}
