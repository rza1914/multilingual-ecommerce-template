import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">{t('auth.registerPageTitle')}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {t('auth.createAccount')}
      </p>
    </div>
  );
};

export default RegisterPage;
