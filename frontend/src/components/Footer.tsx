import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: t('nav.products'), path: '/products' },
      { name: t('product.featured'), path: '/products?featured=true' },
      { name: t('product.newArrival'), path: '/products?new=true' },
      { name: t('product.bestSeller'), path: '/products?bestsellers=true' },
    ],
    company: [
      { name: t('nav.about'), path: '/about' },
      { name: t('nav.contact'), path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
    ],
    support: [
      { name: t('footer.support'), path: '/help' },
      { name: t('footer.shippingInfo'), path: '/shipping' },
      { name: t('footer.returns'), path: '/returns' },
      { name: t('footer.faq'), path: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="glass-orange mt-auto border-t border-orange-500/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-orange-500 group-hover:animate-spin-slow" />
                <div className="absolute inset-0 bg-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold text-gradient-orange">
                LuxStore
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@luxstore.com"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>hello@luxstore.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>123 Luxury Ave, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-orange rounded-full" />
              {t('nav.products')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-orange rounded-full" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-orange rounded-full" />
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1">
              <span>&copy; {currentYear} LuxStore. {t('footer.allRightsReserved')}</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                className="glass-orange p-3 rounded-xl hover:scale-110 transition-all glow-orange group"
              >
                <social.icon className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Extra Links */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/privacy" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('footer.privacyPolicy')}
          </Link>
          <Link to="/terms" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t('footer.termsOfService')}
          </Link>
          <Link to="/cookies" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
