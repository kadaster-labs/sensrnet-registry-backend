import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class LegalEntitiesParams {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Get the legal entities which are linked to a certain device.',
  })
  readonly deviceId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Filter to apply to website.',
  })
  readonly website: string;
}
