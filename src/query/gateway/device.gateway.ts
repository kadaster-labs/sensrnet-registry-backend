import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { jwtConstants } from '../../auth/constants';
import { AuthService } from '../../auth/auth.service';
import { AccessJwtStrategy } from '../../auth/strategy/access-jwt.strategy';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway({
    namespace: 'device',
    path: '/api/socket.io',
})
export class DeviceGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger(this.constructor.name);

    constructor(
        private authService: AuthService,
        private accessJwtStrategy: AccessJwtStrategy,
    ) {}

    setupRoom(client: Socket, legalEntityId?: string): void {
        client.leaveAll();
        if (legalEntityId) {
            client.join(legalEntityId);
        }
    }

    async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.id}.`);

        if (jwtConstants.enabled) {
            const authHeader: string = client.handshake.headers.authorization;
            const authToken = authHeader && authHeader.length > 7 ? authHeader.substring(7, authHeader.length) : '';

            try {
                const decodedToken = await this.authService.verifyToken(authToken);
                const userInfo = await this.accessJwtStrategy.validate(decodedToken);

                this.setupRoom(client, userInfo.legalEntityId);
            } catch {
                client.disconnect(true);
                this.logger.log('Failed to authenticate websocket client.');
            }
        }
    }

    emit(event: string, legalEntityIds: string[], updatedDevice: Record<string, any>): void {
        for (const legalEntityId of legalEntityIds) {
            this.server.to(legalEntityId).emit(event, updatedDevice);
        }
    }

    // @SubscribeMessage('LegalEntityUpdated')
    // handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: Record<string, string>): void {
    //     this.setupRoom(client, data.legalEntityId);
    // }
}
