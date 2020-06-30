import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthenticateBody } from './models/auth.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import {Controller, Request, Post, UseGuards, Body, UnauthorizedException} from '@nestjs/common';

@ApiTags('Authentication')
@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() body: AuthenticateBody, @Request() req) {
        return this.authService.login(req.user);
    }

    @ApiBearerAuth()
    @UseGuards(new RefreshJwtAuthGuard(RefreshJwtStrategy))
    @Post('auth/refresh')
    async refresh(@Request() req) {
        let refreshToken;
        for (const header of req.rawHeaders) {
            if (header.startsWith('Bearer ')) {
                refreshToken = header.replace('Bearer ', '');
                break;
            }
        }

        if (refreshToken) {
            return this.authService.refresh(req.user, refreshToken);
        } else {
            throw new UnauthorizedException();
        }
    }
}
