// auth/auth.controller.ts
import { ApiTags } from '@nestjs/swagger';
import { Response, Request as Rexpress } from 'express';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Logger, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthenticateBody } from './models/auth-body';
import { LoginGuard } from './login.guard';
import { Issuer } from 'openid-client';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Get('/user')
    user(@Request() req) {
        return req.user
    }

    @UseGuards(LoginGuard)
    @Get('/auth/oidc')
    login() {}

    // @UseGuards(LocalAuthGuard)
    // @Post('login')
    // async login(@Body() body: AuthenticateBody, @Req() req: Request, @Res() res: Response): Promise<Response> {
    //     const {
    //         accessToken,
    //         refreshToken,
    //     } = await this.authService.login(req.user);

    //     res.cookie('Authentication', refreshToken, {
    //         httpOnly: true,
    //         maxAge: this.authService.refreshTokenExpiresIn,
    //         path: '/api/auth/refresh',
    //         sameSite: 'strict',
    //     });

    //     return res.send({ accessToken });
    // }

    // @UseGuards(LoginGuard)
    // @Get('oidc')
    // async loginAzure(@Req() req: Request, @Res() res: Response): Promise<Response> {
    //     const {
    //         accessToken,
    //         refreshToken,
    //     } = await this.authService.loginOidc();

    //     res.cookie('Authentication', refreshToken, {
    //         httpOnly: true,
    //         maxAge: this.authService.refreshTokenExpiresIn,
    //         path: '/api/auth/refresh',
    //         sameSite: 'strict',
    //     });

    //     return res.send({ accessToken });
    // }

    // @Get('/user')
    // user(@Request() req) {
    //     return req.user
    // }

    @UseGuards(LoginGuard)
    @Get('/auth/callback')
    async loginCallback(@Res() res: Response) {
        Logger.verbose(`User authenticated: ${res}`);
        await this.authService.createOrLogin(res.req.user);

        res.redirect('/viewer');
    }

    @Get('/auth/logout')
    async logout(@Request() req, @Res() res: Response) {
        const id_token = req.user ? req.user.id_token : undefined;
        req.logout();
        req.session.destroy(async (error: any) => {
            const TrustIssuer = await Issuer.discover(`${process.env.OAUTH2_CLIENT_PROVIDER_GOOGLE_ISSUER}/.well-known/openid-configuration`);
            const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint;
            if (end_session_endpoint) {
                res.redirect(end_session_endpoint +
                    '?post_logout_redirect_uri=' + process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI +
                    (id_token ? '&id_token_hint=' + id_token : ''));
            } else {
                res.redirect('/')
            }
        })
    }

    // @UseGuards(new RefreshJwtAuthGuard(RefreshJwtStrategy))
    // @Post('refresh')
    // async refresh(@Req() req: Request): Promise<Record<string, string>> {
    //     if (req.cookies && req.cookies.Authentication) {
    //         return await this.authService.refresh(req.user, req.cookies.Authentication);
    //     } else {
    //         throw new UnauthorizedException();
    //     }
    // }
}
