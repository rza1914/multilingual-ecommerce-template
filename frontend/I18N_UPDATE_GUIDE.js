// Example code snippets for updating components with i18n

// 1. Import the translation hook at the top of your component
import { useTranslation } from 'react-i18next';

// 2. Inside your component, use the hook
const { t } = useTranslation();

// 3. Replace hardcoded text with translation keys

// Before:
<button>Add to Cart</button>

// After:
<button>{t('product.addToCart')}</button>

// =====================================================
// For product titles and descriptions
// =====================================================

import { getLocalizedTitle, getLocalizedDescription, formatCurrency } from '../utils/i18n';

// Before:
const title = product.title_en;
const description = product.description_en;
const price = `$${product.price.toFixed(2)}`;

// After:
const title = getLocalizedTitle(product);
const description = getLocalizedDescription(product);
const price = formatCurrency(product.price);

// =====================================================
// Common replacements needed across components:
// =====================================================

// Headers & Navigation
"Home" → {t('nav.home')}
"Products" → {t('nav.products')}
"Cart" → {t('nav.cart')}
"Checkout" → {t('nav.checkout')}
"Profile" → {t('nav.profile')}
"Orders" → {t('nav.orders')}

// Buttons
"Add to Cart" → {t('product.addToCart')}
"Buy Now" → {t('product.buyNow')}
"View Details" → {t('product.viewDetails')}
"Submit" → {t('common.submit')}
"Cancel" → {t('common.cancel')}
"Save" → {t('common.save')}
"Delete" → {t('common.delete')}
"Edit" → {t('common.edit')}

// Auth
"Login" → {t('auth.login')}
"Sign Up" → {t('auth.signup')}
"Logout" → {t('auth.logout')}
"Email" → {t('auth.email')}
"Password" → {t('auth.password')}

// Product
"Price" → {t('product.price')}
"Stock" → {t('product.stock')}
"In Stock" → {t('product.inStock')}
"Out of Stock" → {t('product.outOfStock')}
"Rating" → {t('product.rating')}

// Cart
"Shopping Cart" → {t('cart.title')}
"Your cart is empty" → {t('cart.empty')}
"Subtotal" → {t('cart.subtotal')}
"Total" → {t('cart.total')}
"Quantity" → {t('cart.quantity')}
"Remove" → {t('cart.remove')}

// Messages
"Loading..." → {t('common.loading')}
"Error" → {t('common.error')}
"Success" → {t('common.success')}

// Checkout
"Shipping Information" → {t('checkout.shippingInfo')}
"Payment Information" → {t('checkout.paymentInfo')}
"Full Name" → {t('checkout.fullName')}
"Address" → {t('checkout.address')}
"City" → {t('checkout.city')}
"Phone" → {t('checkout.phone')}

// Search
"Search products..." → {t('search.placeholder')}
"No products found" → {t('search.noResults')}

// =====================================================
// With variables:
// =====================================================

// Before:
`Only ${stock} left!`

// After:
{t('product.lowStock', { count: stock })}

// Before:
`${count} items in cart`

// After:
{t('cart.itemsInCart', { count: count })}
