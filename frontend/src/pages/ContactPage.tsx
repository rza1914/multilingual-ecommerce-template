import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Toast, { ToastType } from '../components/Toast';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact.emailInvalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.subjectRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.messageMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Mock form submission
      console.log('Contact form submitted:', formData);

      // Show success toast
      setToastMessage(t('contact.messageSent'));
      setToastType('success');
      setShowToast(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      content: t('contact.addressLine1'),
      subcontent: t('contact.addressLine2'),
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      content: t('contact.phoneNumber'),
      subcontent: t('contact.phoneHours'),
    },
    {
      icon: Mail,
      title: t('contact.email'),
      content: t('contact.emailAddress'),
      subcontent: t('contact.emailResponse'),
    },
    {
      icon: Clock,
      title: t('contact.workingHours'),
      content: t('contact.hoursWeekdays'),
      subcontent: t('contact.hoursWeekends'),
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="glass-panel p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl animate-float-delayed" />

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient-orange mb-6 animate-slide-up">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-orange w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                <info.icon className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {info.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {info.content}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {info.subcontent}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-gradient-orange mb-6">
              {t('contact.sendUsMessage')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.yourName')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 glass-orange rounded-2xl border-2 ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-orange-500'
                  } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500`}
                  placeholder={t('contact.namePlaceholder')}
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.emailAddress2')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 glass-orange rounded-2xl border-2 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-orange-500'
                  } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500`}
                  placeholder={t('contact.emailPlaceholder')}
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 glass-orange rounded-2xl border-2 ${
                    errors.subject
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-orange-500'
                  } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500`}
                  placeholder={t('contact.subjectPlaceholder')}
                />
                {errors.subject && <p className="mt-2 text-sm text-red-500">{errors.subject}</p>}
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 glass-orange rounded-2xl border-2 ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-orange-500'
                  } outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 resize-none`}
                  placeholder={t('contact.messagePlaceholder')}
                />
                {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full btn-primary text-lg flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                {t('contact.sendMessage')}
              </button>
            </form>
          </div>

          {/* Map & Social */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="glass-card p-8 rounded-3xl h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('contact.visitOurStore')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('contact.addressLine1')}<br />
                  {t('contact.addressLine2')}
                </p>
                <button className="mt-6 btn-primary">
                  {t('contact.getDirections')}
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-gradient-orange mb-6">
                {t('contact.followUs')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('contact.followUsSubtitle')}
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="glass-orange w-12 h-12 rounded-xl flex items-center justify-center hover:scale-110 transition-transform glow-orange"
                  >
                    <social.icon className="w-5 h-5 text-orange-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ContactPage;
