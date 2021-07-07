import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max, IsString } from 'class-validator';

export class RetrieveDevicesParams {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Bottom left longitude.',
  })
  @Min(-180, { message: 'Longitude should be greater than or equal to -180' })
  @Max(180, { message: 'Longitude should be less than or equal to 180' })
  @Type(() => Number)
  readonly bottomLeftLongitude: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Bottom left latitude.',
  })
  @Min(-90, { message: 'Latitude should be greater than or equal to -90' })
  @Max(90, { message: 'Latitude should be less than or equal to 90' })
  @Type(() => Number)
  readonly bottomLeftLatitude: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Upper right longitude.',
  })
  @Min(-180, { message: 'Longitude should be greater than or equal to -180' })
  @Max(180, { message: 'Longitude should be less than or equal to 180' })
  @Type(() => Number)
  readonly upperRightLongitude: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Upper right latitude.',
  })
  @Min(-90, { message: 'Latitude should be greater than or equal to -90' })
  @Max(90, { message: 'Latitude should be less than or equal to 90' })
  @Type(() => Number)
  readonly upperRightLatitude: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Page index.',
  })
  @Type(() => Number)
  readonly pageIndex: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Page size.',
  })
  @Type(() => Number)
  readonly pageSize: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'A legal entity ID which must have rights over sensors.',
  })
  @Type(() => String)
  readonly legalEntityId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Field to sort.',
  })
  @Type(() => String)
  readonly sortField: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Direction to sort.',
  })
  @Type(() => String)
  readonly sortDirection: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Name filter.',
  })
  @Type(() => String)
  readonly name: string;
}
