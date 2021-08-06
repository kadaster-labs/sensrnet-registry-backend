import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import { Public } from '../auth/public';

@Public()
@Controller('health')
export class HealthController {
    constructor(private health: HealthCheckService) {}

    @Get()
    @HealthCheck()
    check(): Promise<HealthCheckResult> {
        return this.health.check([]);
    }
}
