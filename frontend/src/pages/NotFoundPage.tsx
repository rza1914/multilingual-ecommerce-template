import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">{t('common.pageNotFound')}</p>
      <Link to="/" className="btn-primary mt-6 inline-block">
        {t('common.backToHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
