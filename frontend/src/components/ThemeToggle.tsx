import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative glass-orange p-2.5 rounded-xl hover:scale-110 transition-all duration-300 glow-orange group overflow-hidden"
      aria-label={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-orange opacity-0 group-hover:opacity-20 transition-opacity" />

      {/* Icon Container with Rotation Animation */}
      <div className="relative">
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-orange-600 dark:text-orange-400 transform group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <Sun className="w-5 h-5 text-orange-600 dark:text-orange-400 transform group-hover:rotate-90 transition-transform duration-300" />
        )}
      </div>

      {/* Ripple Effect on Click */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 group-active:animate-ripple bg-orange-500/30" />
    </button>
  );
};

export default ThemeToggle;
