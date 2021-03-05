import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RetrieveOrganizationQuery } from '../model/retrieve-organization.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
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
