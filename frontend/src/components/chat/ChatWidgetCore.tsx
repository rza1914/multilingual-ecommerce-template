import React, { useEffect } from 'react';
import { TFunction } from 'i18next';
import { Bot, Lock, X, WifiOff } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AIActionsMenu } from './AIActionsMenu';
import { AIAction } from '../../types/chat.types';

interface ChatWidgetCoreProps {
  // State from hook
  isOpen: boolean;
  showAIActions: boolean;
  isWidgetOffline: boolean;
  isConnected: boolean;
  isTyping: boolean;
  unreadCount: number;
  error: any;
  messages: any[];
  darkMode: boolean;
  t: TFunction;

  // Methods from hook
  setIsOpen: (isOpen: boolean) => void;
  setShowAIActions: (show: boolean) => void;
  handleSendMessage: (text: string) => void;
  handleAIAction: (action: AIAction) => void;
  markAllAsRead: () => void;

  // Refs
  chatContainerRef: React.RefObject<HTMLDivElement>;

  // Additional props for customization
  title?: string;
  className?: string;
  isAuthenticated?: boolean;
}

export const ChatWidgetCore: React.FC<ChatWidgetCoreProps> = ({
  isOpen,
  showAIActions,
  isWidgetOffline,
  isConnected,
  isTyping,
  unreadCount,
  error,
  messages,
  darkMode,
  t,
  setIsOpen,
  setShowAIActions,
  handleSendMessage,
  handleAIAction,
  markAllAsRead,
  chatContainerRef,
  title = t('chat.assistantName', 'AI Shopping Assistant'),
  className = '',
  isAuthenticated = true
}) => {
  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  // Show error if connection fails
  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`
            w-80 sm:w-96 max-w-[90vw] h-[500px] sm:h-[600px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl
            ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
            border ${isConnected && !isWidgetOffline ? (darkMode ? 'border-gray-700' : 'border-gray-200') : 'border-red-500'}
            overflow-hidden transition-all duration-300
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Header */}
          <div
            className={`
              p-4 flex items-center justify-between
              ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}
              border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            `}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="relative">
                <Bot className="w-8 h-8 text-orange-500" aria-hidden="true" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${isConnected && !isWidgetOffline ? 'bg-green-500' : 'bg-red-500'}`} aria-label={isConnected && !isWidgetOffline ? t('chat.online', 'Online') : t('chat.offline', 'Offline')}></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isConnected && !isWidgetOffline ? t('chat.online', 'Online') : t('chat.offline', 'Offline')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`
                p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500
              `}
              aria-label={t('chat.closeChat', 'Close chat')}
              tabIndex={0}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            role="log"
            aria-live="polite"
          >
            {(!isConnected && messages.length === 0) && (
              <div className="text-center py-2 text-sm text-orange-500 flex items-center justify-center">
                <WifiOff className="w-4 h-4 mr-1" />
                {t('chat.connecting', 'Connecting...')}
              </div>
            )}
            {messages.length === 0 && isConnected && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="mb-4 p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Bot className="w-8 h-8 text-orange-500" aria-hidden="true" />
                </div>
                <h4 className="font-medium text-lg">{t('chat.welcome', 'Welcome to AI Shopping Assistant!')}</h4>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('chat.intro', 'Ask me anything about products, get recommendations, or analyze images!')}
                </p>
                {!isAuthenticated && (
                  <div className={`mt-3 text-xs px-3 py-2 rounded ${darkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                    {t('chat.guest_mode', 'You are in guest mode. You can chat with the AI assistant without logging in.')}
                  </div>
                )}
              </div>
            )}
            {messages.length > 0 && (
              <>
                {console.log('Current messages state:', messages)}
                {messages.map((message, index) => {
                  // Properly format the message to ensure it has the right structure
                  const formattedMessage = typeof message === 'string'
                    ? { id: index.toString(), content: message, role: 'assistant', timestamp: new Date().toISOString() }
                    : message;

                  return (
                    <ChatMessage
                      key={formattedMessage.id || index.toString()}
                      message={formattedMessage}
                      isCurrentUser={index % 2 === 0}
                    />
                  );
                })}
              </>
            )}
            {isTyping && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1" aria-hidden="true">
                      <Bot className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('chat.typing', 'AI is typing...')}
                    </span>
                  </div>
                  <div className="ml-6 flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" aria-hidden="true"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} aria-hidden="true"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} aria-hidden="true"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Actions Menu */}
          {showAIActions && (
            <AIActionsMenu
              onAction={handleAIAction}
              onClose={() => setShowAIActions(false)}
              darkMode={darkMode}
              t={t}
            />
          )}

          {/* Input Area */}
          <div
            className={`
              p-3 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
            `}
          >
            <ChatInput
              onSend={handleSendMessage}
              darkMode={darkMode}
              onToggleAIActions={() => setShowAIActions(!showAIActions)}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      )}
    </>
  );
};