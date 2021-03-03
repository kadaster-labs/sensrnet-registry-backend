import { ApiProperty } from '@nestjs/swagger';
import { DeviceBody } from './device.body';
import { IsString, IsOptional, MaxLength, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../category.body';
import { UpdateLocationBody } from '../location/update-location.body';

export class UpdateDeviceBody extends DeviceBody {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The device name.',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The device category.',
  })
  readonly category: Category;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: UpdateLocationBody,
    required: false,
  })
  @Type(() => UpdateLocationBody)
  readonly location: UpdateLocationBody;
}
