import { Module, HttpModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
    imports: [HttpModule, TerminusModule],
    controllers: [HealthController],
})
export class HealthModule {}
