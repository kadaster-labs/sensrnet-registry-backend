import { Category } from './category.body';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ChangeSensorBody } from './change-sensor.body';

export class UpdateSensorBody extends ChangeSensorBody {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The sensor name.',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    enum: Category,
    required: false,
    description: 'The sensor category.',
  })
  readonly category: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The type of sensor.',
  })
  readonly typeName: string;
}
