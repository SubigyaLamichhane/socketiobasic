import io from 'socket.io-client';

const joinRoomButton = document.getElementById('room-button');
const messageInput = document.getElementById('message-input');
const roomInput = document.getElementById('room-input');
const form = document.getElementById('form');

const socket = io('http://localhost:5000');
const userSocket = io('http://localhost:3000/user', {
  auth: { token: 'Test' },
});
socket.on('connect', () => {
  displayMessage(`you connected with id: ${socket.id}`);
});

socket.emit('custom-event', 10, 'hi', { a: 'a' });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === '') return;
  displayMessage(message);
  socket.emit('send-message', message, room);

  messageInput.value = '';
});

joinRoomButton.addEventListener('click', () => {
  const room = roomInput.value;
  socket.emit('join-room', room, (message) => {
    displayMessage(message);
  });
});

//messageButton.addEventListener('click', () => {});

function displayMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  document.getElementById('message-container').append(div);
}
