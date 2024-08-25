import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../../types';
import './ChatView.scss';

interface ChatViewProps {
  messages: Message[];
}

const ChatViewComponent: React.FC<ChatViewProps> = ({ messages }) => {

  const renderedMessages = useMemo(() => {
    return messages.map((message) => (
      <motion.div
        key={message.id}
        className="message-item"
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 10 }}
        transition={{ duration: 0.3 }}
      >
        <strong>{message.author?.email ?? 'Unknown Author'}:</strong> {message.text}
      </motion.div>
    ));
  }, [messages]);

  return <div className="message-list"><AnimatePresence>{renderedMessages}</AnimatePresence></div>;
};

export const ChatView = React.memo(ChatViewComponent);
export default ChatView;
