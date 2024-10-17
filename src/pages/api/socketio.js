import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket이 이미 실행 중입니다');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('새 클라이언트가 연결되었습니다:', socket.id);

    socket.on('chatUpdate', (newMsg) => {
      socket.broadcast.emit('chatUpdate', newMsg);
    });

    socket.on('codeUpdate', (newCode) => {
      socket.broadcast.emit('codeUpdate', newCode);
    });

    socket.on('disconnect', () => {
      console.log('클라이언트 연결이 해제되었습니다:', socket.id);
    });
  });

  console.log('Socket 서버가 시작되었습니다');
  res.end();
};

export default SocketHandler;