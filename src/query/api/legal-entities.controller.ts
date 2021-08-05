import { QueryBus } from '@nestjs/cqrs';
import { LegalEntitiesQuery } from '../model/legal-entities.query';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LegalEntitiesParams } from './model/legal-entities-params';
import { ILegalEntity } from '../model/legal-entity.schema';
import { Public } from '../../auth/public';

@ApiBearerAuth()
@ApiTags('LegalEntities')
@Controller('legalentities')
export class LegalEntitiesController {
  constructor(private readonly queryBus: QueryBus) { }
  
  @Get()
  @Public()
  @ApiOperation({ summary: 'Retrieve Legal Entities' })
  @ApiResponse({ status: 200, description: 'Legal Entities retrieved' })
  @ApiResponse({ status: 400, description: 'Legal Entities retrieval failed' })
  async retrieveLegalEntities(@Query() { name, deviceId, allNodes }: LegalEntitiesParams): Promise<ILegalEntity[]> {
    return this.queryBus.execute(new LegalEntitiesQuery(name, deviceId, allNodes));
  }
}
