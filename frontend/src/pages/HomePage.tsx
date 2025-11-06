import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product.types';
import * as productService from '../services/product.service';
import ProductCard from '../components/products/ProductCard';
import { ProductSkeletonGrid } from '../components/products/ProductSkeleton';
import { ArrowRight, Truck, Shield, Sparkles, Zap, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await productService.getFeaturedProducts(6);
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="animate-fade-in -mt-8">
      {/* Hero Section with Mesh Background */}
      <section className="relative overflow-hidden rounded-3xl mb-20">
        {/* Animated Background with Orange Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="absolute inset-0 bg-mesh-orange opacity-60" />
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative glass-panel p-16 md:p-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge-glass px-4 py-2 mb-8 animate-scale-in">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>{t('home.badge')}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-display text-gradient-orange mb-6 animate-slide-up font-extrabold tracking-tight">
            {t('home.heroTitle')}
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light">
            {t('home.heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              {t('home.exploreCollection')} <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              to="/about"
              className="btn-glass inline-flex items-center gap-2 text-lg"
            >
              {t('home.learnMore')}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            {[
              { number: '10K+', label: t('home.happyCustomers') },
              { number: '500+', label: t('home.premiumProducts') },
              { number: '4.9', label: t('home.averageRating') },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-gradient-orange mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: Truck, title: t('home.freeShipping'), desc: t('home.freeShippingDesc'), color: 'orange' },
          { icon: Shield, title: t('home.securePayment'), desc: t('home.securePaymentDesc'), color: 'orange' },
          { icon: Award, title: t('home.premiumQuality'), desc: t('home.premiumQualityDesc'), color: 'orange' },
        ].map((feature, index) => (
          <div
            key={index}
            className="glass-card p-8 text-center group animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative inline-block mb-6">
              <div className="glass-orange p-6 rounded-3xl glow-orange">
                <feature.icon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Featured Products Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-hero text-gradient-orange mb-3">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('home.featuredProductsSubtitle')}
            </p>
          </div>
          <Link
            to="/products"
            className="btn-glass inline-flex items-center gap-2"
          >
            {t('home.viewAll')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <ProductSkeletonGrid count={6} />
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('home.noFeaturedProducts')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-orange opacity-90" />
        <div className="absolute inset-0 bg-mesh-orange opacity-30" />

        <div className="relative glass-panel p-16 text-center text-white">
          <Zap className="w-20 h-20 mx-auto mb-6 animate-bounce-slow" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('home.ctaSubtitle')}
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:scale-105 transition-transform shadow-2xl"
          >
            {t('home.ctaButton')} <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
