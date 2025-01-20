import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
        auth: { token },
      });

      newSocket.on('connected', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('new_message', (message) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [message.sender]: [...(prevMessages[message.sender] || []), message],
        }));
      });

      newSocket.on('message_status_update', ({ messageId, status }) => {
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          Object.keys(updatedMessages).forEach((senderId) => {
            updatedMessages[senderId] = updatedMessages[senderId].map((msg) =>
              msg._id === messageId ? { ...msg, status } : msg
            );
          });
          return updatedMessages;
        });
      });

      newSocket.on('user_online', (userId) => {
        setOnlineUsers((prevUsers) => [...prevUsers, userId]);
      });

      newSocket.on('user_offline', (userId) => {
        setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, token]);

  const sendMessage = (receiverId, content, messageType = 'text', media = null) => {
    if (socket) {
      const formData = new FormData();
      formData.append('receiverId', receiverId);
      formData.append('content', content);
      formData.append('messageType', messageType);
      if (media) {
        formData.append('media', media);
      }
      socket.emit('send_message', formData);
    }
  };

  const value = {
    socket,
    messages,
    onlineUsers,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};

