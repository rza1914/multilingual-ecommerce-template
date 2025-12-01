import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calendar, User, MessageCircle, Heart } from 'lucide-react';

const BlogPage = () => {
  const { t } = useTranslation();

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: t('blog.post1_title', 'Latest Trends in E-commerce'),
      excerpt: t('blog.post1_excerpt', 'Discover the latest trends that are shaping the e-commerce industry in 2024.'),
      date: '2024-01-15',
      author: 'John Doe',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: t('blog.post2_title', 'Tips for Online Shopping Success'),
      excerpt: t('blog.post2_excerpt', 'Learn how to optimize your online shopping experience and find the best deals.'),
      date: '2024-01-10',
      author: 'Jane Smith',
      readTime: '3 min read'
    },
    {
      id: 3,
      title: t('blog.post3_title', 'Sustainable Shopping Guide'),
      excerpt: t('blog.post3_excerpt', 'Explore how you can make more sustainable choices when shopping online.'),
      date: '2024-01-05',
      author: 'Mike Johnson',
      readTime: '4 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('blog.title', 'Our Blog')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('blog.subtitle', 'Latest news, tips, and insights from our team')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.readTime}
                  </span>
                  <button className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium">
                    {t('buttons.readMore', 'Read More')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
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

export default BlogPage;