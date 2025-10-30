import { Award, Users, Globe, Shield, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  
  const stats = [
    { value: '10K+', label: t('about.happyCustomers') },
    { value: '500+', label: t('about.premiumProducts') },
    { value: '50+', label: t('about.countries') },
    { value: '99.9%', label: t('about.satisfactionRate') },
  ];

  const values = [
    {
      icon: Award,
      title: t('about.qualityFirst'),
      description: t('about.qualityFirstDesc'),
    },
    {
      icon: Users,
      title: t('about.customerFocused'),
      description: t('about.customerFocusedDesc'),
    },
    {
      icon: Globe,
      title: t('about.globalReach'),
      description: t('about.globalReachDesc'),
    },
    {
      icon: Shield,
      title: t('about.secureShopping'),
      description: t('about.secureShoppingDesc'),
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: t('about.founderCEO'),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      name: 'Michael Chen',
      role: t('about.headOfDesign'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Emily Rodriguez',
      role: t('about.customerExperience'),
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    {
      name: 'David Kim',
      role: t('about.techLead'),
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="glass-panel p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl animate-float-delayed" />

          <div className="relative z-10">
            <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-float" />
            <h1 className="text-5xl md:text-6xl font-bold text-gradient-orange mb-6 animate-slide-up">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-gradient-orange mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-4xl font-bold text-gradient-orange mb-6">
              {t('about.ourStory')}
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>{t('about.storyPara1')}</p>
              <p>{t('about.storyPara2')}</p>
              <p>{t('about.storyPara3')}</p>
              <p>{t('about.storyPara4')}</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
              alt="Our store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-orange mb-4">
            {t('about.ourValues')}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {t('about.valuesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-orange w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-orange mb-4">
            {t('about.meetTheTeam')}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {t('about.teamSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="glass-card rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-medium">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="glass-panel p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-600/10 to-orange-500/10" />
          <div className="relative z-10">
            <Heart className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-4xl font-bold text-gradient-orange mb-4">
              {t('about.joinOurJourney')}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('about.joinSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/products" className="btn-primary">
                {t('about.shopNow')}
              </a>
              <a href="/contact" className="btn-glass">
                {t('about.getInTouch')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
