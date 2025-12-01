import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.thanks', 'Thank You!')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('contact.confirmation', 'Your message has been sent successfully. We will get back to you soon.')}
            </p>
            <Link 
              to="/" 
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              {t('buttons.backToHome', 'Back to Home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contact.title', 'Contact Us')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('contact.subtitle', 'Have questions? Get in touch with our team')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contact.info', 'Contact Information')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="glass-card p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t('contact.email', 'Email')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.email_address', 'support@luxstore.com')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {t('contact.email_response', 'Response within 24 hours')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="glass-card p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t('contact.phone', 'Phone')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.phone_number', '+1 (555) 123-4567')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {t('contact.phone_hours', 'Mon-Fri, 9AM-5PM EST')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="glass-card p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t('contact.address', 'Address')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.address_text', '123 Luxury Avenue, New York, NY 10001')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {t('contact.business_hours', 'Monday-Friday: 9AM-6PM')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-orange-500" />
                {t('contact.business_hours_title', 'Business Hours')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {t('contact.business_days', 'Monday - Friday: 9:00 AM - 6:00 PM')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('contact.weekend_hours', 'Saturday & Sunday: Closed')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.form_title', 'Send Us a Message')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.name', 'Your Name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('contact.name_placeholder', 'Enter your name')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.email_label', 'Email Address')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('contact.email_placeholder', 'Enter your email address')}
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.subject', 'Subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('contact.subject_placeholder', 'What is this regarding?')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.message_label', 'Message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input-field w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('contact.message_placeholder', 'How can we help you?')}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 px-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                    {t('buttons.sending', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('buttons.sendMessage', 'Send Message')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
          >
            {t('buttons.backToHome', 'Back to Home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;