import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function TawkToWidget() {
  useEffect(() => {
    if (import.meta.env.DEV || import.meta.env.VITE_DISABLE_TAWK === 'true') {
      console.log('Tawk.to disabled in development');
      return;
    }

    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.debug = false;

      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://embed.tawk.to/${import.meta.env.VITE_TAWK_ID || '670f9e2487439b29abdc1XX'}/default`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      
      const s0 = document.getElementsByTagName('script')[0];
      s0.parentNode?.insertBefore(s1, s0);
    }
  }, []);

  return null;
}