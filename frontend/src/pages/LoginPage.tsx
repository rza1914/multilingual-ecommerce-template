import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">{t('auth.loginPageTitle')}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {t('auth.signInToAccount')}
      </p>
    </div>
  );
};

export default LoginPage;
