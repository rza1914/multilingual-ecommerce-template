import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Toast, { ToastType } from '../Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  useEffect(() => {
    // Handle ESC key to close modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Update active tab when initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleLoginSuccess = () => {
    setToastMessage('Welcome back! Login successful 🎉');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleRegisterSuccess = () => {
    setToastMessage('Account created successfully! Welcome aboard 🚀');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-start justify-center p-4 pt-16 md:pt-20 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-orange-500/30 dark:border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-500/20 dark:shadow-orange-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 glass-orange p-2 rounded-xl hover:scale-110 transition-transform z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gradient-orange mb-2">
                Welcome to LuxStore
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'login'
                  ? 'Sign in to access your account'
                  : 'Create an account to get started'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 glass-orange p-2 rounded-2xl">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-gradient-orange text-white shadow-lg scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-orange text-white shadow-lg scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Forms */}
            <div className="transition-all duration-300">
              {activeTab === 'login' ? (
                <LoginForm onSuccess={handleLoginSuccess} />
              ) : (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {activeTab === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default AuthModal;
