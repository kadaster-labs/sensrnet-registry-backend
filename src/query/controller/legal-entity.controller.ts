import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { LegalEntityQuery } from './query/legal-entity.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('LegalEntity')
@Controller('legalentity')
export class LegalEntityController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Legal Entity' })
  @ApiResponse({ status: 200, description: 'Legal Entity retrieved' })
  @ApiResponse({ status: 400, description: 'Legal Entity retrieval failed' })
  async retrieveOrganization(@Req() req: Request): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.queryBus.execute(new LegalEntityQuery(user.legalEntityId));
  }
}
