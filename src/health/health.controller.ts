import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
import { Public } from '../auth/public';
@Public()
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private mongoose: MongooseHealthIndicator,
        private http: HttpHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    healthCheck() {
        return this.health.check([
            async () => this.mongoose.pingCheck('mongodb'),
            () => this.http.pingCheck('eventstore', 'http://localhost:2113'),
        ]);
    }
}
