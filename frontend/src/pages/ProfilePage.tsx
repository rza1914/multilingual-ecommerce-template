import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, changePassword, UserProfile } from '../services/user.service';
import { getUserOrders } from '../services/order.service';
import {
  User, Mail, Phone, Calendar, ShoppingBag, Package,
  Edit2, Save, X, Lock, Eye, EyeOff
} from 'lucide-react';
import { useTranslation } from '../utils/i18n';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit mode states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [userData, ordersData] = await Promise.all([
        getUserProfile(),
        getUserOrders()
      ]);
      setUser(userData);
      setOrders(ordersData);
      setProfileData({
        full_name: userData.full_name || '',
        phone: userData.phone || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      const updatedUser = await updateUserProfile(profileData);
      setUser(updatedUser);
      setIsEditingProfile(false);
      alert(t('profile.profileUpdated'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(t('profile.updateProfileError'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.current_password || !passwordData.new_password) {
      alert(t('profile.fillAllPasswordFields'));
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert(t('profile.passwordMinLength'));
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert(t('profile.passwordsDoNotMatch'));
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setIsChangingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      alert(t('profile.passwordChanged'));
    } catch (error: any) {
      console.error('Failed to change password:', error);
      alert(error.response?.data?.detail || t('profile.changePasswordError'));
    } finally {
      setSavingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">{t('profile.loadingProfile')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('profile.notFound')}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
          >
            {t('profile.goHome')}
          </button>
        </div>
      </div>
    );
  }

  // Calculate order stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800 text-center">
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-xl">
                <User className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user.full_name || t('profile.user')}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user.email}
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{t('profile.joined')} {formatDate(user.created_at)}</span>
              </div>
            </div>

            {/* Order Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t('profile.orderStatistics')}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('profile.totalOrders')}</span>
                  </div>
                  <span className="text-xl font-bold text-orange-500">{totalOrders}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('profile.pending')}</span>
                  </div>
                  <span className="text-xl font-bold text-blue-500">{pendingOrders}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('profile.delivered')}</span>
                  </div>
                  <span className="text-xl font-bold text-green-500">{deliveredOrders}</span>
                </div>

                <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      {t('profile.totalSpent')}
                    </span>
                    <span className="text-2xl font-bold text-orange-500">
                      ${totalSpent.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/orders')}
                className="w-full mt-4 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                {t('profile.viewAllOrders')}
              </button>
            </div>
          </div>

          {/* Right Column - Profile Info & Settings */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-2 border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('profile.personalInfo')}
                </h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors font-semibold"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('profile.edit')}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileData({
                          full_name: user.full_name || '',
                          phone: user.phone || '',
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      {t('profile.cancel')}
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('profile.saving')}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {t('profile.save')}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.fullName')}
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      autoComplete="name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">
                        {user.full_name || t('profile.notSet')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.emailAddress')}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      {t('profile.cannotBeChanged')}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.phoneNumber')}
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder={t('profile.phonePlaceholder')}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">
                        {user.phone || t('profile.notSet')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-2 border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('profile.changePassword')}
                </h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors font-semibold"
                  >
                    <Lock className="w-4 h-4" />
                    {t('profile.change')}
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.currentPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.newPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.confirmNewPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          confirm_password: '',
                        });
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {t('profile.cancel')}
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={savingPassword}
                      className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {savingPassword ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('profile.saving')}
                        </span>
                      ) : (
                        t('profile.updatePassword')
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {t('profile.changePasswordHint')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
