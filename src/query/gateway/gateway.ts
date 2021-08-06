import { JwtService } from '@nestjs/jwt';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserQueryService } from '../../commons/user/user.qry-service';

@WebSocketGateway({
    namespace: 'sensrnet',
    path: '/api/socket.io',
})
export class Gateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly jwtService: JwtService, private readonly userQryService: UserQueryService) {}

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
        if (process.env.REQUIRE_AUTHENTICATION) {
            const authHeader: string = client.handshake.headers.authorization;
            const authToken = authHeader && authHeader.length > 7 ? authHeader.substring(7, authHeader.length) : '';

            try {
                const token = this.jwtService.decode(authToken);
                const { legalEntityId } = await this.userQryService.retrieveUserPermissions(token.sub);

                this.setupRoom(client, legalEntityId);
            } catch {
                client.disconnect(true);
            }
        }
    }
}
