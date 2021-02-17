import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Description } from '../description.body';
import { SensorBody } from './sensor.body';
import { RegisterDatastreamBody } from '../data-stream/register-datastream.body';
import { IsString, IsNotEmpty, IsArray, MaxLength, IsOptional, ValidateNested } from 'class-validator';

export class RegisterSensorBody extends SensorBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The sensor name.',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The associated deviceId.',
  })
  readonly deviceId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    enum: Description,
    required: true,
    description: 'The sensor description.',
  })
  readonly description: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: RegisterDatastreamBody,
    isArray: true,
    required: false,
  })
  @Type(() => RegisterDatastreamBody)
  @ValidateNested({ each: true })
  readonly dataStreams: RegisterDatastreamBody[];
}
