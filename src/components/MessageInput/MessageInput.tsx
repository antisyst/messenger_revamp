import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessage } from '../../api/apiService';
import { CreateMessageData, Message } from '../../types';
import { AxiosResponse } from 'axios';
import './MessageInput.scss';

interface MessageInputProps {
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation<AxiosResponse<Message>, Error, CreateMessageData>({
    mutationFn: (data: CreateMessageData) => createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setText(''); 
      playSound(); 
    },
  });

  const playSound = () => {
    const audio = new Audio('https://audio.jukehost.co.uk/CPArujSWt5CZB1KzoQCu7RSbmZxjpFuM');
    audio.play();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (text.trim()) {
      mutation.mutate({ text, chatId });
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit" disabled={mutation.status === 'pending'}>
        {mutation.status === 'pending' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;