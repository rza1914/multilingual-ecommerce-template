import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import MiniCart from './cart/MiniCart';
import AuthModal from './auth/AuthModal';
import SearchModal from './search/SearchModal';
import ProductModal from './products/ProductModal';
import { useAuth } from '../contexts/AuthContext';
import Toast, { ToastType } from './Toast';
import { ShoppingCart, User, Menu, X, Search, Sparkles, LogOut, UserCircle, Package, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types/product.types';

const Header = () => {
  const { t, ready } = useTranslation();
  console.log('COMPONENT (Header): useTranslation ready status:', ready);
  console.log('COMPONENT (Header): t("common.storeName") returns:', t('common.storeName'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setToastMessage(t('auth.logoutSuccess'));
    setToastType('success');
    setShowToast(true);
  };

  const navLinks = [
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-orange shadow-glass-orange py-3' : 'glass py-4'
      }`}
    >
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-orange-500 animate-float" />
            <div className="absolute inset-0 bg-orange-500/30 blur-xl animate-pulse-slow" />
          </div>
          <span className="text-2xl font-bold text-gradient-orange tracking-tight">{t('common.storeName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-orange-500'
                  : 'text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-orange rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden md:flex glass-orange p-2.5 rounded-xl hover:scale-110 transition-transform"
            aria-label={t('buttons.search')}
          >
            <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </button>



          {/* Cart Button with Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative glass-orange p-2.5 rounded-xl hover:scale-110 transition-transform glow-orange"
            aria-label={t('buttons.openCart')}
          >
            <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-slow">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* User Profile / Auth Buttons */}
          {isAuthenticated && user ? (
            // Authenticated: Show user dropdown
            <div ref={userMenuRef} className="relative hidden md:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="glass-orange px-3 py-2 rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials()}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border-2 border-orange-500/30 animate-scale-in overflow-hidden">
                  <div className="p-4 border-b border-orange-500/20">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                  </div>

                  <div className="p-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-left font-semibold"
                        >
                          <Shield className="w-5 h-5" />
                          <span className="text-sm">{t('nav.admin')}</span>
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                      </>
                    )}

                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-left"
                    >
                      <UserCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">{t('nav.profile')}</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-left"
                    >
                      <Package className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">{t('nav.orders')}</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">{t('auth.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not authenticated: Show Login/Signup buttons
            <>
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:flex glass-orange px-4 py-2 rounded-xl hover:scale-105 transition-transform text-sm font-semibold text-gray-900 dark:text-white"
              >
                {t('auth.login.title')}
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('signup');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:flex btn-primary text-sm px-4 py-2"
              >
                {t('auth.signup')}
              </button>
            </>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden glass-orange p-2.5 rounded-xl hover:scale-110 transition-transform"
            aria-label={t('buttons.menu')}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            ) : (
              <Menu className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="container mx-auto px-4 py-6 glass-orange mt-4 rounded-3xl">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-orange text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/admin');
                      }}
                      className="px-4 py-3 rounded-2xl font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center gap-2 w-full text-left"
                    >
                      <Shield className="w-5 h-5" />
                      {t('nav.admin')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="px-4 py-3 rounded-2xl font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center gap-2 w-full text-left"
                  >
                    <UserCircle className="w-5 h-5" />
                    {t('nav.profile')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/orders');
                    }}
                    className="px-4 py-3 rounded-2xl font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center gap-2 w-full text-left"
                  >
                    <Package className="w-5 h-5" />
                    {t('nav.orders')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-3 rounded-2xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthModalTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-4 py-3 rounded-2xl font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center gap-2 w-full text-left"
                  >
                    <User className="w-5 h-5" />
                    {t('auth.login.title')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthModalTab('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="btn-primary w-full"
                  >
                    {t('auth.signup')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mini Cart */}
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onProductClick={handleProductClick}
      />



      {/* Product Modal (from search) */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={() => {}}
        />
      )}

      {/* Toast Notification */}
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </header>
  );
};

export default Header;