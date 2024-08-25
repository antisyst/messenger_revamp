import axios, { AxiosResponse } from 'axios';
import { Chat, Message, CreateChatData, TokenResponse } from '../types';
import io from 'socket.io-client';

const api = axios.create({
  baseURL: 'http://188.225.72.100/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const socket = io('ws://188.225.72.100', {
  transports: ['websocket', 'polling'],
});

export const authenticateWebSocket = (accessToken: string) => {
  socket.emit('authenticate', { token: accessToken });
};

export const onMessageReceived = (callback: (message: Message) => void) => {
  socket.on('message', callback);
};

export const sendMessage = (chatId: string, text: string, callback?: () => void) => {
  console.log(`Sending message: ${text} to chat: ${chatId}`);
  socket.emit('sendMessage', { chatId, text }, () => {
    console.log('Message sent and acknowledged by the server');
    if (callback) callback();
  });
};

export const createJwtToken = (email: string): Promise<AxiosResponse<TokenResponse>> => 
  api.post('/tokens', { email });

export const validateOtp = (email: string, otp: string): Promise<AxiosResponse<TokenResponse>> =>
  api.post('/tokens', { email, otp });

export const getChats = (): Promise<AxiosResponse<Chat[]>> => api.get('/chats');

export const getChatById = (id: string): Promise<AxiosResponse<Chat>> => 
  api.get(`/chats/${id}`);

export const createChat = (data: CreateChatData, accessToken: string): Promise<AxiosResponse<Chat>> => 
  api.post('/chats', data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getMessages = (chatId: string): Promise<AxiosResponse<Message[]>> => 
  api.get(`/chats/${chatId}/messages`);
