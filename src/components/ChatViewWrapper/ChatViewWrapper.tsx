import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import ChatView from '../ChatView/ChatView';
import MessageInput from '../MessageInput/MessageInput';
import { getMessages, onMessageReceived, authenticateWebSocket, socket } from '../../api/apiService';
import { Message } from '../../types';
import './ChatViewWrapper.scss';

interface ChatViewWrapperProps {
  accessToken: string;
}

const ChatViewWrapper: React.FC<ChatViewWrapperProps> = ({ accessToken }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: messagesData, isLoading, error } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => getMessages(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (accessToken) {
      authenticateWebSocket(accessToken);
    }
  
    const handleMessage = (message: Message) => {
      console.log('New message received:', message); 
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
    onMessageReceived(handleMessage);
  
    return () => {
      socket.off('message', handleMessage);
    };
  }, [accessToken, id]);
  

  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true });
    } else if (messagesData) {
      setMessages(messagesData.data);
    }
  }, [id, messagesData, navigate]);

  if (isLoading) return <div>{t('loadingMessages')}</div>;
  if (error) {
    console.error('Error loading messages:', error);
    return <div>{t('errorLoadingMessages')}</div>;
  }

  if (!messagesData || messages.length === 0) {
    return <div>{t('noMessagesFound')}</div>;
  }

  return (
    <div className="chat-view">
      <ChatView messages={messages} />
      <MessageInput chatId={id!} accessToken={accessToken} />
    </div>
  );
};

export default ChatViewWrapper;