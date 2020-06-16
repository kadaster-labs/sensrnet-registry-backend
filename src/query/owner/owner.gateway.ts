import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    namespace: 'owner',
    path: '/api/socket.io',
})
export class OwnerGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('OwnerGateway');

    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): void {
        this.logger.log(`Client connected: ${client.id}`);
    }

    emit(event: string, ...args: any[]) {
        this.server.emit(event, ...args);
    }

    @SubscribeMessage('create')
    handleEvent(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): string {
        // create the command
        return data;
    }
}
