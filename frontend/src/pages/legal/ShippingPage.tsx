import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, Package, MapPin, Clock, DollarSign, Globe } from 'lucide-react';

const ShippingPage = () => {
  const { t } = useTranslation();

  const shippingOptions = [
    {
      id: 1,
      title: t('shipping.standard', 'Standard Shipping'),
      description: t('shipping.standard_desc', '5-7 business days'),
      price: t('shipping.free', 'FREE'),
      details: t('shipping.standard_details', 'Free shipping on orders over $50. Delivery within 5-7 business days.')
    },
    {
      id: 2,
      title: t('shipping.expedited', 'Expedited Shipping'),
      description: t('shipping.expedited_desc', '2-3 business days'),
      price: '$9.99',
      details: t('shipping.expedited_details', 'Faster delivery within 2-3 business days. Tracking included.')
    },
    {
      id: 3,
      title: t('shipping.priority', 'Priority Shipping'),
      description: t('shipping.priority_desc', '1-2 business days'),
      price: '$19.99',
      details: t('shipping.priority_details', 'Next-day and 2nd-day delivery options available.')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('shipping.title', 'Shipping Information')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('shipping.subtitle', 'Learn about our shipping options and policies')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('shipping.options', 'Shipping Options')}
          </h2>
          
          <div className="space-y-6">
            {shippingOptions.map((option) => (
              <div key={option.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Truck className="w-5 h-5 text-orange-500" />
                      {option.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {option.details}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-500">
                      {option.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              {t('shipping.domestic', 'Domestic Shipping')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {t('shipping.domestic_text', 'We offer shipping to all locations within the United States. Standard shipping is free on orders over $50.')}
            </p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('shipping.domestic_detail1', 'Delivery within 5-7 business days')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('shipping.domestic_detail2', 'Tracking information provided')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('shipping.domestic_detail3', 'Delivery confirmation upon arrival')}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-500" />
              {t('shipping.international', 'International Shipping')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {t('shipping.international_text', 'We ship to select international destinations. Please check availability at checkout.')}
            </p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('shipping.international_detail1', 'Shipping costs calculated at checkout')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('shipping.international_detail2', 'Delivery times vary by destination')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('shipping.international_detail3', 'Customs fees may apply')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-500" />
            {t('shipping.delivery_info', 'Delivery Information')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {t('shipping.delivery_text1', 'Most orders are processed within 1-2 business days. Delivery times are estimates and may vary during holidays or special promotions.')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t('shipping.delivery_text2', 'You will receive email notifications when your order ships with tracking information.')}
          </p>
        </div>

        <div className="text-center">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            {t('buttons.backToHome', 'Back to Home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;