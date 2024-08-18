import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../../api/apiService';
import { Message } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatView.scss';

interface ChatViewProps {
  chatId: string;
}

const ChatView: React.FC<ChatViewProps> = ({ chatId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
    refetchInterval: 5000,
  });

  if (isLoading) return <div className='loader-layout'><div className='loader'/></div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="message-list">
      <AnimatePresence initial={false}>
        {data?.data.map((message: Message) => (
          <motion.div
            key={message.id}
            className="message-item"
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 10 }}
            transition={{ duration: 0.3 }}
          >
            {message.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChatView;