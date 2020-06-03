import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RetrieveSensorsQuery } from '../sensor/queries/sensors.query';

const NAMESPACE = 'sensor';

@WebSocketGateway({namespace: NAMESPACE})
export class SensorGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('SensorGateway');

    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('Sensors', await this.queryBus.execute(new RetrieveSensorsQuery()));
    }

    emit(event: string, ...args: any[]) {
        this.server.emit(event, ...args);
    }
}
