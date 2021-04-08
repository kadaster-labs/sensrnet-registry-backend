import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RetrieveObservationGoalsBody {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Name filter.',
  })
  @Type(() => String)
  readonly name: string;

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
}
