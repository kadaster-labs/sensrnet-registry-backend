import { Type } from 'class-transformer';
import { Category } from './category.body';
import { ApiProperty } from '@nestjs/swagger';
import { LocationBody } from './location.body';
import { ChangeSensorBody } from './change-sensor.body';
import { CreateDatastreamBody } from './create-datastream.body';
import { IsString, IsNotEmpty, IsBoolean, IsObject, IsArray, ValidateNested, IsOptional } from 'class-validator';

export class RegisterSensorBody extends ChangeSensorBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The sensor name.',
  })
  readonly name: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({
    type: LocationBody,
  })
  @Type(() => LocationBody)
  readonly location: LocationBody;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: CreateDatastreamBody,
    isArray: true,
  })
  @Type(() => CreateDatastreamBody)
  @ValidateNested({ each: true })
  readonly dataStreams: CreateDatastreamBody[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    default: true,
    required: false,
    description: 'Whether the sensor is active.',
  })
  readonly active: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    enum: Category,
    required: true,
    description: 'The sensor category.',
  })
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The type of sensor.',
  })
  readonly typeName: string;
}
