// frontend/src/types/chat.types.ts

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  read: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  unreadCount: number;
  isActive: boolean;
}

export type AIAction = 
  | 'image_analysis'
  | 'product_recommendation'
  | 'price_comparison'
  | 'style_advisor'
  | 'size_recommendation'
  | 'gift_suggestion';