import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { instrument } from '@socket.io/admin-ui';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080'],
  },
});

app.get('/', (_req, res) => {
  res.send('Hello');
});

const userIo = io.of('/user');
userIo.on('connection', (_socket) => {
  console.log('connected to user namespace');
});
userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    (socket as any).username = getUsernameFromToken(
      socket.handshake.auth.token
    );
    next();
  } else {
    next(new Error('Please send token'));
  }
});

const getUsernameFromToken = (token: String) => {
  return token;
};

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('custom-event', (number, string, obj) => {
    console.log(number, string, obj);
  });
  socket.on('send-message', (message, room) => {
    //send message to everyone including me
    //  io.emit('receive-message', message);
    //send message to everyone except me
    //  socket.broadcast.emit('receive-message', message);
    if (room === '') {
      socket.broadcast.emit('receive-message', message);
    } else {
      socket.to(room).emit('receive-message', message);
    }
  });
  socket.on('join-room', (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });
});

//admin.socket.io
instrument(io, { auth: false });

server.listen(5000, () => {
  console.log('Server is lisening on port 5000');
});
