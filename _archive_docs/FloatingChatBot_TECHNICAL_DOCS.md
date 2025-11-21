# FloatingChatBot Component - Technical Documentation

## Overview
The FloatingChatBot is a dynamic, responsive chat interface component that intelligently positions itself relative to the login button on the page. This component provides an AI-powered chat experience while maintaining optimal positioning across different screen sizes and themes.

## Core Positioning Algorithm

### 1. findLoginButtonPosition() Function
The component uses an advanced algorithm to locate the login button on the page:

#### Selector Strategy Hierarchy:
1. **SVG Icon Matching**: 
   - `header button:has(svg[class*="User"])`
   - `header button:has(svg[class*="LogOut"])`
   
2. **CSS Class Matching**:
   - `header .btn-primary` (Primary buttons in header)
   - `button.login`, `button.auth` (Specific login/auth classes)

3. **ARIA Label Matching**:
   - `header [aria-label*="login" i]`
   - `header [aria-label*="auth" i]`

4. **General Header Buttons**:
   - `.header button`
   - `nav button`

#### Validation Process:
For each potential button found, the function validates:
- Text content (contains 'login', 'ورود', 'sign', etc.)
- ARIA label content
- CSS classes (login, auth, btn-primary)
- Parent container (must be in header/nav)

### 2. calculateChatButtonPosition() Function
Once the login button is located, the system calculates the optimal position:

#### Core Calculation:
```javascript
let calculatedBottom = viewportHeight - rect.bottom + 20; // 20px below login button
```

#### Responsive Constraints:
- **Mobile** (width < 768px):
  - Minimum: 60px from bottom
  - Maximum: viewportHeight - 80px
  - Right margin: 1rem

- **Tablet** (768px ≤ width < 1024px):
  - Minimum: 70px from bottom  
  - Maximum: viewportHeight - 90px
  - Right margin: 1.25rem

- **Desktop** (width ≥ 1024px):
  - Minimum: 70px from bottom
  - Maximum: viewportHeight - 100px
  - Right margin: 1.5rem

#### Fallback Positioning:
If no login button is found:
- Mobile: bottom: 4rem, right: 1rem
- Tablet: bottom: 5rem, right: 1.25rem
- Desktop: bottom: 6rem, right: 1.5rem

## Implementation Architecture

### React Hooks Utilization
1. **useState**: Manages component state (isOpen, showAIActions, position)
2. **useEffect**: Handles position calculation and event listener setup
3. **useCallback**: Memoizes functions for performance optimization
4. **useRef**: Maintains references to DOM elements and observers
5. **useTranslation**: For internationalization support
6. **useTheme**: For theme context integration
7. **useAuth**: For authentication state
8. **useChat**: For chat functionality

### Event Handling Strategy
1. **Resize Events**: Updates position when viewport changes
2. **Scroll Events**: Batched using requestAnimationFrame for performance
3. **ResizeObserver**: Monitors login button for size/position changes
4. **Polling Mechanism**: Asynchronous button detection (stops when found)

### Performance Optimizations
- **Event batching**: Scroll updates batched with requestAnimationFrame
- **Passive event listeners**: For improved scroll performance
- **Memoized functions**: useCallback prevents unnecessary re-renders
- **Intelligent polling**: Stops when login button is found
- **Efficient DOM querying**: Multiple selector strategies with validation

## Component Lifecycle

### Mount Phase
1. Initial position calculation
2. Event listener registration (resize, scroll)
3. ResizeObserver setup (if available)
4. Login button polling (if needed)

### Runtime Phase
1. Position updates triggered by:
   - Window resize
   - Scroll events
   - DOM mutations (via ResizeObserver)
   - Login button appearance
2. Animation handling for position transitions
3. Theme updates

### Unmount Phase
1. Event listener removal
2. ResizeObserver cleanup
3. Interval clearing
4. Resource deallocation

## Security Considerations

### CSP Compliance
- No inline styles/scripts - all dynamic styling uses React's style prop
- Safe DOM manipulation with validated selectors
- No eval or Function constructor usage
- Properly escaped content in templates

### Input Validation
- DOM queries use validated selectors
- Position values are constrained within viewport bounds
- Component prop validation (though no required props currently)

## Accessibility Features

### ARIA Attributes
- `aria-label` for chat open/close buttons
- `role="button"` for interactive elements
- `role="dialog"` and `aria-modal` for chat panel
- `aria-live` for message updates

### Keyboard Navigation
- Enter/Space to open chat
- Proper focus management
- Accessible button elements

### Screen Reader Support
- Proper semantic HTML
- ARIA labels for all interactive elements
- Live region for dynamic content updates

## Performance Metrics

### Bundle Size Considerations
- Lightweight implementation with minimal dependencies
- Tree-shakeable utility functions
- Efficient algorithm prevents unnecessary DOM operations

### Memory Management
- Proper cleanup of event listeners
- Observer pattern with correct disposal
- No memory leaks in component lifecycle

### Rendering Performance
- Smooth position transitions (duration-500 ease-in-out)
- Optimized position updates prevent layout thrashing
- Efficient re-rendering with memoization