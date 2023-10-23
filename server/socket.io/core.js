import { Server } from 'socket.io';

class Sockets {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.io = new Server(this.httpServer);
  }

  cnx(callback) {
    this.io.on('connection', callback);
  }

  singleEmit(socket, event) {
    socket.on(event, (data) => {
      this.io.sockets.emit(event, data);
    });
  }

  emit(events) {
    this.cnx((socket) => {
      events.forEach((event) => {
        this.singleEmit(socket, event);
      });
    });
  }
}

export default Sockets;
