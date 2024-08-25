export interface Chat {
  id: number;
  title: string; 
}

export interface Author {
  id: number;
  email: string;
}

export interface Message {
  id: string;
  text: string;
  chatId: string;
  author: Author;
  timestamp: string;
}

export interface SendMessageData {
  text: string;
  chatId: string;
  accessToken: string;
}

export interface CreateChatData {
  title: string;
}

export interface CreateMessageData {
  text: string;
  chatId: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}
