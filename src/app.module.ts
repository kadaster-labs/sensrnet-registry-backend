import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { QueryModule } from './query/query.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CommandModule } from './command/command.module';
import { HealthController } from './health/health.controller';
import { CheckpointModule } from './query/service/checkpoint/checkpoint.module';

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
        CheckpointModule,
        MongooseModule.forRoot(`mongodb://${host}:${port}/${database}`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        }),
        TerminusModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ]
})

export class AppModule {}
