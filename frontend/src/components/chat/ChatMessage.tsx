import React from 'react';
import { Message } from '../../types/chat.types';
import { Bot, User } from 'lucide-react';

// Define the different possible message types
type RawMessageObject = { id: string; content: string; role: string; timestamp: string };

interface ChatMessageProps {
  message: Message | RawMessageObject | string;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  // Handle both the original Message type and the new format from useAIChatSSE
  // Also handle the case where content might be an object (which causes the "Objects are not valid as a React child" error)

  let content = '';
  let sender: 'user' | 'ai' = 'user';
  let timestamp = new Date().toISOString();

  if (typeof message === 'string') {
    // If message is just a string
    content = message;
    sender = isCurrentUser ? 'user' : 'ai';
    timestamp = new Date().toISOString();
  } else if ('text' in message) {
    // If it's our standard Message type
    content = typeof message.text === 'string' ? message.text : JSON.stringify(message.text);
    sender = message.sender;
    timestamp = message.timestamp;
  } else if ('content' in message) {
    // If it's the raw object with content property
    content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
    sender = (message.role === 'assistant' || message.role === 'ai') ? 'ai' : 'user';
    timestamp = message.timestamp || new Date().toISOString();
  } else {
    // Fallback to stringify if it's an unexpected object
    content = JSON.stringify(message);
    sender = isCurrentUser ? 'user' : 'ai';
    timestamp = new Date().toISOString();
  }

  const isAI = sender === 'ai';

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
            <p className="text-sm">{content}</p>
          </div>
        </div>
        <div
          className={`
            text-xs mt-1 self-end
            ${isCurrentUser ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}
          `}
          aria-label={`Sent at ${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        >
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};