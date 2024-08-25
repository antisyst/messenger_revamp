import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendMessage, onMessageReceived, authenticateWebSocket, socket } from '../../api/apiService';
import { Message } from '../../types';
import FileDropZone from '../FileDropZone/FileDropZone';
import './MessageInput.scss';

interface MessageInputProps {
  chatId: string;
  accessToken: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, accessToken }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    authenticateWebSocket(accessToken);

    const handleMessage = (message: Message) => {
      console.log('New message received:', message);
    };

    onMessageReceived(handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [accessToken]);

  const handleFileDrop = (droppedFiles: File[]) => {
    setFiles(droppedFiles);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (text.trim() || files.length > 0) {
      sendMessage(chatId, text, () => {
        setText('');
        setFiles([]);
        playSound();
      });
    }
  };

  const playSound = () => {
    const audio = new Audio('https://audio.jukehost.co.uk/CPArujSWt5CZB1KzoQCu7RSbmZxjpFuM');
    audio.play();
  };

  return (
    <div>
      <FileDropZone onFileDrop={handleFileDrop} />
      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('typeAMessage')}
        />
        <button type="submit" disabled={!text.trim() && files.length === 0}>
          {t('send')}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;