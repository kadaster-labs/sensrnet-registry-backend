import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Socket, Server } from 'socket.io';
import { RetrieveSensorsQuery } from '../model/sensors.query';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway({
    namespace: 'sensor',
    path: '/api/socket.io',
})
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
