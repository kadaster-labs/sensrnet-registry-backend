import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UpdateOwnerBody } from './model/update-owner.body';
import { DeleteOwnerParams } from './model/delete-owner.params';
import { RegisterOwnerBody } from './model/register-owner.body';
import { UpdateOwnerCommand } from '../model/update-owner.command';
import { DeleteOwnerCommand } from '../model/delete-owner.command';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { RegisterOwnerCommand } from '../model/register-owner.command';
import { RegisterUserCommand } from '../../user/command/register-user.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Post, Body, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';

@ApiTags('Owner')
@Controller('Owner')
export class OwnerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Owner registered' })
  @ApiResponse({ status: 200, description: 'Owner registered' })
  @ApiResponse({ status: 400, description: 'Owner registration failed' })
  async createOwner(@Body() ownerBody: RegisterOwnerBody): Promise<Record<string, any>> {
    const ownerId = v4();

    if (ownerBody.email && ownerBody.password) {
      await this.commandBus.execute(new RegisterUserCommand(ownerBody.email, ownerId, ownerBody.password));
    }

    await this.commandBus.execute(new RegisterOwnerCommand(ownerId, ownerBody.organisationName,
        ownerBody.website, ownerBody.name, ownerBody.contactEmail, ownerBody.contactPhone));

    return {ownerId};
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update owner' })
  @ApiResponse({ status: 200, description: 'Owner updated' })
  @ApiResponse({ status: 400, description: 'Owner update failed' })
  async updateOwner(@Body() ownerBody: UpdateOwnerBody, @Req() req: Request): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateOwnerCommand(user.ownerId, ownerBody.organisationName,
        ownerBody.website, ownerBody.name, ownerBody.contactEmail, ownerBody.contactPhone));
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove owner' })
  @ApiResponse({ status: 200, description: 'Owner removed' })
  @ApiResponse({ status: 400, description: 'Owner removal failed' })
  async removeOwner(@Req() req: Request): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new DeleteOwnerCommand(user.ownerId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin')
  @UseFilters(new DomainExceptionFilter())
  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Remove owner' })
  @ApiResponse({ status: 200, description: 'Owner removed' })
  @ApiResponse({ status: 400, description: 'Owner removal failed' })
  async removeOwnerById(@Req() req: Request, @Param() param: DeleteOwnerParams): Promise<any> {
    return await this.commandBus.execute(new DeleteOwnerCommand(param.id));
  }
}
