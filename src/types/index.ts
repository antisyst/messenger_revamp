export interface Chat {
    id: number;
    title: string; 
  }
  
  export interface Message {
    id: string;
    text: string;
    chatId: string;
  }
  
  export interface CreateChatData {
    title: string;
  }
  
  export interface CreateMessageData {
    text: string;
    chatId: string;
  }