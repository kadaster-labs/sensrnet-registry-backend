import { Socket, Server } from 'socket.io';

import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket, SubscribeMessage,
    MessageBody } from '@nestjs/websockets';

import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@WebSocketGateway({
    namespace: 'sensor',
    path: '/api/socket.io',
})
export class SensorGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger(this.constructor.name);

    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    setupRoom(client: Socket, organizationId?: string): void {
        client.leaveAll();
        if (organizationId) {
            client.join(organizationId);
        }
    }

    async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.id}.`);

        if (process.env.REQUIRE_AUTHENTICATION) {
            const authHeader: string = client.handshake.headers.authorization;
            const authToken = authHeader && authHeader.length > 7 ? authHeader.substring(7, authHeader.length) : '';

            try {
                const token = this.jwtService.decode(authToken);
                const organizationId: string = await this.userService.getOrganizationId(token.sub);

                this.setupRoom(client, organizationId);
            } catch {
                client.disconnect(true);
                this.logger.log('Failed to authenticate websocket client.');
            }
        }
    }

    emit(event: string, updatedSensor: Record<string, any>): void {
        for (const organization of updatedSensor.organizations) {
            this.server.to(organization.id).emit(event, updatedSensor);
        }
    }

    @SubscribeMessage('OrganizationUpdated')
    handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: Record<string, string>): void {
        this.setupRoom(client, data.organizationId);
    }
}
