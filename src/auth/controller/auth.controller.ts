import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthenticateBody } from '../model/auth-body';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { RefreshJwtStrategy } from '../strategy/refresh-jwt.strategy';
import { RefreshJwtAuthGuard } from '../guard/refresh-jwt-auth.guard';
import { Controller, Req, Res, Post, UseGuards, Body, UnauthorizedException } from '@nestjs/common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() body: AuthenticateBody, @Req() req: Request, @Res() res: Response): Promise<Response> {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.cookie('Authentication', refreshToken, {
          httpOnly: true,
          maxAge: this.authService.refreshTokenExpiresIn,
          path: '/api/auth/refresh',
          sameSite: 'strict',
        });

        return res.send({ accessToken });
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
        res.cookie('Authentication', '', {
          httpOnly: true,
          maxAge: 0,
          path: '/api/auth/refresh',
          sameSite: 'strict',
        });

        return res.send();
    }

    @UseGuards(new RefreshJwtAuthGuard(RefreshJwtStrategy))
    @Post('refresh')
    async refresh(@Req() req: Request): Promise<Record<string, string>> {
        if (req.cookies && req.cookies.Authentication) {
            return await this.authService.refresh(req.user, req.cookies.Authentication);
        } else {
            throw new UnauthorizedException();
        }
    }
}
