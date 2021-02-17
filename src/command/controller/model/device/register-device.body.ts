import { ApiProperty } from '@nestjs/swagger';
import { DeviceBody } from './device.body';
import { IsString, IsNotEmpty, MaxLength, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber, Validate } from 'class-validator';
import { LongitudeLatitudeValidator } from '../../validation/location';
import { Type } from 'class-transformer';

export class RegisterDeviceBody extends DeviceBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
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
    required: true,
  })
  @Validate(LongitudeLatitudeValidator)
  @Type(() => Number)
  readonly location: number[];
}
