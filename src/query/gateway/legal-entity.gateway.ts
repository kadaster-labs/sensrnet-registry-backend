import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection,
    ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway({
    namespace: 'organization',
    path: '/api/socket.io',
})
export class LegalEntityGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger(this.constructor.name);

    handleConnection(@ConnectedSocket() client: Socket): void {
        this.logger.log(`Client connected: ${client.id}`);
    }

    emit(event: string, ...args: any[]): void {
        this.server.emit(event, ...args);
    }

    @SubscribeMessage('create')
    handleEvent(@MessageBody() data: string): string {
        return data;
    }
}
