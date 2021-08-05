import { Controller, Get, UseFilters } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../commons/decorators/user.decorator';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RetrieveUserQuery } from '../model/users.query';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
    ) { }

    @Get()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Retrieve users' })
    @ApiResponse({ status: 200, description: 'Users retrieved' })
    @ApiResponse({ status: 400, description: 'Users retrieval failed' })
    async retrieveUsers(@User() user: ValidatedUser): Promise<void> {
        return user.legalEntityId ? await this.queryBus.execute(new RetrieveUserQuery(user.userId, user.legalEntityId)) : null;
    }

}
