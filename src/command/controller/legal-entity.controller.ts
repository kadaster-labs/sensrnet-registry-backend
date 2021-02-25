import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateLegalEntityBody } from './model/legal-entity/update-legal-entity.body';
import { RegisterLegalEntityBody } from './model/legal-entity/register-legal-entity.body';
import { DeleteLegalEntityParams } from './model/legal-entity/delete-legal-entity.params';
import { UpdateLegalEntityCommand } from '../command/legal-entity/update-legal-entity.command';
import { DeleteLegalEntityCommand } from '../command/legal-entity/delete-legal-entity.command';
import { RegisterLegalEntityCommand } from '../command/legal-entity/register-legal-entity.command';
import { UseFilters, Controller, Post, Body, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';

@ApiTags('LegalEntity')
@Controller('legalentity')
export class LegalEntityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity registered' })
  @ApiResponse({ status: 400, description: 'Legal entity registration failed' })
  async registerLegalEntity(@Body() registerLegalEntityBody: RegisterLegalEntityBody): Promise<Record<string, any>> {
    const legalEntityID = v4();

    await this.commandBus.execute(new RegisterLegalEntityCommand(legalEntityID, registerLegalEntityBody.name,
        registerLegalEntityBody.website, registerLegalEntityBody.contactDetails));

    return { legalEntityID };
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update legal entity' })
  @ApiResponse({ status: 200, description: 'Legal entity updated' })
  @ApiResponse({ status: 400, description: 'Legal entity update failed' })
  async updateLegalEntity(@Req() req: Request, @Body() updateLegalEntityBody: UpdateLegalEntityBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateLegalEntityCommand(user.legalEntityId, updateLegalEntityBody.name,
        updateLegalEntityBody.website, updateLegalEntityBody.contactDetails));
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
}
