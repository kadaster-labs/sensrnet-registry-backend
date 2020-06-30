import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticateBody } from './models/auth-body';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { Controller, Request, Response, Post, UseGuards, Body, UnauthorizedException } from '@nestjs/common';

@ApiTags('Authentication')
@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() body: AuthenticateBody, @Request() req, @Response() res) {
        const {
            access_token,
            refresh_token,
            access_token_expires_in,
            refresh_token_expires_in,
        } = await this.authService.login(req.user);

        const refreshCookie = `Authentication=${refresh_token}; HttpOnly; Path=/api/auth/; Max-Age=${refresh_token_expires_in}; SameSite=Strict;`;
        res.setHeader('Set-Cookie', refreshCookie);

        return res.send({ access_token, access_token_expires_in });
    }

    @UseGuards(new RefreshJwtAuthGuard(RefreshJwtStrategy))
    @Post('auth/logout')
    async logout(@Request() req, @Response() res) {
        const logoutCookie = `Authentication=; HttpOnly; Path=/api/auth/; Max-Age=0; SameSite=Strict;`;
        res.setHeader('Set-Cookie', logoutCookie);

        return res.send();
    }

    @UseGuards(new RefreshJwtAuthGuard(RefreshJwtStrategy))
    @Post('auth/refresh')
    async refresh(@Request() req) {
        if (req.cookies && req.cookies.Authentication) {
            return this.authService.refresh(req.user, req.cookies.Authentication);
        } else {
            throw new UnauthorizedException();
        }
    }
}
