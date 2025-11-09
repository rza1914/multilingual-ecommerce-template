import React, { useState, KeyboardEvent } from 'react';
import { Send, Plus } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  darkMode: boolean;
  onToggleAIActions: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, darkMode, onToggleAIActions }) => {
  const [inputValue, setInputValue] = useState('');

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
        className={`
          p-2 rounded-full
          ${darkMode 
            ? 'text-gray-300 hover:bg-gray-700 focus:ring-orange-500' 
            : 'text-gray-600 hover:bg-gray-100 focus:ring-orange-500'}
          transition-colors focus:outline-none focus:ring-2
        `}
        aria-label="AI Actions"
        tabIndex={0}
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
      </button>
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={`
            w-full py-2 px-4 rounded-full
            ${darkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-gray-100 text-gray-900 border-gray-200'}
            border focus:outline-none focus:ring-2 focus:ring-orange-500
          `}
          aria-label="Type your message"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!inputValue.trim()}
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
        tabIndex={0}
      >
        <Send className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};