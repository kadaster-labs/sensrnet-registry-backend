import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from "@nestjs/cqrs";
import { CreateBody } from "./models/bodies/create-body";
import { UpdateBody } from "./models/bodies/update-body";
import { CreateCommand } from "./commands/create.command";
import { UpdateCommand } from "./commands/update.command";
import { DeleteCommand } from "./commands/delete.command";
import { UpdateParams } from "./models/params/update-params";
import { DeleteParams } from "./models/params/delete-params";
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Post, Param, Body, Put, Delete } from "@nestjs/common";


@ApiTags('Owner')
@Controller("Owner")
export class OwnerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Register Owner' })
  @ApiResponse({ status: 200, description: 'Register Owner.' })
  async createOwner(@Body() ownerBody: CreateBody) {
    const id = uuidv4();
    const nodeId = '1';
    await this.commandBus.execute(new CreateCommand(id, nodeId, ownerBody.ssoId, ownerBody.email, ownerBody.publicName, 
      ownerBody.name, ownerBody.companyName, ownerBody.website));
  }

  @ApiOperation({ summary: 'Update Owner' })
  @ApiResponse({ status: 200, description: 'Update Owner.' })
  @Put(':id')
  async updateOwner(@Param() params: UpdateParams, @Body() ownerBody: UpdateBody) {
    return await this.commandBus.execute(new UpdateCommand(params.id, ownerBody.ssoId, ownerBody.email, ownerBody.publicName, 
      ownerBody.name, ownerBody.companyName, ownerBody.website));
  }

  @ApiOperation({ summary: 'Remove Owner' })
  @ApiResponse({ status: 200, description: 'Remove Owner.' })
  @Delete(':id')
  async removeOwner(@Param() params: DeleteParams) {
    return await this.commandBus.execute(new DeleteCommand(params.id));
  }
}
