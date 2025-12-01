import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Calendar } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('privacy.title', 'Privacy Policy')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('privacy.subtitle', 'Last updated: December 1, 2025')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                {t('privacy.intro_title', 'Introduction')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('privacy.intro', 'We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-orange-500" />
                {t('privacy.information_title', 'Information We Collect')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.information', 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:')}
              </p>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 pl-6">
                <li>• {t('privacy.information1', 'Personal identification information (name, email address, phone number, etc.)')}</li>
                <li>• {t('privacy.information2', 'Payment information (credit card details, billing address, etc.)')}</li>
                <li>• {t('privacy.information3', 'Purchase history and preferences')}</li>
                <li>• {t('privacy.information4', 'Technical information (IP address, browser type, device information, etc.)')}</li>
                <li>• {t('privacy.information5', 'Usage data (pages visited, time spent on site, etc.)')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-orange-500" />
                {t('privacy.how_title', 'How We Use Your Information')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.how', 'We use the information we collect for various purposes, including:')}
              </p>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 pl-6">
                <li>• {t('privacy.how1', 'To process and fulfill your orders')}</li>
                <li>• {t('privacy.how2', 'To provide customer support and respond to your requests')}</li>
                <li>• {t('privacy.how3', 'To send you marketing communications (with your consent)')}</li>
                <li>• {t('privacy.how4', 'To improve our website and services')}</li>
                <li>• {t('privacy.how5', 'To personalize your experience')}</li>
                <li>• {t('privacy.how6', 'To comply with legal obligations')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                {t('privacy.protection_title', 'Information Protection')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('privacy.protection', 'We use administrative, technical, and physical security measures to help protect your personal information. While we use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                {t('privacy.retention_title', 'Information Retention')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('privacy.retention', 'We retain your personal information for as long as necessary to provide our services and comply with our legal obligations. When we no longer need your information, we will securely delete it.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.changes_title', 'Changes to This Policy')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('privacy.changes', 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.contact_title', 'Contact Us')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('privacy.contact', 'If you have questions about this Privacy Policy, please contact us at:')}
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

export default PrivacyPolicyPage;