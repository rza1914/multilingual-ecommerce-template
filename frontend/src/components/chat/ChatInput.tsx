import React, { useState, KeyboardEvent } from 'react';
import { Send, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (text: string) => void;
  darkMode: boolean;
  onToggleAIActions: () => void;
  isAuthenticated?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, darkMode, onToggleAIActions, isAuthenticated = true }) => {
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={onToggleAIActions}
        disabled={!isAuthenticated}
        className={`
          p-2 rounded-full
          ${isAuthenticated
            ? (darkMode
              ? 'text-gray-300 hover:bg-gray-700 focus:ring-orange-500'
              : 'text-gray-600 hover:bg-gray-100 focus:ring-orange-500')
            : (darkMode
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-400 cursor-not-allowed')}
          transition-colors focus:outline-none focus:ring-2
        `}
        aria-label="AI Actions"
        tabIndex={isAuthenticated ? 0 : -1}
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
      </button>
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAuthenticated ? t('chat.chat_placeholder', 'Type a message...') : t('chat.chat_placeholder', 'Type a message...') + " (guest mode)"}
          className={`
            w-full py-2 px-4 rounded-full
            ${isAuthenticated
              ? (darkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-100 text-gray-900 border-gray-200')
              : (darkMode
                ? 'bg-gray-700 text-white border-gray-600'  // Allow guest users to type
                : 'bg-gray-100 text-gray-900 border-gray-200')} // Allow guest users to type
            border focus:outline-none focus:ring-2 focus:ring-orange-500
          `}
          aria-label="Type your message"
          role="textbox"
          tabIndex={0}
          disabled={false}  // Allow guest users to type
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!inputValue.trim()}  // Remove authentication requirement
        className={`
          p-2 rounded-full
          ${inputValue.trim()
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:opacity-90 focus:ring-orange-500'
            : darkMode
              ? 'text-gray-500'
              : 'text-gray-400'}
          transition-opacity
        `}
        aria-label="Send message"
        tabIndex={0}  // Allow guest users to send
      >
        <Send className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};