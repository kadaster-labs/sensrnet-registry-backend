import { Body, Controller, Delete, Param, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../commons/decorators/user.decorator';
import { DomainException } from '../../commons/errors/domain-exception';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { Roles } from '../../commons/guards/roles.decorator';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { UserRole } from '../../commons/user/user.schema';
import { DeleteUserCommand } from '../model/user/delete-user.command';
import { JoinLegalEntityCommand } from '../model/user/join-legal-entity.command';
import { LeaveLegalEntityCommand } from '../model/user/leave-legal-entity.command';
import { UpdateUserRoleCommand } from '../model/user/update-user-role.command';
import { DeleteUserParams } from './model/user/delete-user.params';
import { UpdateUserRoleBody } from './model/user/update-user-role.body';
import { UpdateUserBody } from './model/user/update-user.body';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
    ) { }

    @Put()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUser(@User() user: ValidatedUser, @Body() userBody: UpdateUserBody): Promise<any> {
        if (userBody.legalEntityId) {
            return this.commandBus.execute(new JoinLegalEntityCommand(user.userId, userBody.legalEntityId));
        }
        else if (userBody.leaveLegalEntity) {
            return this.commandBus.execute(new LeaveLegalEntityCommand(user.userId, user.legalEntityId));
        }
        else {
            throw new DomainException('Unsupported combination of parameters');
        }
    }

    @Put(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUserById(@User() user: ValidatedUser, @Param() param: DeleteUserParams, @Body() userBody: UpdateUserRoleBody): Promise<any> {
        return this.commandBus.execute(new UpdateUserRoleCommand(param.id, user.legalEntityId, userBody.role));
    }

    @Delete()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUser(@User() user: ValidatedUser): Promise<any> {
        return this.commandBus.execute(new DeleteUserCommand(user.userId));
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles(UserRole.SUPER_USER)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUserById(@Param() param: DeleteUserParams): Promise<any> {
        return this.commandBus.execute(new DeleteUserCommand(param.id));
    }

}
