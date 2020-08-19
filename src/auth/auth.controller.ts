import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticateBody } from './models/auth-body';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { Controller, Req, Res, Post, UseGuards, Body, UnauthorizedException } from '@nestjs/common';

@ApiTags('Authentication')
@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() body: AuthenticateBody, @Req() req, @Res() res: Response) {
        const {
            access_token,
            refresh_token,
            access_token_expires_in,
            refresh_token_expires_in,
        } = await this.authService.login(req.user);

        res.cookie('Authentication', refresh_token, {
          httpOnly: true,
          maxAge: refresh_token_expires_in,
          path: '/api/auth/refresh',
          sameSite: 'strict',
        });

        return res.send({ access_token, expires_in: access_token_expires_in });
    }

    @Post('auth/logout')
    async logout(@Req() req, @Res() res: Response) {
        res.cookie('Authentication', '', {
          httpOnly: true,
          maxAge: 0,
          path: '/api/auth/refresh',
          sameSite: 'strict',
        });

        return res.send();
    }

    @UseGuards(new RefreshJwtAuthGuard(RefreshJwtStrategy))
    @Post('auth/refresh')
    async refresh(@Req() req) {
        if (req.cookies && req.cookies.Authentication) {
            const {
                access_token,
                access_token_expires_in,
            } = await this.authService.refresh(req.user, req.cookies.Authentication);

            return { access_token, expires_in: access_token_expires_in };
        } else {
            throw new UnauthorizedException();
        }
    }
}
