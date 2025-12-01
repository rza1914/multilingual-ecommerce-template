import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Phone, Mail, MessageCircle, Clock, Shield } from 'lucide-react';

const HelpPage = () => {
  const { t } = useTranslation();

  const helpTopics = [
    {
      id: 1,
      title: t('help.order_support', 'Order Support'),
      description: t('help.order_support_desc', 'Track your order, make changes, or get help with your purchase')
    },
    {
      id: 2,
      title: t('help.payment', 'Payment Options'),
      description: t('help.payment_desc', 'Information about payment methods and security')
    },
    {
      id: 3,
      title: t('help.shipping', 'Shipping Information'),
      description: t('help.shipping_desc', 'Delivery times, shipping methods, and tracking')
    },
    {
      id: 4,
      title: t('help.returns', 'Returns & Exchanges'),
      description: t('help.returns_desc', 'Our return policy and how to initiate a return')
    },
    {
      id: 5,
      title: t('help.account', 'Account Management'),
      description: t('help.account_desc', 'Create, update, or manage your account settings')
    },
    {
      id: 6,
      title: t('help.products', 'Product Support'),
      description: t('help.products_desc', 'Questions about products, usage, and maintenance')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('help.title', 'Help Center')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('help.subtitle', 'Find answers to your questions and get support')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {helpTopics.map((topic) => (
            <div key={topic.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {topic.description}
              </p>
              <button className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium text-sm">
                {t('buttons.viewDetails', 'View Details')}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('help.contact_us', 'Still need help? Contact us')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4">
                <Phone className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('help.phone', 'Phone Support')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                +1 (555) 123-4567
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('help.hours', 'Mon-Fri, 9AM-5PM EST')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4">
                <Mail className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('help.email', 'Email Support')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                support@example.com
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('help.response_time', 'Response within 24 hours')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4">
                <MessageCircle className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('help.chat', 'Live Chat')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('help.chat_desc', 'Chat with our support team')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('help.available', 'Available now')}
              </p>
            </div>
          </div>
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

export default HelpPage;