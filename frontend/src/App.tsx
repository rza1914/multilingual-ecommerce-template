import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import NotFoundPage from './pages/NotFoundPage';

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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
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
