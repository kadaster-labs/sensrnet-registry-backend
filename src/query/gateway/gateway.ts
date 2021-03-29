import { Socket, Server } from 'socket.io';
import { jwtConstants } from '../../auth/constants';
import { AuthService } from '../../auth/auth.service';
import { AccessJwtStrategy } from '../../auth/strategy/access-jwt.strategy';
import {
    WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket, SubscribeMessage, MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway({
    namespace: 'sensrnet',
    path: '/api/socket.io',
})
export class Gateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

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
    emit(event: string, legalEntityIds: string[], eventMessage: Record<string, any>): void {
        if (legalEntityIds) {
            for (const legalEntityId of legalEntityIds) {
                this.server.to(legalEntityId).emit(event, eventMessage);
            }
        } else {
            this.server.emit(event, eventMessage);
        }
    }

    @SubscribeMessage('LegalEntityUpdated')
    handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: Record<string, string>): void {
        this.setupRoom(client, data.legalEntityId);
    }

    async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
        if (jwtConstants.enabled) {
            const authHeader: string = client.handshake.headers.authorization;
            const authToken = authHeader && authHeader.length > 7 ? authHeader.substring(7, authHeader.length) : '';

            try {
                const decodedToken = await this.authService.verifyToken(authToken);
                const userInfo = await this.accessJwtStrategy.validate(decodedToken);
                this.setupRoom(client, userInfo.legalEntityId);
            } catch {
                client.disconnect(true);
            }
        }
    }
}
