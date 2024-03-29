import { Injectable } from '@nestjs/common';
import { TCPConfig } from 'geteventstore-promise';

@Injectable()
export class EventStoreConfiguration {
    get config(): TCPConfig {
        return {
            hostname: process.env.EVENT_STORE_HOST || 'localhost',
            port: parseInt(process.env.EVENT_STORE_PORT, 10) || 1113,
            credentials: {
                username: process.env.EVENT_STORE_CREDENTIALS_USERNAME || 'admin',
                password: process.env.EVENT_STORE_CREDENTIALS_PASSWORD || 'changeit',
            },
        };
    }
}
