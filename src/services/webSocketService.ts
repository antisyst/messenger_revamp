import { io, Socket } from 'socket.io-client';

interface Message {
  chatId: string;
  text: string;
  author: {
    email: string;
  };
  timestamp: string;
}

let socket: Socket | null = null;

export const connectToSocket = (accessToken: string): void => {
  socket = io('ws://188.225.72.100', {
    auth: {
      token: accessToken,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });
};

export const sendMessage = (chatId: string, text: string): void => {
  if (socket) {
    socket.emit('message', { chatId, text });
  }
};

export const onMessageReceived = (callback: (message: Message) => void): void => {
  if (socket) {
    socket.on('message', (message: Message) => {
      callback(message);
    });
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
};
