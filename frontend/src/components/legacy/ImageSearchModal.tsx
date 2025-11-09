import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { getFullApiUrl } from '../../config/api';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  discount?: number;
  stock: number;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  category?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
  similarity_score: number;
}

interface ImageSearchResult {
  results: Product[];
  extracted_attributes: Record<string, any>;
  total_results: number;
}

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<ImageSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update internal state when props change
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setImage(null);
      setResults(null);
      setError(null);
    }
  }, [isOpen]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('لطفاً یک فایل تصویر معتبر انتخاب کنید');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const base64Data = imageData.split(',')[1]; // Remove data:image prefix
        setImage(base64Data);
        performSearch(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const base64Data = imageData.split(',')[1]; // Remove data:image prefix
        setImage(base64Data);
        performSearch(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const performSearch = async (base64Image: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getFullApiUrl('/products/search-by-image'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ImageSearchResult = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error in image search:', err);
      setError('خطا در جستجوی تصویر. لطفاً دوباره امتحان کنید.');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    // On mobile, this will open the camera
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment'; // Use rear camera on mobile
      fileInputRef.current.click();
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const closeModal = () => {
    setImage(null);
    setResults(null);
    setError(null);
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">جستجوی محصول با تصویر</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-2">تصویر محصول مورد نظر خود را آپلود کنید تا محصولات مشابه پیدا شوند</p>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {!image ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={triggerFileInput}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">تصویر خود را بکشید و رها کنید</p>
                    <p className="text-gray-500 mb-4">یا کلیک کنید تا فایل را انتخاب کنید</p>
                    <p className="text-sm text-gray-400">پشتیبانی از فرمت‌های JPG، PNG، و WEBP</p>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileInput();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        انتخاب فایل
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCamera();
                        }}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                      >
                        دوربین
                      </button>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">تصویر آپلود شده:</h3>
                    <div className="flex justify-center">
                      <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt="Uploaded product"
                        className="max-h-64 rounded-lg object-contain border"
                      />
                    </div>
                  </div>

                  {loading && (
                    <div className="flex flex-col items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600">در حال تحلیل تصویر و جستجوی محصولات مشابه...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  {results && !loading && (
                    <div>
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                          {results.total_results} محصول مشابه پیدا شد بر اساس ویژگی‌های استخراج شده از تصویر شما
                        </p>
                      </div>

                      {results.results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.results.map((product) => (
                            <div
                              key={product.id}
                              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.title}
                                  className="w-full h-40 object-contain p-2 bg-gray-50"
                                />
                              ) : (
                                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                </div>
                              )}
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-lg font-bold text-blue-600">
                                    {formatPrice(product.price)} تومان
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    شباهت: {(product.similarity_score * 100).toFixed(0)}%
                                  </span>
                                </div>
                                {product.rating && (
                                  <div className="mt-1 flex items-center">
                                    <span className="text-yellow-500">⭐ {product.rating.toFixed(1)}</span>
                                  </div>
                                )}
                                <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                                  مشاهده جزئیات
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">متاسفانه هیچ محصول مشابهی پیدا نشد.</p>
                          <button
                            onClick={() => {
                              setImage(null);
                              setResults(null);
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            آپلود تصویر دیگر
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {image && !loading && results && (
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    setImage(null);
                    setResults(null);
                    setError(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  جستجوی مجدد
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSearchModal;