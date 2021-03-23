import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LegalEntitiesQuery } from './query/legal-entities.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LegalEntitiesParams } from './model/legal-entities-params';
import { AccessAnonymousAuthGuard } from '../../auth/guard/access-anonymous-auth.guard';
import { ILegalEntity } from '../model/legal-entity.model';

@ApiBearerAuth()
@UseGuards(AccessAnonymousAuthGuard)
@ApiTags('LegalEntities')
@Controller('legalentities')
export class LegalEntitiesController {
  constructor(private readonly queryBus: QueryBus) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve Legal Entities' })
  @ApiResponse({ status: 200, description: 'Legal Entities retrieved' })
  @ApiResponse({ status: 400, description: 'Legal Entities retrieval failed' })
  async retrieveLegalEntities(@Query() { website, deviceId, allNodes }: LegalEntitiesParams): Promise<ILegalEntity[]> {
    return this.queryBus.execute(new LegalEntitiesQuery(website, deviceId, allNodes));
  }
}
