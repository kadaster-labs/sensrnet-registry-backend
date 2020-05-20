import { v4 as uuidv4 } from 'uuid';
import { OwnerIdDto } from '../dtos/owner.dto';
import { OwnerService } from '../services/owner.service';
import { UpdateOwnerDto } from '../dtos/update-owner.dto';
import { RegisterOwnerDto } from '../dtos/register-owner.dto';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Post, Param, Body, Delete, Put, Logger } from '@nestjs/common';


@Controller('owner')
@ApiUseTags('Owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @ApiOperation({ title: 'Register Owner' })
  @ApiResponse({ status: 200, description: 'Register Owner.' })
  @Post()
  async createOwner(@Body() ownerDto: RegisterOwnerDto): Promise<RegisterOwnerDto> {
    const id = uuidv4();
    return this.ownerService.registerOwner({...{id}, ...ownerDto});;
  }

  @ApiOperation({ title: 'Update Owner' })
  @ApiResponse({ status: 200, description: 'Update Owner.' })
  @Put(':id')
  async updateOwner(@Param() id: OwnerIdDto, @Body() ownerDto: UpdateOwnerDto) {
    return this.ownerService.updateOwner({...id, ...ownerDto});
  }

  @ApiOperation({ title: 'Remove Owner' })
  @ApiResponse({ status: 200, description: 'Remove Owner.' })
  @Delete(':id')
  async removeOwner(@Param() id: OwnerIdDto) {
    return this.ownerService.removeOwner(id);
  }
}
