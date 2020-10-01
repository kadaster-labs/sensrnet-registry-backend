import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { jwtConstants } from '../../auth/constants';
import { AuthService } from '../../auth/auth.service';
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
        private authService: AuthService,
    ) {}

    async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);

        if (jwtConstants.enabled) {
            const authHeader: string = client.handshake.headers.authorization;
            const authToken = authHeader && authHeader.length > 7 ? authHeader.substring(7, authHeader.length) : '';

            try {
                await this.authService.verifyToken(authToken);
            } catch {
                client.disconnect(true);
                this.logger.log('Failed to authenticate websocket client.');
            }
        }
    }

    emit(event: string, ...args: any[]): void {
        this.server.emit(event, ...args);
    }
}
