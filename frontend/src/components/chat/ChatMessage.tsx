import React from 'react';
import { Message } from '../../types/chat.types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const isAI = message.sender === 'ai';
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          max-w-[80%] rounded-2xl p-3 flex flex-col
          ${isCurrentUser 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}
        `}
        role="listitem"
      >
        <div className="flex items-start space-x-2 rtl:space-x-reverse">
          <div className="flex-shrink-0 w-4 h-4" aria-hidden="true">
            {isAI ? (
              <Bot className="w-4 h-4 text-orange-500" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
        <div 
          className={`
            text-xs mt-1 self-end
            ${isCurrentUser ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}
          `}
          aria-label={`Sent at ${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};