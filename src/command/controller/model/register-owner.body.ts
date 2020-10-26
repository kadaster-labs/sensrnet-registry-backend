import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class RegisterOwnerBody {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the owner organization.',
  })
  readonly organisationName: string;

  @ValidateIf(e => e.website !== '')
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The website of the owner organization.',
  })
  readonly website: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The name of the owner.',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The contact email of the owner.',
  })
  readonly contactEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The contact phone of the owner.',
  })
  readonly contactPhone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The (unique) email of the owner user.',
  })
  readonly email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The password of the owner user.',
  })
  readonly password: string;
}
