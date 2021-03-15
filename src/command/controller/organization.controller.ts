  
import { CommandBus } from '@nestjs/cqrs';
import { UserService } from '../../user/user.service';
import { Roles } from '../../core/guards/roles.decorator';
import { UpdateOrganizationBody } from './model/update-organization.body';
import { DeleteOrganizationParams } from './model/delete-organization.params';
import { RegisterOrganizationBody } from './model/register-organization.body';
import { UpdateOrganizationCommand } from '../model/update-organization.command';
import { DeleteOrganizationCommand } from '../model/delete-organization.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterOrganizationCommand } from '../model/register-organization.command';
import { UseFilters, Controller, Post, Body, Put, Delete, Request, Param } from '@nestjs/common';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register organization' })
  @ApiResponse({ status: 200, description: 'Organization registered' })
  @ApiResponse({ status: 400, description: 'Organization registration failed' })
  async registerOrganization(@Body() registerOrganizationBody: RegisterOrganizationBody): Promise<Record<string, any>> {
    const organizationId = registerOrganizationBody.name;

    await this.commandBus.execute(new RegisterOrganizationCommand(organizationId, registerOrganizationBody.website,
        registerOrganizationBody.contactName, registerOrganizationBody.contactEmail, registerOrganizationBody.contactPhone));

    return { organizationId };
  }

  @Put()
  @ApiBearerAuth()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  @ApiResponse({ status: 400, description: 'Organization update failed' })
  async updateOrganization(@Request() req, @Body() updateOrganizationBody: UpdateOrganizationBody): Promise<any> {
    const { userId } = req.user;
    const organizationId: string = await this.userService.getOrganizationId(userId);
    return await this.commandBus.execute(new UpdateOrganizationCommand(organizationId, updateOrganizationBody.website,
        updateOrganizationBody.contactName, updateOrganizationBody.contactEmail, updateOrganizationBody.contactPhone));
  }

  @Delete()
  @ApiBearerAuth()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove organization' })
  @ApiResponse({ status: 200, description: 'Organization removed' })
  @ApiResponse({ status: 400, description: 'Organization removal failed' })
  async removeOrganization(@Request() req): Promise<any> {
    const { userId } = req.user;
    const organizationId: string = await this.userService.getOrganizationId(userId);
    return await this.commandBus.execute(new DeleteOrganizationCommand(organizationId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove organization' })
  @ApiResponse({ status: 200, description: 'Organization removed' })
  @ApiResponse({ status: 400, description: 'Organization removal failed' })
  async removeOwnerById(@Request() req: Request, @Param() param: DeleteOrganizationParams): Promise<any> {
    return await this.commandBus.execute(new DeleteOrganizationCommand(param.id));
  }
}
