import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Check, Truck, Package, Zap, CreditCard, Wallet, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react';
import { createOrder } from '../services/order.service';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalItems, getSubtotal, getTax, getShipping, getDiscount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Shipping and payment state
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Calculate final total
  const finalTotal = getSubtotal() + getTax() + getShipping() - getDiscount();

  // Validate shipping form
  const validateShippingForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!shippingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!shippingData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!shippingData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!shippingData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add some items to your cart before checking out
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, name: 'Shipping' },
    { number: 2, name: 'Delivery' },
    { number: 3, name: 'Payment' },
    { number: 4, name: 'Review' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-4 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} • Total: ${finalTotal.toFixed(2)}
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 -z-10" />

            {/* Active Progress Line */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 -z-10 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                      : currentStep === step.number
                      ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/50 scale-110'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step Name */}
                <span
                  className={`mt-2 text-sm font-semibold transition-colors ${
                    currentStep >= step.number
                      ? 'text-orange-500'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border-2 border-gray-100 dark:border-gray-800">

          {/* Step 1: Shipping Address Form */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Shipping Address
              </h2>

              <form className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                              focus:outline-none transition-colors
                              ${errors.fullName
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                              }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email & Phone Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                                focus:outline-none transition-colors
                                ${errors.email
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                                }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                                focus:outline-none transition-colors
                                ${errors.phone
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                                }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                              focus:outline-none transition-colors
                              ${errors.address
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                              }`}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City, State, ZIP Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                                focus:outline-none transition-colors
                                ${errors.city
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                                }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                                focus:outline-none transition-colors
                                ${errors.state
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                                }`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl
                                focus:outline-none transition-colors
                                ${errors.zipCode
                                  ? 'border-red-500 focus:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                                }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={shippingData.country}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Save Address Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    className="w-5 h-5 rounded border-2 border-orange-500 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="saveAddress" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    Save this address for future orders
                  </label>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Delivery Method
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose your preferred shipping method
              </p>

              <div className="space-y-4">
                {/* Standard Shipping */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        shippingMethod === 'standard'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Standard Shipping
                          </h3>
                          {shippingMethod === 'standard' && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Delivery in 5-7 business days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">$10.00</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>

                {/* Express Shipping */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        shippingMethod === 'express'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Express Shipping
                          </h3>
                          {shippingMethod === 'express' && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Delivery in 2-3 business days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">$25.00</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>

                {/* Next Day Shipping */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'nextday'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        shippingMethod === 'nextday'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Next Day Delivery
                          </h3>
                          {shippingMethod === 'nextday' && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Delivery by tomorrow
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">$50.00</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="shipping"
                    value="nextday"
                    checked={shippingMethod === 'nextday'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Method
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose how you'd like to pay
              </p>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-8">
                {/* Credit Card */}
                <label
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === 'card'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Credit / Debit Card
                      </h3>
                    </div>
                    {paymentMethod === 'card' && (
                      <Check className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === 'cod'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                    }`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Cash on Delivery
                      </h3>
                    </div>
                    {paymentMethod === 'cod' && (
                      <Check className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Card Form (only if card selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Card Details
                  </h3>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.cardName}
                      onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiryDate}
                        onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-2xl">🔒</span>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              )}

              {/* COD Note */}
              {paymentMethod === 'cod' && (
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">
                        Cash on Delivery
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        You'll pay in cash when your order is delivered to your doorstep. Please have exact change ready.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Place Order */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Review Your Order
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please review your order details before placing your order
              </p>

              <div className="space-y-6">

                {/* Shipping Address */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p className="font-semibold">{shippingData.fullName}</p>
                    <p>{shippingData.address}</p>
                    <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p>{shippingData.country}</p>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{shippingData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{shippingData.email}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-semibold"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Shipping Method */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Delivery Method
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {shippingMethod === 'standard' && 'Standard Shipping (5-7 days)'}
                        {shippingMethod === 'express' && 'Express Shipping (2-3 days)'}
                        {shippingMethod === 'nextday' && 'Next Day Delivery'}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-orange-500">
                      {shippingMethod === 'standard' && '$10.00'}
                      {shippingMethod === 'express' && '$25.00'}
                      {shippingMethod === 'nextday' && '$50.00'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-semibold"
                  >
                    Change Method
                  </button>
                </div>

                {/* Payment Method */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      {paymentMethod === 'card' ? (
                        <CreditCard className="w-5 h-5 text-white" />
                      ) : (
                        <Wallet className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Payment Method
                    </h3>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      {paymentMethod === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery'}
                    </p>
                    {paymentMethod === 'card' && cardData.cardNumber && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        •••• •••• •••• {cardData.cardNumber.slice(-4)}
                      </p>
                    )}
                    {paymentMethod === 'cod' && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pay in cash when your order arrives
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-semibold"
                  >
                    Change Payment
                  </button>
                </div>

                {/* Order Items */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Order Items ({getTotalItems()})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4 pb-4 border-b border-gray-300 dark:border-gray-600 last:border-0 last:pb-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.title_en}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/100?text=Product';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {item.product.title_en}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Shipping</span>
                      <span>
                        {shippingMethod === 'standard' && '$10.00'}
                        {shippingMethod === 'express' && '$25.00'}
                        {shippingMethod === 'nextday' && '$50.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Tax (10%)</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                        <span>Discount</span>
                        <span>-${getDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t-2 border-orange-300 dark:border-orange-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-3xl font-bold text-orange-500">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-5 h-5 rounded border-2 border-blue-500 text-blue-500 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-blue-800 dark:text-blue-300">
                    I agree to the{' '}
                    <a href="#" className="underline font-semibold hover:text-blue-600">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="underline font-semibold hover:text-blue-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            {/* Back Button */}
            <button
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  navigate('/cart');
                }
              }}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {currentStep === 1 ? 'Back to Cart' : 'Previous'}
            </button>

            {/* Next/Complete Button */}
            <button
              onClick={() => {
                if (currentStep === 1) {
                  // Validate shipping form
                  if (validateShippingForm()) {
                    setCurrentStep(currentStep + 1);
                  }
                } else if (currentStep === 4) {
                  // Place Order
                  const termsCheckbox = document.getElementById('terms') as HTMLInputElement;
                  if (!termsCheckbox?.checked) {
                    alert('Please accept the Terms & Conditions');
                    return;
                  }

                  setIsPlacingOrder(true);

                  (async () => {
                    try {
                      // Calculate shipping cost based on method
                      let shippingCost = 0;
                      if (shippingMethod === 'standard') shippingCost = 10;
                      else if (shippingMethod === 'express') shippingCost = 25;
                      else if (shippingMethod === 'nextday') shippingCost = 50;

                      // Prepare order data
                      const orderData = {
                        full_name: shippingData.fullName,
                        email: shippingData.email,
                        phone: shippingData.phone,
                        address: shippingData.address,
                        city: shippingData.city,
                        state: shippingData.state,
                        zip_code: shippingData.zipCode,
                        country: shippingData.country,
                        shipping_method: shippingMethod,
                        payment_method: paymentMethod,
                        subtotal: getSubtotal(),
                        shipping_cost: shippingCost,
                        tax: getTax(),
                        discount: getDiscount(),
                        total: getSubtotal() + shippingCost + getTax() - getDiscount(),
                        items: cartItems.map(item => ({
                          product_id: item.product.id,
                          quantity: item.quantity,
                          price_at_time: item.product.price
                        }))
                      };

                      // Create order via API
                      const order = await createOrder(orderData);

                      // Clear cart
                      clearCart();

                      // Navigate to confirmation page
                      navigate(`/order-confirmation/${order.id}`);

                    } catch (error: any) {
                      console.error('Order error:', error);
                      alert('Failed to place order. Please try again.');
                    } finally {
                      setIsPlacingOrder(false);
                    }
                  })();
                } else if (currentStep < 4) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={isPlacingOrder}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : (
                currentStep === 4 ? 'Place Order' : 'Continue'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
