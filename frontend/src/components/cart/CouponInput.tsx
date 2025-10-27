/**
 * Coupon Input Component
 * Input field for applying discount coupons
 */

import React, { useState } from 'react';
import { Check, X, Loader2, Tag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CouponInput: React.FC = () => {
  const { couponCode, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle apply coupon
   */
  const handleApply = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');

    try {
      const success = await applyCoupon(input.trim());

      if (success) {
        setInput('');
      } else {
        setError('Invalid coupon code');
      }
    } catch (err) {
      setError('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle remove coupon
   */
  const handleRemove = () => {
    removeCoupon();
    setError('');
  };

  /**
   * Handle key press (Enter to apply)
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="space-y-3">
      {/* Applied Coupon Display */}
      {couponCode ? (
        <div className="glass-card p-4 flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="glass-orange p-2 rounded-lg">
              <Tag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {couponCode}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {couponCode === 'FREESHIP' ? 'Free shipping applied' : `${couponDiscount}% discount applied`}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="glass-orange p-2 rounded-lg hover:scale-110 transition-transform"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ) : (
        <>
          {/* Coupon Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code"
                disabled={loading}
                className="w-full input-field pl-10 disabled:opacity-50"
              />
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleApply}
              disabled={!input.trim() || loading}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 flex items-center gap-2 animate-slide-down">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Coupon Hints */}
          <div className="glass p-3 rounded-xl">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong className="text-orange-500">Try these codes:</strong> WELCOME10, SAVE20, FREESHIP
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CouponInput;
