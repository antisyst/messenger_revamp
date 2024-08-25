import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChats } from '../../api/apiService';
import { Chat } from '../../types';
import { Link } from 'react-router-dom';
import './ChatList.scss';

const ChatList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
  });

  if (isLoading) return <div className='loader-layout'><div className='loader'/></div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  const chats = data?.data;

  return (
    <div className="chat-list">
      <h1>Chats</h1>
      <div className='list-container'>
        {chats?.map((chat: Chat) => (
          <div key={chat.id} className='chat-item'>
            <Link to={`/chat/${chat.id}`} onClick={(e) => e.stopPropagation()}>
              {chat.title}
            </Link> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;