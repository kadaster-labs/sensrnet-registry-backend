import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';


export class UpdateOwnerBody {

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sso ID of the owner.'
  })
  readonly ssoId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The email of the owner.'
  })
  readonly email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The public name (alias) of the owner.'
  })
  readonly publicName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the owner.'
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the company the owner is associated with.'
  })
  readonly companyName: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The website of the owner (company).'
  })
  readonly website: string;
}
