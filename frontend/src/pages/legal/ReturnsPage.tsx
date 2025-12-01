import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Package, FileText, Calendar } from 'lucide-react';

const ReturnsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('returns.title', 'Returns & Exchanges')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('returns.subtitle', 'Learn about our return policy and how to process a return')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('returns.policy', 'Return Policy')}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('returns.timeframe', 'Return Timeframe')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('returns.timeframe_text', 'You have 30 days from the date of delivery to initiate a return for most items. Items must be in new, unused condition with all original packaging.')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('returns.conditions', 'Return Conditions')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('returns.conditions_text', 'Items must be in new, unused condition with all original packaging. Items that are damaged, used, or missing parts cannot be returned.')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-full">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('returns.process', 'Return Process')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('returns.process_text', 'To initiate a return, go to your order history, select the item, and request a return. You will receive a return label via email. Pack the item securely and ship it back using the provided label.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-500" />
              {t('returns.exchange', 'Exchanges')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {t('returns.exchange_text1', 'We offer exchanges for items that are defective or damaged upon arrival.')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {t('returns.exchange_text2', 'To request an exchange, follow the same process as for returns but select "exchange" instead.')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('returns.exchange_text3', 'Replacement items will be shipped once the original item is received.')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              {t('returns.restrictions', 'Return Restrictions')}
            </h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('returns.restriction1', 'Perishable items cannot be returned')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('returns.restriction2', 'Intimate or sanitary goods cannot be returned')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('returns.restriction3', 'Gift cards are non-returnable')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('returns.restriction4', 'Items marked as final sale')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('returns.refund', 'Refund Process')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {t('returns.refund_text1', 'Refunds will be processed to the original payment method. Please allow 5-10 business days for the refund to appear in your account.')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t('returns.refund_text2', 'If you paid with a credit card, the refund will appear on your next statement. For other payment methods, please contact us for details.')}
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

export default ReturnsPage;