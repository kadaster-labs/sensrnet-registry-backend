import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ContactDetailsBody } from './model/contact-details/contact-details.body';
import { ContactDetailsParams } from './model/legal-entity/contact-details.params';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateLegalEntityBody as UpdateOrganizationBody } from './model/legal-entity/update-organization.body';
import { RegisterOrganizationBody } from './model/legal-entity/register-organization.body';
import { DeleteLegalEntityParams } from './model/legal-entity/delete-legal-entity.params';
import { UpdateLegalEntityCommand } from '../command/legal-entity/update-legal-entity.command';
import { RemoveLegalEntityCommand } from '../command/legal-entity/remove-legal-entity.command';
import { RegisterOrganizationCommand } from '../command/legal-entity/register-organization.command';
import { RemoveContactDetailsCommand } from '../command/legal-entity/remove-contact-details.command';
import { UseFilters, Controller, Post, Body, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { UpdateContactDetailsCommand } from '../command/legal-entity/update-contact-details.command copy';
import { AddPublicContactDetailsCommand } from '../command/legal-entity/add-public-contact-details.command';

@ApiTags('LegalEntity')
@Controller('legalentity')
export class LegalEntityController {
  constructor(
      private readonly commandBus: CommandBus,
      ) { }

  @Post('/organization')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register organization' })
  @ApiResponse({ status: 200, description: 'Organization registered' })
  @ApiResponse({ status: 400, description: 'Organization registration failed' })
  async registerOrganization(@Req() req: Request,
                            @Body() registerOrganizationBody: RegisterOrganizationBody): Promise<Record<string, any>> {
    const user: Record<string, any> = req.user;

    const legalEntityId = v4();
    await this.commandBus.execute(new RegisterOrganizationCommand(legalEntityId, user.userId, registerOrganizationBody.name,
        registerOrganizationBody.website));

    const contactDetailsId = v4();
    await this.commandBus.execute(new AddPublicContactDetailsCommand(legalEntityId, contactDetailsId,
        registerOrganizationBody.contactDetails.name, registerOrganizationBody.contactDetails.email, registerOrganizationBody.contactDetails.phone));

    return { legalEntityId, contactDetailsId };
  }

  @Put('/organization')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  @ApiResponse({ status: 400, description: 'Organization update failed' })
  async updateOrganization(@Req() req: Request, @Body() updateOrganizationBody: UpdateOrganizationBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateLegalEntityCommand(user.legalEntityId, updateOrganizationBody.name,
        updateOrganizationBody.website));
  }

  @Put('/contactdetails/:contactDetailsId')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update contact details' })
  @ApiResponse({ status: 200, description: 'Contact details updated' })
  @ApiResponse({ status: 400, description: 'Contact details update failed' })
  async updateContactDetails(@Req() req: Request,  @Param() params: ContactDetailsParams,
                             @Body() updateContactDetailsBody: ContactDetailsBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateContactDetailsCommand(user.legalEntityId, params.contactDetailsId,
        updateContactDetailsBody.name, updateContactDetailsBody.email, updateContactDetailsBody.phone));
  }

  @Delete()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseFilters(new DomainExceptionFilter())
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Remove legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity removed' })
  @ApiResponse({ status: 400, description: 'Legal entity removal failed' })
  async removeLegalEntity(@Req() req: Request): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new RemoveLegalEntityCommand(user.legalEntityId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseFilters(new DomainExceptionFilter())
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity deleted' })
  @ApiResponse({ status: 400, description: 'Legal entity delete failed' })
  async deleteLegalEntityById(@Req() req: Request, @Param() param: DeleteLegalEntityParams): Promise<any> {
    return await this.commandBus.execute(new RemoveLegalEntityCommand(param.id));
  }

  @Delete('/contactdetails/:contactDetailsId')
  @ApiBearerAuth()
  @UseFilters(new DomainExceptionFilter())
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Remove contact details' })
  @ApiResponse({ status: 200, description: 'Contact details removed' })
  @ApiResponse({ status: 400, description: 'Contact details removal failed' })
  async removeContactDetails(@Req() req: Request, @Param() params: ContactDetailsParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new RemoveContactDetailsCommand(user.legalEntityId, params.contactDetailsId));
  }
}
