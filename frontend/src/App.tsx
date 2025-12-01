import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CareersPage = lazy(() => import('./pages/legal/CareersPage'));
const BlogPage = lazy(() => import('./pages/legal/BlogPage'));
const HelpPage = lazy(() => import('./pages/legal/HelpPage'));
const ShippingPage = lazy(() => import('./pages/legal/ShippingPage'));
const ReturnsPage = lazy(() => import('./pages/legal/ReturnsPage'));
const FAQPage = lazy(() => import('./pages/legal/FAQPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('./pages/legal/CookiePolicyPage'));

function AppContent() {
  const { loading } = useAuth();
  const { t } = useTranslation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/products" element={<AdminProducts />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsOfServicePage />} />
            <Route path="cookies" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
