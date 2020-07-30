import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateOwnerBody } from './model/update-owner.body';
import { UpdateOwnerCommand } from '../model/update-owner.command';
import { DeleteOwnerCommand } from '../model/delete-owner.command';
import { NoRightsException } from '../handler/error/no-rights-exception';
import { DeleteOwnerParams } from './model/delete-owner.params';
import { RegisterOwnerBody } from './model/register-owner.body';
import { RegisterOwnerCommand } from '../model/register-owner.command';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { RegisterUserCommand } from '../model/register-user.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Post, Body, Put, Delete, UseGuards, Request, Param } from '@nestjs/common';

const NODE_ID = process.env.NODE_ID || '1';

@ApiTags('Owner')
@Controller('Owner')
export class OwnerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Owner registered' })
  @ApiResponse({ status: 200, description: 'Owner registered' })
  @ApiResponse({ status: 400, description: 'Owner registration failed' })
  async createOwner(@Body() ownerBody: RegisterOwnerBody) {
    const ownerId = uuidv4();

    await this.commandBus.execute(new RegisterUserCommand(ownerBody.email, ownerId, ownerBody.password));
    await this.commandBus.execute(new RegisterOwnerCommand(ownerId, NODE_ID, ownerBody.organisationName,
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
  async updateOwner(@Body() ownerBody: UpdateOwnerBody, @Request() req) {
    return await this.commandBus.execute(new UpdateOwnerCommand(req.user.ownerId, ownerBody.organisationName,
        ownerBody.website, ownerBody.name, ownerBody.contactEmail, ownerBody.contactPhone));
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove owner' })
  @ApiResponse({ status: 200, description: 'Owner removed' })
  @ApiResponse({ status: 400, description: 'Owner removal failed' })
  async removeOwner(@Request() req) {
    return await this.commandBus.execute(new DeleteOwnerCommand(req.user.ownerId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove owner' })
  @ApiResponse({ status: 200, description: 'Owner removed' })
  @ApiResponse({ status: 400, description: 'Owner removal failed' })
  async removeOwnerById(@Request() req, @Param() param: DeleteOwnerParams) {
    if (req.user.role === 'admin') {
      return await this.commandBus.execute(new DeleteOwnerCommand(param.id));
    } else {
      throw new NoRightsException(req.user);
    }
  }
}
