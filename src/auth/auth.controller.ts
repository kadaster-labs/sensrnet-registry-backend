import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticateBody } from './models/auth.model';
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';

@ApiTags('Authentication')
@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() body: AuthenticateBody, @Request() req) {
        return this.authService.login(req.user);
    }
}
