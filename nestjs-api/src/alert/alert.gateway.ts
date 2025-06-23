import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Alert } from '../../generated/prisma';


// @WebSocketGateway({ cors: { origin: '*' } })
// export class AlertGateway {
//   @WebSocketServer()
//   server: Server;

//   @SubscribeMessage('joinRoom')
//   handleJoinRoom(client: Socket, { lat, lng, radius }: { lat: number; lng: number; radius: number }) {
//     const room = `${lat.toFixed(2)}-${lng.toFixed(2)}-${radius}`;
//     client.join(room);
//   }

//   broadcastNewAlert(alert: Alert) {
//     const room = `${alert.latitude.toFixed(2)}-${alert.longitude.toFixed(2)}-50`;
//     this.server.to(room).emit('new_alert', alert);
//   }
// }

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlertGateway {
  @WebSocketServer()
  server: Server;

  broadcastNewAlert(alert: Alert) {
    this.server.emit('new_alert', alert);
  }
}
