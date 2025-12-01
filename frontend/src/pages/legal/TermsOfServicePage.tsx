import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Scale, Calendar, Shield } from 'lucide-react';

const TermsOfServicePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('terms.title', 'Terms of Service')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('terms.subtitle', 'Last updated: December 1, 2025')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                {t('terms.intro_title', 'Acceptance of Terms')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('terms.intro', 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-orange-500" />
                {t('terms.use_title', 'Use License')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.use1', 'Permission is granted to temporarily download one copy of the materials on LuxStore\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.use2', 'This license shall automatically terminate if you violate any of these restrictions and may be terminated by LuxStore at any time.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('terms.disclaimer_title', 'Disclaimer')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.disclaimer1', 'The materials on LuxStore\'s website are provided on an \'as is\' basis. LuxStore makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.disclaimer2', 'Further, LuxStore does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                {t('terms.limitations_title', 'Limitations')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.limitations', 'In no event shall LuxStore or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LuxStore\'s website, even if LuxStore or a LuxStore authorized representative has been notified orally or in writing of the possibility of such damage.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('terms.accuracy_title', 'Accuracy of Materials')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.accuracy', 'The materials appearing on LuxStore\'s website could include technical, typographical, or photographic errors. LuxStore does not warrant that any of the materials on its website are accurate, complete, or current. LuxStore may make changes to the materials contained on its website at any time without notice.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('terms.links_title', 'Links')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.links', 'LuxStore has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LuxStore of the site. Use of any such linked website is at the user\'s own risk.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('terms.modifications_title', 'Modifications')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.modifications', 'LuxStore may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('terms.governing_title', 'Governing Law')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.governing', 'These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.')}
              </p>
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

export default TermsOfServicePage;