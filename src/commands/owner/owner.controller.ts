import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from "@nestjs/cqrs";
import { OwnerIdParams } from "./models/params/id-params";
import { CreateOwnerBody } from "./models/bodies/create-body";
import { UpdateOwnerBody } from "./models/bodies/update-body";
import { CreateOwnerCommand } from "./commands/create.command";
import { UpdateOwnerCommand } from "./commands/update.command";
import { DeleteOwnerCommand } from "./commands/delete.command";
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DomainExceptionFilter } from "./errors/domain-exception.filter"
import { UseFilters, Controller, Post, Param, Body, Put, Delete } from "@nestjs/common";

const NODE_ID = process.env.NODE_ID || '1';


@ApiTags('Owner')
@Controller("Owner")
export class OwnerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Owner registered' })
  @ApiResponse({ status: 200, description: 'Owner registered' })
  @ApiResponse({ status: 400, description: 'Owner registration failed' })
  async createOwner(@Body() ownerBody: CreateOwnerBody) {
    const id = uuidv4();
    await this.commandBus.execute(new CreateOwnerCommand(id, NODE_ID, ownerBody.ssoId, ownerBody.email, 
      ownerBody.publicName, ownerBody.name, ownerBody.companyName, ownerBody.website));
    return id;
  }

  @Put(':id')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update owner' })
  @ApiResponse({ status: 200, description: 'Owner updated' })
  @ApiResponse({ status: 400, description: 'Owner update failed' })
  async updateOwner(@Param() params: OwnerIdParams, @Body() ownerBody: UpdateOwnerBody) {
    return await this.commandBus.execute(new UpdateOwnerCommand(params.id, ownerBody.ssoId, ownerBody.email, 
      ownerBody.publicName, ownerBody.name, ownerBody.companyName, ownerBody.website));
  }

  @Delete(':id')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove owner' })
  @ApiResponse({ status: 200, description: 'Owner removed' })
  @ApiResponse({ status: 400, description: 'Owner removal failed' })
  async removeOwner(@Param() params: OwnerIdParams) {
    return await this.commandBus.execute(new DeleteOwnerCommand(params.id));
  }
}
