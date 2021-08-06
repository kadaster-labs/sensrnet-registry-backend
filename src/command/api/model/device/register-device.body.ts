import { Type } from 'class-transformer';
import { DeviceBody } from './device.body';
import { Category } from '../../../model/category.model';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterLocationBody } from '../location/register-location.body';
import { IsString, IsNotEmpty, MaxLength, IsObject, ValidateNested, IsEnum } from 'class-validator';

export class RegisterDeviceBody extends DeviceBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The device name.',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Category)
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
    enum: Category,
    description: 'The device category.',
  })
  readonly category: Category;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({
    type: RegisterLocationBody,
    required: true,
  })
  @Type(() => RegisterLocationBody)
  readonly location: RegisterLocationBody;
}
