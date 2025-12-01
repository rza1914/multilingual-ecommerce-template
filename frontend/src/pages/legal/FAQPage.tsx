import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, CreditCard, Package, Shield, Truck } from 'lucide-react';
import { useState } from 'react';

const FAQPage = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      id: 'general',
      title: t('faq.general', 'General'),
      icon: HelpCircle,
      questions: [
        {
          question: t('faq.q1', 'How do I create an account?'),
          answer: t('faq.a1', 'You can create an account by clicking the "Register" button in the header. Fill in your details and follow the instructions to complete the registration process.')
        },
        {
          question: t('faq.q2', 'What is your return policy?'),
          answer: t('faq.a2', 'We offer returns within 30 days of delivery. Items must be in new, unused condition with all original packaging. Please visit our Returns page for more information.')
        },
        {
          question: t('faq.q3', 'Do you offer international shipping?'),
          answer: t('faq.a3', 'Yes, we ship to select international destinations. Please check availability and shipping costs during the checkout process.')
        }
      ]
    },
    {
      id: 'payment',
      title: t('faq.payment', 'Payment'),
      icon: CreditCard,
      questions: [
        {
          question: t('faq.q4', 'What payment methods do you accept?'),
          answer: t('faq.a4', 'We accept all major credit cards, PayPal, and other secure payment methods. All transactions are protected with SSL encryption.')
        },
        {
          question: t('faq.q5', 'Is my payment information secure?'),
          answer: t('faq.a5', 'Yes, we use industry-standard SSL encryption to protect your payment information. We do not store your credit card details on our servers.')
        },
        {
          question: t('faq.q6', 'When will my order be processed?'),
          answer: t('faq.a6', 'Orders are typically processed within 1-2 business days. You will receive email notifications when your order ships with tracking information.')
        }
      ]
    },
    {
      id: 'shipping',
      title: t('faq.shipping', 'Shipping'),
      icon: Truck,
      questions: [
        {
          question: t('faq.q7', 'How long does shipping take?'),
          answer: t('faq.a7', 'Standard shipping takes 5-7 business days. Expedited options are available for faster delivery. International shipping times vary by destination.')
        },
        {
          question: t('faq.q8', 'Do you offer tracking for orders?'),
          answer: t('faq.a8', 'Yes, all orders include tracking information. You will receive an email with tracking details once your order ships.')
        },
        {
          question: t('faq.q9', 'What shipping carriers do you use?'),
          answer: t('faq.a9', 'We use reliable shipping carriers such as UPS, FedEx, and USPS. The specific carrier depends on your location and shipping method selected.')
        }
      ]
    },
    {
      id: 'products',
      title: t('faq.products', 'Products'),
      icon: Package,
      questions: [
        {
          question: t('faq.q10', 'How do I know if a product is in stock?'),
          answer: t('faq.a10', 'Product availability is displayed on each product page. If a product is out of stock, it will be clearly marked, and you can sign up for a restock notification.')
        },
        {
          question: t('faq.q11', 'Are your products quality tested?'),
          answer: t('faq.a11', 'Yes, all our products undergo rigorous quality testing before shipping. We work with trusted suppliers and manufacturers to ensure quality standards.')
        },
        {
          question: t('faq.q12', 'Do you offer product warranties?'),
          answer: t('faq.a12', 'Many of our products come with manufacturer warranties. Warranty information is provided in the product description and packaging.')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('faq.title', 'Frequently Asked Questions')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('faq.subtitle', 'Find answers to common questions about our products, shipping, and policies')}
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {faqCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 flex items-center gap-3">
                  <IconComponent className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="p-6">
                      <button
                        className="flex justify-between items-center w-full text-left"
                        onClick={() => toggleFaq(index + category.questions.length * faqCategories.indexOf(category))}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <span className="ml-4">
                          {openIndex === index + category.questions.length * faqCategories.indexOf(category) ? '−' : '+'}
                        </span>
                      </button>
                      
                      {openIndex === index + category.questions.length * faqCategories.indexOf(category) && (
                        <div className="mt-4 pt-4 text-gray-600 dark:text-gray-400">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('faq.still_have_questions', 'Still have questions?')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t('faq.contact_support', 'Can\'t find the answer you\'re looking for? Please chat to our friendly team for more assistance.')}
            </p>
            <Link 
              to="/help" 
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              {t('buttons.contactSupport', 'Contact Support')}
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
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
};

export default FAQPage;