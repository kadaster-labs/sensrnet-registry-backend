import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateOwnerBody {

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the owner organization.',
  })
  readonly organisationName: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The website of the owner organization.',
  })
  readonly website: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The name of the owner.',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
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
}
