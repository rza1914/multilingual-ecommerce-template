import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductFormData
} from '../../services/admin.service';
import {
  Package, Plus, Edit2, Trash2, Search, X, Save
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    discount_price: 0,
    is_active: true,
    is_featured: false,
    category: '',
    image_url: '',
    tags: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, isAdmin]);

  const fetchProducts = async (search?: string) => {
    try {
      setLoading(true);
      const data = await getAdminProducts(0, 100, search);
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: 0,
      discount_price: 0,
      is_active: true,
      is_featured: false,
      category: '',
      image_url: '',
      tags: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price || 0,
      is_active: product.is_active,
      is_featured: product.is_featured,
      category: product.category,
      image_url: product.image_url,
      tags: product.tags || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      setShowModal(false);
      fetchProducts(searchTerm);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(t('admin.saveProductError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(t('admin.deleteProductConfirm', { title: product.title }))) {
      return;
    }

    try {
      await deleteProduct(product.id);
      fetchProducts(searchTerm);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert(t('admin.deleteProductError'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('admin.loadingProducts')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('admin.productManagement')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('admin.productManagementDesc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 transition-all"
            >
              <Plus className="w-5 h-5" />
              {t('admin.addProduct')}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('admin.searchProductsPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              {t('admin.searchButton')}
            </button>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  fetchProducts();
                }}
                className="px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t('admin.clearButton')}
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('admin.noProductsFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? t('admin.tryDifferentSearch') : t('admin.addFirstProduct')}
            </p>
            {!searchTerm && (
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                {t('admin.addProduct')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500/50 transition-all"
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Product';
                  }}
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-500">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {product.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm z-[60]"
            onClick={() => !saving && setShowModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-2 border-gray-200 dark:border-gray-800 my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingProduct ? t('admin.editProduct') : t('admin.createProduct')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('admin.productTitleLabel')}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder={t('admin.productTitlePlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('admin.productDescLabel')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder={t('admin.productDescPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Price & Discount Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.priceLabel')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.discountPriceLabel')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discount_price || ''}
                      onChange={(e) => setFormData({ ...formData, discount_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.categoryLabel')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">{t('admin.selectCategory')}</option>
                      <option value="Electronics">{t('admin.categoryElectronics')}</option>
                      <option value="Clothing">{t('admin.categoryClothing')}</option>
                      <option value="Books">{t('admin.categoryBooks')}</option>
                      <option value="Home">{t('admin.categoryHome')}</option>
                      <option value="Sports">{t('admin.categorySports')}</option>
                      <option value="Toys">{t('admin.categoryToys')}</option>
                      <option value="Beauty">{t('admin.categoryBeauty')}</option>
                      <option value="Food">{t('admin.categoryFood')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.tagsLabel')}
                    </label>
                    <input
                      type="text"
                      value={formData.tags || ''}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder={t('admin.tagsPlaceholder')}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('admin.imageURLLabel')}
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                    placeholder={t('admin.imageURLPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Status Checkboxes */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {t('admin.activeCheckbox')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {t('admin.featuredCheckbox')}
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('admin.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingProduct ? t('admin.updateButton') : t('admin.createButton')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
