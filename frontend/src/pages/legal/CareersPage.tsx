import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Briefcase, Users, Globe, Heart } from 'lucide-react';

const CareersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('careers.title', 'Careers')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('careers.subtitle', 'Join our team and grow your career with us')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-orange-500" />
            {t('careers.whyJoinUs', 'Why Join Us?')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t('careers.content', 'We are always looking for talented individuals to join our team. Our company offers a dynamic and collaborative work environment where you can grow your skills and advance your career.')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <Users className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {t('careers.collaborative', 'Collaborative Culture')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('careers.collaborative_desc', 'Work with talented professionals in a supportive environment')}
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <Globe className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {t('careers.growth', 'Growth Opportunities')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('careers.growth_desc', 'Expand your skills with learning and development programs')}
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <Heart className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {t('careers.benefits', 'Great Benefits')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('careers.benefits_desc', 'Comprehensive health, wellness, and work-life balance benefits')}
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

export default CareersPage;