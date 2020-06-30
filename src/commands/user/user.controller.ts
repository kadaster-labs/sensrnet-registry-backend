import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DeleteUserCommand } from './commands/delete.command';
import { DeleteUserParams } from './models/params/delete-params';
import { NoRightsException } from '../owner/errors/no-rights-exception';
import { DomainExceptionFilter } from './errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Delete, UseGuards, Request, Param } from '@nestjs/common';

@ApiTags('User')
@Controller('User')
export class UserController {
    constructor(private readonly commandBus: CommandBus) {}

    @Delete()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeOwner(@Request() req) {
        return await this.commandBus.execute(new DeleteUserCommand(req.user.userId));
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeOwnerById(@Request() req, @Param() param: DeleteUserParams) {
        if (req.user.role === 'admin') {
            return await this.commandBus.execute(new DeleteUserCommand(param.id));
        } else {
            throw new NoRightsException(req.user);
        }
    }
}
