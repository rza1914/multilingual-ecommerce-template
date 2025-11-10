import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Define the context type
interface RTLContextType {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  toggleRTL: () => void;
}

// Create the context
const RTLContext = createContext<RTLContextType | undefined>(undefined);

// RTL Provider Component
interface RTLProviderProps {
  children: ReactNode;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Function to determine if a language is RTL
  const getIsRTL = (lng: string): boolean => {
    const rtlLanguages = ['ar', 'fa', 'he', 'ur', 'ps', 'sd', 'ug', 'ku', 'dv', 'ha'];
    return rtlLanguages.includes(lng);
  };

  // Update direction when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newIsRTL = getIsRTL(i18n.language);
      setIsRTL(newIsRTL);

      // Update document direction
      document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;

      // Add or remove RTL class on body
      if (newIsRTL) {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    };

    // Set initial direction
    handleLanguageChange();

    // Subscribe to language changes
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      // Unsubscribe when component unmounts
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const toggleRTL = () => {
    const newIsRTL = !isRTL;
    setIsRTL(newIsRTL);

    // Update document direction
    document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr';

    // Add or remove RTL class on body
    if (newIsRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  const contextValue: RTLContextType = {
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    toggleRTL
  };

  return (
    <RTLContext.Provider value={contextValue}>
      {children}
    </RTLContext.Provider>
  );
};

// Custom hook to use the RTL context
export const useRTL = (): RTLContextType => {
  const context = useContext(RTLContext);
  if (context === undefined) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
};