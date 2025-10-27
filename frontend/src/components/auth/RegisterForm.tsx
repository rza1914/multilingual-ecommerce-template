import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, Check, X, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onSuccess: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [termsError, setTermsError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  // Password strength checker
  const passwordStrength = useMemo(() => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };

    // Check for numbers and special characters
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 6) {
      return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    }
    if (password.length >= 10 && hasNumber && hasSpecial) {
      return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    }
    return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    // Check terms agreement
    if (!agreeToTerms) {
      setTermsError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setApiError('');
    setTermsError('');

    try {
      // Call register API (will auto-login after registration)
      await registerUser(data.name, data.email, data.password);

      // Success - call parent success handler
      onSuccess();
    } catch (error: any) {
      // Display error message
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* API Error Message */}
      {apiError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            disabled={isLoading}
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border-2 ${
              errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
            } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="John Doe"
          />
        </div>
        {errors.name && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="register-email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="register-email"
            disabled={isLoading}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border-2 ${
              errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
            } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="your@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="register-password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            disabled={isLoading}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 rounded-2xl border-2 ${
              errors.password
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
            } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength:</span>
              <span
                className={`text-xs font-semibold ${
                  passwordStrength.label === 'Weak'
                    ? 'text-red-500'
                    : passwordStrength.label === 'Medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                style={{ width: passwordStrength.width }}
              />
            </div>
          </div>
        )}
        {errors.password && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            disabled={isLoading}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className={`w-full pl-12 pr-16 py-3 bg-white dark:bg-gray-800 rounded-2xl border-2 ${
              errors.confirmPassword
                ? 'border-red-500 focus:border-red-500'
                : confirmPassword && password === confirmPassword
                ? 'border-green-500 focus:border-green-500'
                : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
            } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {confirmPassword && password === confirmPassword && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
          {confirmPassword && password !== confirmPassword && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <X className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => {
              setAgreeToTerms(e.target.checked);
              setTermsError('');
            }}
            disabled={isLoading}
            className={`mt-1 w-5 h-5 rounded border-2 ${
              termsError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            I agree to the{' '}
            <button
              type="button"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
              disabled={isLoading}
            >
              Terms and Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
              disabled={isLoading}
            >
              Privacy Policy
            </button>
          </span>
        </label>
        {termsError && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {termsError}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or sign up with</span>
        </div>
      </div>

      {/* Social Sign Up Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isLoading}
          className="btn-glass flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="btn-glass flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
