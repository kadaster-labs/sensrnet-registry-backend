import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class OwnerGateway {

    @WebSocketServer() server;

    async notifyClients(message) {
        this.server.emit('created', message);
    }
}
