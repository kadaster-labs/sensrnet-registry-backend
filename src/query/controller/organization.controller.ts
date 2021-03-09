import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Req } from '@nestjs/common';
import { RetrieveOrganizationQuery } from '../model/retrieve-organization.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../../user/user.service';

@ApiBearerAuth()
@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userService: UserService,
    ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Organization' })
  @ApiResponse({ status: 200, description: 'Organization retrieved' })
  @ApiResponse({ status: 400, description: 'Organization retrieval failed' })
  async retrieveOrganization(@Req() req): Promise<any> {
    const { userId } = req.user;
    const organizationId: string = await this.userService.getOrganizationId(userId);
    return await this.queryBus.execute(new RetrieveOrganizationQuery(organizationId));
  }
}
