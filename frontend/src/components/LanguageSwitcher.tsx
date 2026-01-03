import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
];

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-orange p-2.5 rounded-xl hover:scale-110 transition-transform flex items-center gap-2"
        aria-label={t('buttons.changeLanguage')}
      >
        <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-white">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border-2 border-orange-500/30 animate-scale-in overflow-hidden z-50">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  currentLanguage.code === lang.code
                    ? 'bg-gradient-orange text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div
                    className={`text-xs ${
                      currentLanguage.code === lang.code ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {lang.name}
                  </div>
                </div>
                {currentLanguage.code === lang.code && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
