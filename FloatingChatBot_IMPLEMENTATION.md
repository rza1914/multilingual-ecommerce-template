# FloatingChatBot Component Implementation Guide

## Overview
The FloatingChatBot component is a dynamic, responsive chat interface that positions itself relative to the login button on the page. It provides a modern chat interface with AI capabilities while ensuring optimal positioning across different screen sizes and themes.

## Key Features

### 1. Dynamic Positioning Algorithm
- **findLoginButtonPosition()**: Advanced DOM querying algorithm that uses multiple strategies to locate login/auth buttons
- **calculateChatButtonPosition()**: Calculates optimal position 20px below the login button
- **Responsive constraints**: Different position limits for mobile, tablet, and desktop

### 2. Responsive Behavior
- Mobile (< 768px): Minimum 60px from bottom
- Tablet (768px - 1024px): Minimum 70px from bottom  
- Desktop (> 1024px): Minimum 70px from bottom
- Adaptive margins based on screen size

### 3. Performance Optimizations
- Event batching with requestAnimationFrame for scroll events
- Passive scroll listeners for improved performance
- Efficient DOM querying with multiple selector strategies
- Optimized polling that stops once login button is found
- Cleanup of event listeners and observers on unmount

### 4. Accessibility Features
- Proper ARIA labels and roles
- Keyboard navigation support (Enter/Space to open)
- Screen reader-friendly markup
- Focus management

### 5. Theme Integration
- Full dark/light mode support
- Conditional styling based on theme context
- Consistent color scheme with application design

## API & Props

### FloatingChatBot Props
```typescript
interface FloatingChatBotProps {
  // Currently no required props - all functionality is self-contained
}
```

## Implementation Details

### Positioning Algorithm
1. Search for login button using multiple strategies:
   - SVG class matching (User, LogOut icons)
   - CSS class matching (btn-primary, login, auth)
   - Text content matching ('Login', 'ورود', 'Sign')
   - ARIA label matching
2. Calculate position 20px below the found button
3. Apply viewport constraints and screen-size-specific limits
4. Use fallback positioning if login button isn't found

### Event Handling
- Window resize: Updates position when viewport changes
- Scroll: Efficiently batches updates using requestAnimationFrame
- DOM mutations: Uses ResizeObserver to watch for header changes
- Asynchronous loading: Polling mechanism for dynamically loaded buttons

### Animation & Transitions
- Smooth position transitions (duration-500 ease-in-out)
- Hover and interaction animations
- Consistent timing across all UI states

## Testing

### Integration Tests
- Positioning accuracy across screen sizes
- Animation and transition functionality
- CSP compliance verification
- Chat opening/closing functionality
- Theme integration validation
- Performance and memory leak checks

### Test Scenarios
- Missing login button (fallback positioning)
- Dynamically added login button
- Multiple resize events
- Theme switching
- Mobile responsiveness

## Browser Support
- Modern browsers supporting ResizeObserver
- Full support for Chrome, Firefox, Safari, Edge
- Responsive behavior on mobile devices
- Touch and keyboard accessibility

## CSP Compliance
- Uses safe inline styles via React's style prop
- No eval or unsafe-inline content
- Proper Vite configuration for development
- Production-ready security headers

## Performance Metrics
- Efficient DOM querying with memoized functions
- Reduced polling frequency (1000ms)
- Cleanup of all resources on unmount
- Minimal re-renders with useCallback and memoization

## Maintenance Guide

### Adding New Positioning Strategies
1. Add selector strategy to `selectorOptions` array in `findLoginButtonPosition()`
2. Ensure new strategy follows accessibility and performance guidelines
3. Test with various UI frameworks and CSS classes

### Adjusting Positioning Constraints
1. Modify `SCREEN_BREAKPOINTS` constant for different size thresholds
2. Update min/max values in `calculateChatButtonPosition()` for each screen size
3. Test responsive behavior across all device sizes

### Theme Customization
1. Add new theme variants in conditional class strings
2. Ensure color contrast meets accessibility standards
3. Test in both light and dark mode environments

## Security Considerations
- No external scripts or unsafe content
- Proper input sanitization in DOM queries
- CSP-compliant implementation
- Secure WebSocket connections for chat functionality

## Troubleshooting

### Positioning Issues
- Check if login button has one of the recognized selectors
- Verify DOM structure is as expected
- Check for CSS that might affect getBoundingClientRect

### Performance Issues
- Verify event listeners are properly cleaned up
- Check for memory leaks in ResizeObserver
- Monitor polling frequency if login button is slow to load

### Animation Issues
- Confirm Tailwind CSS classes are properly loaded
- Verify transition utilities are included in build
- Check for CSS that might override transition styles