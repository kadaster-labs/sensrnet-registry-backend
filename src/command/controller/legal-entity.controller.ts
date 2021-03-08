import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { LegalEntityBody } from './model/legal-entity/legal-entity.body';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteLegalEntityParams } from './model/legal-entity/delete-legal-entity.params';
import { UpdateLegalEntityCommand } from '../command/legal-entity/update-legal-entity.command';
import { UpdateContactDetailsCommand } from '../command/legal-entity/update-contact-details.command copy';
import { DeleteLegalEntityCommand } from '../command/legal-entity/delete-legal-entity.command';
import { RegisterLegalEntityCommand } from '../command/legal-entity/register-legal-entity.command';
import { AddPublicContactDetailsCommand } from '../command/legal-entity/add-public-contact-details.command';
import { UseFilters, Controller, Post, Body, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { ContactDetailsBody } from './model/contact-details/contact-details.body';

@ApiTags('LegalEntity')
@Controller('legalentity')
export class LegalEntityController {
  constructor(private readonly commandBus: CommandBus) { }

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity registered' })
  @ApiResponse({ status: 400, description: 'Legal entity registration failed' })
  async registerLegalEntity(@Body() registerLegalEntityBody: LegalEntityBody): Promise<Record<string, any>> {
    const legalEntityID = v4();
    const contactDetailsID = v4();

    await this.commandBus.execute(new RegisterLegalEntityCommand(legalEntityID, registerLegalEntityBody.name, registerLegalEntityBody.website));
    await this.commandBus.execute(new AddPublicContactDetailsCommand(legalEntityID, contactDetailsID,
      registerLegalEntityBody.contactDetails.name, registerLegalEntityBody.contactDetails.email, registerLegalEntityBody.contactDetails.phone))

    return { legalEntityID };
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity updated' })
  @ApiResponse({ status: 400, description: 'Legal entity update failed' })
  async updateLegalEntity(@Req() req: Request, @Body() updateLegalEntityBody: LegalEntityBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateLegalEntityCommand(user.legalEntityId, updateLegalEntityBody.name, updateLegalEntityBody.website));
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update contact details' })
  @ApiResponse({ status: 200, description: 'Contact details updated' })
  @ApiResponse({ status: 400, description: 'Contact details update failed' })
  async updateContactDetails(@Req() req: Request, @Body() updateContactDetailsBody: ContactDetailsBody): Promise<any> {
    const user: Record<string, any> = req.user;
    // TODO where does the contactDetailsId come from?
    return await this.commandBus.execute(new UpdateContactDetailsCommand(user.legalEntityId, "contactDetailsId", updateContactDetailsBody.name, updateContactDetailsBody.email, updateContactDetailsBody.phone));
  }

  @Delete()
  @ApiBearerAuth()
  @UseFilters(new DomainExceptionFilter())
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Remove legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity removed' })
  @ApiResponse({ status: 400, description: 'Legal entity removal failed' })
  async removeLegalEntity(@Req() req: Request): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new DeleteLegalEntityCommand(user.legalEntityId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseFilters(new DomainExceptionFilter())
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Remove legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity removed' })
  @ApiResponse({ status: 400, description: 'Legal entity removal failed' })
  async removeLegalEntityById(@Req() req: Request, @Param() param: DeleteLegalEntityParams): Promise<any> {
    return await this.commandBus.execute(new DeleteLegalEntityCommand(param.id));
  }

  // TODO @delete contact details have to be implemented

}
