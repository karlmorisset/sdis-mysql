import { Server } from 'socket.io';

const MatchSockets = (httpServer) => (req, res, next) => {
  const io = new Server(httpServer);

  console.log('in MatchSockets middleware');

  io.on('connection', (socket) => {
    socket.on('newComment', (data) => {
      io.sockets.emit('newComment', { ...data, user: res.locals.user.id });
    });

    socket.on('removeComment', (data) => {
      io.sockets.emit('removeComment', data);
    });
  });

  next();
};

export default MatchSockets;
