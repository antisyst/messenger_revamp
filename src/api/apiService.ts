import axios, { AxiosResponse } from 'axios';
import { Chat, Message, CreateChatData, CreateMessageData } from '../types';

const api = axios.create({
  baseURL: 'https://revamp-it-messenger-0d84.twc1.net',
});

export const getChats = (): Promise<AxiosResponse<Chat[]>> => api.get('/chats');

export const getChatById = (id: string): Promise<AxiosResponse<Chat>> =>
  api.get(`/chats/${id}`);

export const createChat = (data: CreateChatData): Promise<AxiosResponse<Chat>> =>
  api.post('/chats', data);

export const getMessages = (chatId: string): Promise<AxiosResponse<Message[]>> =>
  api.get(`/chats/${chatId}/messages`);

export const createMessage = (data: CreateMessageData): Promise<AxiosResponse<Message>> =>
  api.post(`/chats/${data.chatId}/messages`, data);