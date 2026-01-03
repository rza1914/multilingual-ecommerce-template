# Hardcoded Strings Report

## Overview
This report details the hardcoded strings found in the frontend codebase that should be internationalized using the `t()` function.

## Hardcoded Strings Found

### 1. JSX Content Text
- "RTL Example Component" in components/examples/RTLExample.tsx
- "CSP Verification Test" in components/CSPTestComponent.tsx
- "Font Loading Test" in components/CSPTestComponent.tsx
- "Testing Inter font loading" in components/CSPTestComponent.tsx
- "Image Loading Test" in components/CSPTestComponent.tsx
- "External Connection Test" in components/CSPTestComponent.tsx
- "Testing connection to external APIs" in components/CSPTestComponent.tsx
- "CSP Configuration Summary:" in components/CSPTestComponent.tsx
- "connect-src includes: fonts.googleapis.com, images.pexels.com" in components/CSPTestComponent.tsx
- "img-src includes: https: (for external images)" in components/CSPTestComponent.tsx
- "font-src includes: fonts.gstatic.com" in components/CSPTestComponent.tsx
- "style-src includes: fonts.googleapis.com" in components/CSPTestComponent.tsx
- "Legacy Smart Search Error" in components/ComponentBridge.tsx
- "Modern Smart Search Error" in components/ComponentBridge.tsx
- "Loading legacy search..." in components/ComponentBridge.tsx
- "Loading modern search..." in components/ComponentBridge.tsx
- "Loading translations..." in main.tsx
- "Toggle RTL" in contexts/RTLContext.test.tsx
- "Test" in contexts/RTLContext.test.tsx
- "Image unavailable" in components/ImageErrorBoundary.tsx
- "Or continue with" in components/auth/LoginForm.tsx

### 2. Placeholder Attributes (Not Using t() Function)
- "John Doe" in components/auth/RegisterForm.tsx
- "your@email.com" in components/auth/RegisterForm.tsx and components/auth/LoginForm.tsx
- "••••••••" in components/auth/RegisterForm.tsx and components/auth/LoginForm.tsx
- "جستجوی هوشمند محصولات... (مثلاً 'گوشی سامسونگ زیر 20 میلیون')" in components/legacy/SmartSearchBar.tsx

### 3. Alt Attributes (Non-dynamic)
- "Our store" in pages/AboutPage.tsx
- "Test image from Pexels" in components/CSPTestComponent.tsx
- "Uploaded product" in components/legacy/ImageSearchModal.tsx

### 4. Title and Aria-label Attributes (Non-dynamic)
- Dynamic values like `${unreadCount} unread messages` in FixedFloatingChatBot.tsx (these are OK as they contain variables)

## Recommended Actions

1. **Create new translation keys** for all hardcoded strings
2. **Replace hardcoded strings** with `t('key')` function calls
3. **Add new keys to all locale files** (en.json, fa.json, ar.json)
4. **Test all UI elements** after implementing changes to ensure proper translation

## Priority Classification

- **High Priority**: Navigation elements, buttons, CTAs
- **Medium Priority**: Form placeholders, labels
- **Low Priority**: Descriptive text, error messages

## Files to Update

- All affected .tsx files containing hardcoded strings
- en.json, fa.json, ar.json - add new translation keys