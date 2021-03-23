import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

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

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    default: 'false',
    required: false,
    description: 'Whether to include legalEntities from other nodes. The legal entities are filtered by creation in the current node by default',
  })
  readonly allNodes: string;
}
