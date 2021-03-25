import { QueryBus } from '@nestjs/cqrs';
import { LegalEntitiesQuery } from './query/legal-entities.query';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LegalEntitiesParams } from './model/legal-entities-params';
import { jwtConstants } from '../../auth/constants';
import { AccessAnonymousAuthGuard } from '../../auth/guard/access-anonymous-auth.guard';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { ILegalEntity } from '../model/legal-entity.model';

@ApiBearerAuth()
@UseGuards(jwtConstants.enabled ? AccessJwtAuthGuard : AccessAnonymousAuthGuard)
@ApiTags('LegalEntities')
@Controller('legalentities')
export class LegalEntitiesController {
  constructor(private readonly queryBus: QueryBus) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve Legal Entities' })
  @ApiResponse({ status: 200, description: 'Legal Entities retrieved' })
  @ApiResponse({ status: 400, description: 'Legal Entities retrieval failed' })
  async retrieveLegalEntities(@Query() { name, deviceId, allNodes }: LegalEntitiesParams): Promise<ILegalEntity[]> {
    return this.queryBus.execute(new LegalEntitiesQuery(name, deviceId, allNodes));
  }
}
