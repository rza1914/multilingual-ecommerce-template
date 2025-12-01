import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cookie, Shield, Settings, Eye } from 'lucide-react';

const CookiePolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('cookies.title', 'Cookie Policy')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('cookies.subtitle', 'Last updated: December 1, 2025')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Cookie className="w-6 h-6 text-orange-500" />
                {t('cookies.what_title', 'What Are Cookies')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('cookies.what', 'Cookies are small text files that are stored on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-orange-500" />
                {t('cookies.how_title', 'How We Use Cookies')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('cookies.how', 'We use cookies for several reasons, including:')}
              </p>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 pl-6">
                <li>• {t('cookies.how1', 'To enable certain functions of our website')}</li>
                <li>• {t('cookies.how2', 'To provide analytics and improve our services')}</li>
                <li>• {t('cookies.how3', 'To personalize your experience')}</li>
                <li>• {t('cookies.how4', 'To serve advertisements')}</li>
                <li>• {t('cookies.how5', 'To remember your preferences')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('cookies.types_title', 'Types of Cookies We Use')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('cookies.necessary_title', 'Necessary Cookies')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('cookies.necessary', 'These cookies are essential for the proper functioning of our website. Without these cookies, certain features would not work properly.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('cookies.performance_title', 'Performance Cookies')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('cookies.performance', 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('cookies.functionality_title', 'Functionality Cookies')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('cookies.functionality', 'These cookies allow our website to remember choices you make and provide enhanced features and personalization.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('cookies.targeting_title', 'Targeting Cookies')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('cookies.targeting', 'These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.')}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-orange-500" />
                {t('cookies.manage_title', 'Managing Cookies')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('cookies.manage', 'You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('cookies.manage2', 'Here is how to manage cookies for the most commonly used browsers:')}
              </p>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 pl-6 mt-2">
                <li>• {t('cookies.chrome', 'Google Chrome: chrome://settings/cookies')}</li>
                <li>• {t('cookies.safari', 'Apple Safari: preferences → privacy')}</li>
                <li>• {t('cookies.firefox', 'Mozilla Firefox: options → privacy & security')}</li>
                <li>• {t('cookies.edge', 'Microsoft Edge: settings → cookies and site permissions')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('cookies.changes_title', 'Changes to This Policy')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('cookies.changes', 'We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('cookies.contact_title', 'Contact Us')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('cookies.contact', 'If you have questions about our Cookie Policy, please contact us at:')}
              </p>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl">
                <p className="text-gray-700 dark:text-gray-300">
                  {t('footer.emailAddress', 'hello@luxstore.com')}
                </p>
              </div>
            </section>
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

export default CookiePolicyPage;