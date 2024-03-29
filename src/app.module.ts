import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CommandModule } from './command/command.module';
import { EventProcessingModule } from './commons/event-processing/event-processing.module';
import { UserModule } from './commons/user/user.module';
import { HealthController } from './health/health.controller';
import { QueryModule } from './query/query.module';

const port = process.env.MONGO_PORT || 27017;
const host = process.env.MONGO_HOST || 'localhost';
const database = process.env.MONGO_DATABASE || 'sensrnet';

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot(),
        UserModule,
        QueryModule,
        CommandModule,
        EventProcessingModule,
        MongooseModule.forRoot(`mongodb://${host}:${port}/${database}`),
        TerminusModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
