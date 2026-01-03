/**
 * i18n Debug Page - Test all languages at runtime
 * Access via: /i18n-debug
 */

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export default function I18nDebug() {
  const { t, i18n } = useTranslation();

  const testKeys = [
    'common.storeName',
    'nav.home',
    'nav.products',
    'footer.blog',
    'auth.login.title',
    'checkout.title'
  ];

  const switchLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    console.log('Language changed to:', lang);
    console.log('Current language:', i18n.language);
    console.log('Loaded languages:', i18n.languages);
  };

  const runDiagnostic = () => {
    console.log('=== i18n DIAGNOSTIC ===' );
    console.log('Current language:', i18n.language);
    console.log('Loaded languages:', i18n.languages);
    console.log('Available resources:', Object.keys(i18next.store?.data || {}));
    
    // Test Arabic specifically
    const arResource = i18next.store?.data?.ar;
    console.log('Arabic resource exists:', !!arResource);
    console.log('Arabic resource keys:', arResource ? Object.keys(arResource) : 'N/A');
    
    if (arResource?.translation) {
      console.log('Arabic translation keys:', Object.keys(arResource.translation).slice(0, 10));
    }
    
    // Test getting Arabic translation directly
    const arT = i18next.getFixedT('ar');
    console.log('Arabic t(common.storeName):', arT('common.storeName'));
    console.log('Arabic t(nav.home):', arT('nav.home'));
  };

  return (
    <div style={{ padding: '20px', direction: i18n.language === 'ar' || i18n.language === 'fa' ? 'rtl' : 'ltr' }}>
      <h1>i18n Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h2>Current State:</h2>
        <p><strong>Current Language:</strong> {i18n.language}</p>
        <p><strong>Loaded Languages:</strong> {i18n.languages?.join(', ')}</p>
        <p><strong>Direction:</strong> {document.dir}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Switch Language:</h2>
        <button onClick={() => switchLanguage('en')} style={{ marginRight: '10px', padding: '10px 20px' }}>
          English
        </button>
        <button onClick={() => switchLanguage('fa')} style={{ marginRight: '10px', padding: '10px 20px' }}>
          فارسی
        </button>
        <button onClick={() => switchLanguage('ar')} style={{ marginRight: '10px', padding: '10px 20px' }}>
          العربية
        </button>
        <button onClick={runDiagnostic} style={{ marginLeft: '20px', padding: '10px 20px', background: '#007bff', color: 'white' }}>
          Run Diagnostic (Console)
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Translation Tests:</h2>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Key</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {testKeys.map(key => (
              <tr key={key}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{key}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t(key)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Direct Language Test:</h2>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Key</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>English</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>فارسی</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>العربية</th>
            </tr>
          </thead>
          <tbody>
            {testKeys.map(key => (
              <tr key={key}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{key}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{i18next.getFixedT('en')(key)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{i18next.getFixedT('fa')(key)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{i18next.getFixedT('ar')(key)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}