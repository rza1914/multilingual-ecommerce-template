import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Bot } from 'lucide-react';
import { useChatWidget } from '../hooks/useChatWidget';
import { ChatWidgetCore } from './chat/ChatWidgetCore';
import { useAuth } from '../contexts/AuthContext';

interface FixedFloatingChatBotProps {
  // Optional props for customization
}

const FixedFloatingChatBot: React.FC<FixedFloatingChatBotProps> = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const darkMode = theme === 'dark';
  const isAuthenticated = !!user;

  // Use the chat widget hook for managing all state and position
  const {
    // State
    isOpen,
    showAIActions,
    position,
    isWidgetOffline,

    // Setters
    setIsOpen,
    setShowAIActions,

    // Methods
    handleSendMessage,
    handleAIAction,

    // Chat state from useChat hook
    messages,
    isConnected,
    isTyping,
    unreadCount,
    error,
    markAllAsRead,

    // Refs
    chatContainerRef,
  } = useChatWidget({ positionStyle: 'fixed' }); // Use fixed positioning

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-in-out"
      style={{
        bottom: position.bottom,
        right: position.right
      }}
    >
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`
            flex items-center justify-center w-14 h-14 rounded-full
            shadow-lg hover:shadow-xl transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
            ${darkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'}
            hover:scale-110 relative overflow-hidden
            ${!isConnected && isAuthenticated ? 'animate-pulse' : ''}
          `}
          aria-label={isAuthenticated
            ? t('chat.openChat', 'Open chat')
            : t('chat.openChatGuest', 'Open chat (guest mode)')}
          title={isAuthenticated
            ? t('chat.openChat', 'Open chat')
            : t('chat.openChatGuest', 'Open chat (guest mode)')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(true);
            }
          }}
        >
          <Bot className="w-6 h-6" aria-hidden="true" />
          {unreadCount > 0 && isAuthenticated && (
            <span
              className={`
                absolute -top-2 -right-2 flex items-center justify-center
                w-6 h-6 rounded-full text-xs font-bold text-white
                ${darkMode ? 'bg-red-500' : 'bg-red-600'}
              `}
              aria-label={`${unreadCount} unread messages`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <div className="absolute inset-0 rounded-full opacity-0 bg-white animate-ping"></div>
        </button>
      )}

      {/* Chat Panel - rendered via core component */}
      <ChatWidgetCore
        isOpen={isOpen}
        showAIActions={showAIActions}
        isWidgetOffline={isWidgetOffline}
        isConnected={isConnected}
        isTyping={isTyping}
        unreadCount={unreadCount}
        error={error}
        messages={messages}
        darkMode={darkMode}
        t={t}
        setIsOpen={setIsOpen}
        setShowAIActions={setShowAIActions}
        handleSendMessage={handleSendMessage}
        handleAIAction={handleAIAction}
        markAllAsRead={markAllAsRead}
        chatContainerRef={chatContainerRef}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default FixedFloatingChatBot;