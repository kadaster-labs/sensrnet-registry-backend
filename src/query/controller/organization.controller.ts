import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { RetrieveOrganizationQuery } from '../model/retrieve-organization.query';
import { RetrieveOrganizationsQuery } from '../model/retrieve-organizations.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Organization' })
  @ApiResponse({ status: 200, description: 'Organization retrieved' })
  @ApiResponse({ status: 400, description: 'Organization retrieval failed' })
  async retrieveOrganization(@Req() req: Request): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.queryBus.execute(new RetrieveOrganizationQuery(user.organizationId));
  }
}
