import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AuthenticateBody } from './auth/models/auth.model';

@Controller()
export class AppController {

    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() body: AuthenticateBody, @Request() req) {
        return this.authService.login(req.user);
    }
}
