import { Type } from 'class-transformer';
import { Category } from './category.body';
import { ApiProperty } from '@nestjs/swagger';
import { ChangeSensorBody } from './change-sensor.body';
import { CreateDatastreamBody } from './create-datastream.body';
import { IsString, IsNotEmpty, IsBoolean, IsArray, ValidateNested, ArrayMinSize, ArrayMaxSize,
  IsOptional } from 'class-validator';

export class RegisterSensorBody extends ChangeSensorBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The sensor name.',
  })
  readonly name: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Type(() => Number)
  readonly location: number[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Reference to an external ID.',
  })
  readonly baseObjectId: string;

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
