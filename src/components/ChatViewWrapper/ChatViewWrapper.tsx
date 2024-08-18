import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ChatView from '../ChatView/ChatView';
import MessageInput from '../MessageInput/MessageInput';
import { getChats } from '../../api/apiService';
import { Chat } from '../../types';
import './ChatViewWrapper.scss';

const ChatViewWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chatAvailable, setChatAvailable] = useState<boolean | null>(null);

  const { data: chats, isLoading, error } = useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
  });

  useEffect(() => {
    if (chats && id) {
      const chatExists = chats.data.some((chat: Chat) => chat.id.toString() === id);
      setChatAvailable(chatExists);
    }
  }, [chats, id]);

  if (isLoading) return <div className='loader-layout'><div className='loader'/></div>;
  if (error) return <div>Error loading chats</div>;

  if (chatAvailable === false) {
    return <div className="chat-not-available">Chat is not found</div>;
  }

  if (chatAvailable === null) {
    return <div>Checking chat availability...</div>;
  }

  return (
    <div className="chat-view">
      <ChatView chatId={id!} />
      <MessageInput chatId={id!} />
    </div>
  );
};

export default ChatViewWrapper;