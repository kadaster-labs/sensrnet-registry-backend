import { ApiProperty } from '@nestjs/swagger';
import { DeviceBody } from './device.body';
import { IsString, IsOptional, MaxLength, IsArray, IsNotEmpty, ArrayMinSize, ArrayMaxSize, IsNumber, Validate } from 'class-validator';
import { LongitudeLatitudeValidator } from '../../validation/location';
import { Type } from 'class-transformer';

export class UpdateDeviceBody extends DeviceBody {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: false,
    description: 'The device description.',
  })
  readonly description: string;


  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(3)
  @IsNumber({}, {each: true})
  @ApiProperty({
    type: Number,
    isArray: true,
    required: false,
  })
  @Validate(LongitudeLatitudeValidator)
  @Type(() => Number)
  readonly location: number[];
}
