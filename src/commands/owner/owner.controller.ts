import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateOwnerBody } from './models/bodies/update-body';
import { UpdateOwnerCommand } from './commands/update.command';
import { DeleteOwnerCommand } from './commands/delete.command';
import { NoRightsException } from './errors/no-rights-exception';
import { DeleteOwnerParams } from './models/params/delete-params';
import { RegisterOwnerBody } from './models/bodies/register-body';
import { RegisterOwnerCommand } from './commands/register.command';
import { RegisterUserCommand } from '../user/commands/register.command';
import { DomainExceptionFilter } from './errors/domain-exception.filter';
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

    await this.commandBus.execute(new RegisterUserCommand(ownerBody.email, ownerId, ownerBody.password))
        .then(() => this.commandBus.execute(new RegisterOwnerCommand(ownerId, NODE_ID, ownerBody.organisationName,
            ownerBody.website, ownerBody.name, ownerBody.contactEmail, ownerBody.contactPhone)));

    return {ownerId};
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove owner' })
  @ApiResponse({ status: 200, description: 'Owner removed' })
  @ApiResponse({ status: 400, description: 'Owner removal failed' })
  async removeOwner(@Request() req) {
    return await this.commandBus.execute(new DeleteOwnerCommand(req.user.ownerId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
