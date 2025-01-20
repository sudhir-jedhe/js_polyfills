import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { getMessages, sendMessage, updateMessageStatus, forwardMessage, starMessage, unstarMessage } from '../services/messageService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Paperclip, Star, Forward } from 'lucide-react';

const Chat = ({ receiverId, receiverModel }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const { messages, socket } = useChat();
  const { user } = useAuth();
  const chatContainerRef = useRef(null);
  const mediaInputRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(receiverId, receiverModel);
        setChatMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [receiverId, receiverModel]);

  useEffect(() => {
    if (messages[receiverId]) {
      setChatMessages((prevMessages) => [...prevMessages, ...messages[receiverId]]);
    }
  }, [messages, receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() || mediaInputRef.current.files.length > 0) {
      const formData = new FormData();
      formData.append('content', inputMessage);
      formData.append('receiverId', receiverId);
      formData.append('receiverModel', receiverModel);

      if (mediaInputRef.current.files.length > 0) {
        const file = mediaInputRef.current.files[0];
        formData.append('media', file);
        formData.append('messageType', file.type.startsWith('image/') ? 'image' : 'document');
      } else {
        formData.append('messageType', 'text');
      }

      try {
        const newMessage = await sendMessage(formData);
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');
        mediaInputRef.current.value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleRecordVoice = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleStarMessage = async (messageId, isStarred) => {
    try {
      if (isStarred) {
        await unstarMessage(messageId);
      } else {
        await starMessage(messageId);
      }
      setChatMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isStarred: !isStarred } : msg
        )
      );
    } catch (error) {
      console.error('Error starring/unstarring message:', error);
    }
  };

  const handleForwardMessage = async (messageId) => {
    // Implement message forwarding UI here
    // You can use a modal or a dropdown to select the recipient
    // Then call the forwardMessage function
  };

  const renderMessage = (message) => {
    switch (message.messageType) {
      case 'text':
        return <p dangerouslySetInnerHTML={{ __html: message.formattedContent || message.content }} />;
      case 'image':
        return <img src={message.mediaUrl || "/placeholder.svg"} alt="Shared image" className="max-w-xs rounded-lg" />;
      case 'audio':
        return <audio src={message.mediaUrl} controls className="max-w-xs" />;
      case 'video':
        return <video src={message.mediaUrl} controls className="max-w-xs rounded-lg" />;
      case 'document':
        return <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{message.content}</a>;
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === user.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {renderMessage(message)}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
              <div className="flex justify-end space-x-2 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStarMessage(message._id, message.isStarred)}
                >
                  <Star className={`h-4 w-4 ${message.isStarred ? 'text-yellow-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleForwardMessage(message._id)}
                >
                  <Forward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-100 flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => mediaInputRef.current.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="file"
          ref={mediaInputRef}
          className="hidden"
          accept="image/*,audio/*,video/*,application/*"
        />
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 mx-2"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleRecordVoice}
        >
          <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : ''}`} />
        </Button>
        <Button type="submit" variant="primary" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;

