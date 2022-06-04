"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const admin_ui_1 = require("@socket.io/admin-ui");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
        socket.username = getUsernameFromToken(socket.handshake.auth.token);
        next();
    }
    else {
        next(new Error('Please send token'));
    }
});
const getUsernameFromToken = (token) => {
    return token;
};
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('custom-event', (number, string, obj) => {
        console.log(number, string, obj);
    });
    socket.on('send-message', (message, room) => {
        if (room === '') {
            socket.broadcast.emit('receive-message', message);
        }
        else {
            socket.to(room).emit('receive-message', message);
        }
    });
    socket.on('join-room', (room, cb) => {
        socket.join(room);
        cb(`Joined ${room}`);
    });
});
(0, admin_ui_1.instrument)(io, { auth: false });
server.listen(5000, () => {
    console.log('Server is lisening on port 5000');
});
//# sourceMappingURL=index.js.map