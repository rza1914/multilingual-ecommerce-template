# FloatingChatBot Component API Documentation

## Component Overview

The `FloatingChatBot` is a self-contained React component that provides an AI-powered chat interface with dynamic positioning capabilities.

### Import Statement
```javascript
import FloatingChatBot from './components/FloatingChatBot';
```

## Props

### FloatingChatBot Props Interface
```typescript
interface FloatingChatBotProps {
  // Currently no required props - all functionality is self-contained
  // This interface is reserved for future customization options
}
```

### Available Props

#### `children` (Not Available)
- Type: `ReactNode` (Reserved for future use)
- Default: `undefined`
- Description: This component does not accept children as it renders its own UI

#### `className` (Not Available)
- Type: `string` (Reserved for future use)
- Default: Component-specific classes
- Description: Custom styling is not currently supported through props but could be added in future versions

## Component Structure

### High-Level Architecture
```
FloatingChatBot
├── Floating Button (when closed)
│   ├── Bot Icon
│   ├── Unread Badge (optional)
│   └── Open Chat Handler
└── Chat Panel (when open)
    ├── Header
    │   ├── Bot Icon
    │   ├── Status Indicator
    │   ├── Title
    │   └── Close Button
    ├── Messages Container
    │   ├── Individual Messages
    │   └── Typing Indicator
    ├── AI Actions Menu (optional)
    │   └── Action Buttons
    └── Input Area
        ├── Message Input
        └── Send Button
```

## State Management

### Internal State
The component manages several internal states:

#### `isOpen`
- Type: `boolean`
- Default: `false`
- Description: Controls the visibility of the chat panel

#### `showAIActions`
- Type: `boolean` 
- Default: `false`
- Description: Controls visibility of AI action menu

#### `position`
- Type: `{ bottom: string, right: string }`
- Default: `{ bottom: '6rem', right: '1.5rem' }`
- Description: Dynamic positioning object calculated based on login button position

### Derived State
- `darkMode`: Boolean derived from theme context
- `messages`: Array from chat hook
- `isConnected`: Boolean from chat hook  
- `isTyping`: Boolean from chat hook
- `unreadCount`: Number from chat hook
- `error`: Error state from chat hook

## Context Dependencies

### Required Contexts
The component depends on several React contexts:

#### `ThemeContext`
- Purpose: Manages light/dark mode
- Hook: `useTheme()`
- Returned Value: `{ theme: 'light' | 'dark' }`

#### `AuthContext`
- Purpose: Provides authentication state
- Hook: `useAuth()`
- Returned Value: `{ user: User | null }`

#### `useChat` Hook
- Purpose: Manages chat state and WebSocket connection
- Function: `useChat()`
- Returned Value: Comprehensive chat state object

## Event Handlers

### User Interactions

#### `onOpenChat`
- Trigger: Click on floating button or press Enter/Space
- Action: Sets `isOpen` to `true`
- Accessibility: Available via keyboard navigation

#### `onCloseChat` 
- Trigger: Click on close button (X icon)
- Action: Sets `isOpen` to `false`
- Side Effect: May trigger message read status updates

#### `onSendMessage`
- Trigger: Submitting chat input
- Action: Sends message via WebSocket
- Validation: Message content checked before sending

#### `onToggleAIActions`
- Trigger: Clicking the AI actions button
- Action: Toggles `showAIActions` state
- UI Effect: Shows/hides action menu

### System Events

#### Position Updates
- Trigger: Window resize, scroll, or DOM mutation
- Action: Recalculates position based on login button
- Performance: Batched with `requestAnimationFrame`

## Styling and CSS Classes

### Dynamic Classes
The component applies different classes based on state:

#### Button Classes
- Base: `fixed z-50 transition-all duration-500 ease-in-out`
- Hover: `hover:scale-110`
- Connection Status: `animate-pulse` (when disconnected)
- Theme: Conditional gradient based on dark mode

#### Chat Panel Classes
- Base: `w-80 sm:w-96 max-w-[90vw] h-[500px] sm:h-[600px] max-h-[80vh]`
- Theme: Conditional background/text colors
- Animation: `transition-all duration-300`

### Responsive Classes
- Width: `w-80 sm:w-96 max-w-[90vw]`
- Height: `h-[500px] sm:h-[600px] max-h-[80vh]`
- Typography: Responsive text sizes

## Dependencies

### External Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.294.0",
  "react-i18next": "^13.5.0"
}
```

### Project Dependencies
- `useTranslation` from `react-i18next`
- `useTheme` from `../contexts/ThemeContext`
- `useAuth` from `../contexts/AuthContext`
- `useChat` from `../hooks/useChat`
- `Message` and `AIAction` types from `../types/chat.types`

## Accessibility Features

### ARIA Attributes
- `role="button"` and `aria-label` for chat button
- `role="dialog"` and `aria-modal` for chat panel
- `aria-live="polite"` for message updates
- `aria-label` for unread count badge

### Keyboard Navigation
- Enter/Space opens chat when button is focused
- Tab navigation through chat elements
- Close with Escape key (not implemented but could be added)

## Internationalization

### Translation Keys Used
- `chat.openChat` - Label for open chat button
- `chat.closeChat` - Label for close chat button  
- `chat.assistantName` - Chat panel title
- `chat.online` - Online status
- `chat.offline` - Offline status
- `chat.connecting` - Connecting status
- `chat.welcome` - Welcome message
- `chat.intro` - Chat introduction
- `chat.typing` - Typing indicator
- `chat.aiSuggestions.*` - AI action descriptions
- `chat.aiSuggestions.default` - Default AI suggestion

## Performance Characteristics

### Rendering Optimizations
- Function memoization with `useCallback`
- Efficient DOM querying
- Conditional rendering based on `isOpen` state

### Event Handling
- Passive scroll listeners
- Batched updates with `requestAnimationFrame`
- Proper cleanup in effects

### Bundle Impact
- Minimal external dependencies
- Tree-shakeable functions
- No heavy UI framework requirements

## Error Handling

### Error States
- Chat connection errors are logged to console
- Ungraceful failures in position calculation are handled gracefully
- Missing context providers will cause component failure (by design)

### Fallback Behavior
- If login button not found, uses default positioning
- If WebSocket connection fails, shows offline status
- If auth provider unavailable, uses default behavior

## Integration Guidelines

### Required Wrappers
The component must be wrapped in:
- `ThemeProvider` from `../contexts/ThemeContext`
- `AuthProvider` from `../contexts/AuthContext`

### Expected Page Structure
- Login button should be in a `header`, `.header`, or `nav` element
- Should have appropriate classes or ARIA labels to be detected
- Page should implement proper viewport meta tag for mobile responsiveness

## Future Extensibility

### Reserved Prop Types
The `FloatingChatBotProps` interface is reserved for future customization options such as:
- Positioning overrides
- Custom styling options
- Animation control
- Feature toggles

### Potential Enhancements
- Custom position strategies
- Additional accessibility features
- Advanced customization options
- Multiple chatbot support