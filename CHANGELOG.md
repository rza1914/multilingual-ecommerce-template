## 2026-01-06
### Fixed
- Fixed `Toast.tsx` ReferenceError: `t is not defined` - added missing `useTranslation` import and hook
- Added fallback text for `aria-label` in case translation key is missing
- Fixed 500 Internal Server Error in `/api/v1/admin/dashboard/stats` endpoint
- Added safe type conversion functions (`safe_float`, `safe_int`, `safe_str`) to handle None values from database
- Fixed TypeError when `func.sum()` returns None (no orders in database)
- Fixed status enum to string conversion for orders_by_status

### Added
- Created `backend/app/schemas/admin.py` with Pydantic models for admin API
- Added comprehensive error logging in admin endpoints
- Added graceful fallback for top_products query if OrderItem model doesn't exist

## 2026-01-04 - Enable AI Actions for Guest Users

### Changed
- **ChatInput**: Fixed disabled + button for guest users
  - Removed authentication requirement for AI actions button
  - Guest users can now access AI Quick Actions menu
  - Consistent styling for both authenticated and guest users

### Added
- **AI Translation Keys**: Extended AI functionality translations
  - Added 'worthBuying' and 'suggestAlternatives' keys to EN, FA, AR locales
  - Added new 'quickActions' section with detailed AI assistant labels
  - Enhanced AI features with comprehensive translation support

## 2026-01-04 - Smart Search and Filters Redesign

### Changed
- **SmartSearchBar**: Complete UX overhaul
  - Removed redundant search button (was duplicate functionality)
  - Changed Brain icon to Sparkles for consistent AI branding
  - Sparkles icon is now clickable and opens Quick Actions menu
  - Quick Actions now open ChatBot with pre-filled prompt
  - Added ESC key support to close dropdowns
  - Updated currency formatting based on locale
  - Improved RTL support with logical properties

- **FixedFloatingChatBot**: Added event-driven integration
  - Added event listener for `openChatWithPrompt` custom event
  - ChatBot now opens with pre-filled prompt from Quick Actions
  - Enables seamless AI assistant experience

- **FiltersSidebar**: Converted from static sidebar to glass drawer overlay
  - Now renders as a slide-in drawer on all screen sizes (not just mobile)
  - Uses existing `glass-card` and `glass-orange` styles for consistency
  - Added ESC key to close and body scroll lock when open
  - Improved accessibility with proper ARIA attributes

- **ProductsPage**: Updated layout
  - Removed sidebar flex layout - products now use full width
  - Grid updated to show 4 columns on xl screens (sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
  - Filters now appear as overlay drawer instead of side panel
  - Added effect to refetch products when price filters change

### Added
- **Custom Event System**: `openChatWithPrompt` event
  - SmartSearchBar dispatches event when Quick Action is clicked
  - FixedFloatingChatBot listens and opens with the prompt
  - Enables seamless AI assistant experience

### Fixed
- Smart Search now properly integrates with AI ChatBot
- No more decorative/non-functional AI icons
- Improved accessibility and keyboard navigation
- Better RTL/LTR support with logical CSS properties

## 2026-01-04
### Changed
- **FiltersSidebar**: Converted from static sidebar to glass drawer overlay
  - Now slides in from right (LTR) or left (RTL) on all screen sizes
  - Uses existing `glass-card` and `glass-orange` styles for consistency
  - Added ESC key to close and body scroll lock when open
  - Improved accessibility with proper ARIA attributes

- **ProductsPage**: Updated layout
  - Removed sidebar flex layout - products now use full width
  - Grid updated to show 4 columns on xl screens
  - Filter button remains fixed at bottom-right (RTL aware)

## 2026-01-04
### Fixed
- **CSP Configuration for Unsplash Images**
  - Updated CSP in index.html meta tag to allow images.unsplash.com
  - Updated CSP in vite.config.ts to include images.unsplash.com in connect-src
  - Updated CSP in csp-prod.config.js to include images.unsplash.com in connect-src
  - Updated CSP in server.js to include images.unsplash.com in connect-src
  - All configurations now properly allow Unsplash image loading

### Added
- **Missing Translation Keys**
  - Added 'products.productsFound' and 'products.productFound' keys to EN, FA, AR locales
  - Added fallback translations for product count display

## 2026-01-03
### Changed
- **MiniCart UI Enhancement**
  - Applied true glassmorphism effect with backdrop blur
  - Made layout more compact (reduced padding from 6 to 3-4)
  - Improved visual hierarchy with clear Header/Items/Footer sections
  - Smaller product images (56px instead of 80px)
  - Inline quantity controls for space efficiency
  - Better animation timing for item appearance
  - Maintained RTL/LTR and dark mode support

### Notes
- CartSidebar.jsx, CartItem.jsx, and cart-sidebar.css are unused legacy files

## 2026-01-03 (Update 2)
### Enhanced
- **MiniCart Glassmorphism Polish**
  - Increased backdrop blur from 20px to 40px
  - Added glass reflections and highlights
  - Enhanced gradient backgrounds for true glass effect
  - Improved card items with glass borders
  - Added subtle inner shadows for depth
  - Refined animations with elastic easing
  - Better scrollbar styling matching glass theme
  - Polished dark mode glass appearance

## 2026-01-03 (Update 3)
### Changed
- **MiniCart Unified with Site Design System**
  - Replaced custom glassmorphism with standard `glass-card` class
  - Using `glass-orange` for accent elements (icons, badges, totals)
  - Matches LanguageSwitcher dropdown styling exactly
  - Consistent border colors (`border-orange-500/30`)
  - Using `btn-primary` for checkout button
  - Unified hover states and transitions

## 2026-01-03
### Fixed
- **LanguageSwitcher RTL Overflow**
  - Fixed dropdown menu overflowing viewport in RTL mode
  - Changed `right-0` to `ltr:right-0 rtl:left-0` for proper RTL alignment
  - Dropdown now mirrors correctly in both LTR and RTL

## 2026-01-03
### Changed
- **Products Page Smart Search Redesign**
  - Removed legacy/new version toggle button
  - SmartSearchBar now uses glass-card and glass-orange classes
  - Fixed RTL issues: replaced ml/mr with ms/me logical properties
  - Consistent styling with LanguageSwitcher and MiniCart
  - Added AI sparkle icon to search bar
  - Improved dropdown results styling

### Removed
- Legacy MultilingualSmartSearchBar toggle from Products page
- LegacyWrapper import (no longer needed)

## 2026-01-03
### Added
- **AI Quick Actions Component**
  - New dropdown menu with predefined AI prompts
  - Actions: Compare prices, Find size, Summarize reviews, Cheaper alternatives, Budget search
  - RTL/LTR safe positioning with glass-card styling
  - Accessible with keyboard navigation

### Changed
- **SmartSearchBar AI Affordance**
  - Added Brain icon to indicate AI functionality (not customer support)
  - Integrated AIQuickActions button in search bar
  - Added AI hint text below search bar
  - Added "Processing with AI" loading message

- **FixedFloatingChatBot Icon**
  - Changed Bot icon to Sparkles to indicate AI assistant

### Translations
- Added AI Quick Actions labels in EN, FA, AR