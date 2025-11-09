# FloatingChatBot Troubleshooting Guide

## Common Issues and Solutions

### 1. Positioning Issues

#### Problem: Chat button appears in wrong position
**Symptoms**: 
- Button appears too high or too low
- Button doesn't position relative to login button
- Position remains fixed despite login button moving

**Causes & Solutions**:
1. **Login button not found**: 
   - Check that your login button uses one of the recognized selectors
   - Add appropriate classes like `btn-primary`, `login`, or proper ARIA labels
   - Ensure login button is in a `header`, `.header`, or `nav` element

2. **Dynamic login button loading**:
   - The component polls for buttons with 1-second intervals
   - If button appears after 1+ seconds, position will update automatically
   - For faster updates, consider triggering a manual position recalculation

3. **CSS interfering with getBoundingClientRect()**:
   - Check if CSS transforms affect the button's reported position
   - Verify the login button isn't in a container with `overflow: hidden` that affects position calculations

#### Problem: Button flickering during resize
**Symptoms**:
- Chat button rapidly moves during window resize
- Jittery movement when scrolling

**Solutions**:
1. This is usually due to layout thrashing during resize events
2. The component uses `requestAnimationFrame` to batch updates
3. Ensure no CSS is causing forced synchronous layouts
4. Check that parent containers don't have conflicting positioning rules

### 2. Performance Issues

#### Problem: High CPU usage during scrolling
**Symptoms**:
- Laggy scrolling experience
- High CPU usage when scrolling pages
- Frame drops during scroll events

**Solutions**:
1. The component uses `passive: true` event listeners for scroll
2. Position updates are batched with `requestAnimationFrame`
3. Verify no other scroll handlers are causing conflicts
4. Check that the page doesn't have complex scroll-linked animations

#### Problem: Memory leaks
**Symptoms**:
- Memory usage increases over time
- Event listeners not cleaned up properly

**Solutions**:
1. Verify all event listeners are removed in the cleanup function
2. Confirm ResizeObserver is disconnected on unmount
3. Check that polling intervals are cleared
4. Use React DevTools to verify proper cleanup

### 3. Rendering Issues

#### Problem: Chat button doesn't appear
**Symptoms**:
- Component renders but button is invisible
- Console errors related to missing dependencies

**Causes & Solutions**:
1. **Missing context providers**: 
   - Ensure ThemeProvider and AuthProvider wrap the component
   - Verify React Context is properly configured

2. **Dependency issues**:
   - Check that all required imports are available
   - Ensure all external dependencies (lucide-react, etc.) are properly installed

#### Problem: Animation issues
**Symptoms**:
- Position changes happen without smooth transitions
- Jarring position jumps
- Missing CSS transition classes

**Solutions**:
1. Verify Tailwind CSS includes the transition utilities
2. Check that `transition-all duration-500 ease-in-out` classes are properly applied
3. Ensure no CSS is overriding the transition properties

### 4. Theme Issues

#### Problem: Incorrect theme application
**Symptoms**:
- Wrong colors in dark/light mode
- Theme doesn't update when system theme changes

**Solutions**:
1. Verify ThemeProvider is correctly implemented in parent components
2. Check that the useTheme hook is returning the expected values
3. Ensure CSS classes are properly conditionally applied

### 5. Internationalization Issues

#### Problem: Text not translating properly
**Symptoms**:
- English text showing when other language should be used
- Missing translations for chat bot messages

**Solutions**:
1. Verify React i18next provider is properly configured
2. Ensure translation keys exist in the appropriate language files
3. Check that the i18n instance is properly initialized

## Debugging Steps

### 1. Basic Diagnostics
```javascript
// Add this to your component temporarily to debug positioning
const debugPosition = () => {
  const loginButton = findLoginButtonPosition();
  if (loginButton) {
    console.log('Login button found:', loginButton);
    console.log('Login button position:', loginButton.getBoundingClientRect());
  } else {
    console.log('Login button NOT found');
  }
  
  console.log('Current viewport dimensions:', {
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const newPosition = calculateChatButtonPosition();
  console.log('Calculated chat button position:', newPosition);
};
```

### 2. Position Verification
1. Open browser dev tools
2. Check if login button has one of the recognized selectors
3. Verify getBoundingClientRect() returns expected values
4. Check computed styles for both elements

### 3. Network Tab Check
1. Verify WebSocket connections are working properly
2. Check API endpoints are responding correctly
3. Confirm authentication tokens are being sent

## Environment-Specific Issues

### 1. Mobile Browsers
- iOS Safari might have different CSS rendering
- Mobile browsers have virtual address bars that affect viewport height
- Touch events should work the same as click events

### 2. Different Browsers
- Firefox: Verify ResizeObserver is supported
- Safari: Check for CSS flexibility issues
- Legacy browsers: May require polyfills

### 3. Third-Party Extensions
- Ad blockers might interfere with DOM queries
- Browser extensions might modify page structure
- Privacy extensions might block certain APIs

## Monitoring and Logging

### Console Logging
The component includes error handling for:
- Chat connection failures
- WebSocket errors
- DOM query failures

### Performance Monitoring
To monitor performance:
1. Use browser performance tab to identify bottlenecks
2. Monitor FPS during scrolling and resizing
3. Check memory usage over extended sessions

## Quick Fixes Checklist

- [ ] Verify login button has proper classes/ARIA labels
- [ ] Check if component is wrapped in required providers
- [ ] Confirm positioning constraints aren't too restrictive
- [ ] Validate Tailwind CSS classes are working
- [ ] Check browser console for errors
- [ ] Verify theme context is properly provided
- [ ] Confirm responsive breakpoints are appropriate
- [ ] Test in different browsers and devices

## When to Escalate

Contact the development team if:
1. Issues persist after following troubleshooting steps
2. Browser-specific problems that require deep CSS fixes
3. Complex positioning issues with custom UI frameworks
4. Performance issues that require architecture changes
5. Integration problems with existing application structure