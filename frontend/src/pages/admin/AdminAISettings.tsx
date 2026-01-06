/**
 * Admin AI Settings Page
 * Configure AI chatbot personality, name, and custom prompts
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle,
  User,
  MessageSquare,
  Briefcase,
  Heart,
  Zap,
  BookOpen
} from 'lucide-react';
import { adminService } from '@/services/adminService';

interface AIPersonality {
  id: string;
  name: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  systemPrompt: string;
}

const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'professional',
    name: 'Professional Seller',
    nameKey: 'admin.ai.personalities.professional.name',
    descriptionKey: 'admin.ai.personalities.professional.description',
    icon: <Briefcase className="w-6 h-6" />,
    systemPrompt: 'You are a professional e-commerce assistant. Be formal, helpful, and focused on helping customers find the best products. Provide detailed product information and comparisons when asked.'
  },
  {
    id: 'friendly',
    name: 'Friendly Helper',
    nameKey: 'admin.ai.personalities.friendly.name',
    descriptionKey: 'admin.ai.personalities.friendly.description',
    icon: <Heart className="w-6 h-6" />,
    systemPrompt: 'You are a friendly and warm shopping assistant. Be casual, use emojis occasionally, and make the shopping experience fun and enjoyable. Treat customers like friends.'
  },
  {
    id: 'expert',
    name: 'Expert Advisor',
    nameKey: 'admin.ai.personalities.expert.name',
    descriptionKey: 'admin.ai.personalities.expert.description',
    icon: <BookOpen className="w-6 h-6" />,
    systemPrompt: 'You are an expert product advisor with deep knowledge. Provide technical details, specifications, and expert recommendations. Help customers make informed decisions based on their needs.'
  },
  {
    id: 'concise',
    name: 'Quick & Concise',
    nameKey: 'admin.ai.personalities.concise.name',
    descriptionKey: 'admin.ai.personalities.concise.description',
    icon: <Zap className="w-6 h-6" />,
    systemPrompt: 'You are a quick and efficient assistant. Keep responses short and to the point. No unnecessary details - just the essential information customers need.'
  }
];

interface AISettings {
  botName: string;
  selectedPersonality: string;
  customPrompt: string;
  useCustomPrompt: boolean;
}

const AdminAISettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<AISettings>({
    botName: 'LuxBot',
    selectedPersonality: 'professional',
    customPrompt: '',
    useCustomPrompt: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminService.getAISettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load AI settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await adminService.updateAISettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save AI settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setSettings({
      botName: 'LuxBot',
      selectedPersonality: 'professional',
      customPrompt: '',
      useCustomPrompt: false
    });
  };

  const selectedPersonalityData = AI_PERSONALITIES.find(p => p.id === settings.selectedPersonality);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-orange-500" />
            {t('admin.ai.title', 'AI Settings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.ai.subtitle', 'Configure your AI assistant personality and behavior')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="btn-glass flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t('admin.ai.reset', 'Reset')}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveSuccess ? t('admin.ai.saved', 'Saved!') : t('admin.ai.save', 'Save Changes')}
          </button>
        </div>
      </div>

      {/* Bot Name */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          {t('admin.ai.botName', 'Bot Name')}
        </h2>
        <div className="max-w-md">
          <input
            type="text"
            value={settings.botName}
            onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
            placeholder={t('admin.ai.botNamePlaceholder', 'Enter bot name...')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            maxLength={20}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('admin.ai.botNameHint', 'This name will be shown to users in the chat interface')}
          </p>
        </div>
      </div>

      {/* Personality Selection */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          {t('admin.ai.personality', 'Personality')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AI_PERSONALITIES.map((personality) => (
            <button
              key={personality.id}
              onClick={() => setSettings({ ...settings, selectedPersonality: personality.id, useCustomPrompt: false })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                settings.selectedPersonality === personality.id && !settings.useCustomPrompt
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  settings.selectedPersonality === personality.id && !settings.useCustomPrompt
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {personality.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t(personality.nameKey, personality.name)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t(personality.descriptionKey, 'Personality description')}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            {t('admin.ai.customPrompt', 'Custom Prompt')}
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useCustomPrompt}
              onChange={(e) => setSettings({ ...settings, useCustomPrompt: e.target.checked })}
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('admin.ai.useCustom', 'Use custom prompt')}
            </span>
          </label>
        </div>

        <textarea
          value={settings.useCustomPrompt ? settings.customPrompt : (selectedPersonalityData?.systemPrompt || '')}
          onChange={(e) => setSettings({ ...settings, customPrompt: e.target.value })}
          disabled={!settings.useCustomPrompt}
          placeholder={t('admin.ai.customPromptPlaceholder', 'Enter your custom system prompt here...')}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed resize-none"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {settings.useCustomPrompt
            ? t('admin.ai.customPromptHint', 'This prompt will be used as the AI system instructions')
            : t('admin.ai.presetPromptHint', 'Enable custom prompt to write your own instructions')
          }
        </p>
      </div>

      {/* Preview */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('admin.ai.preview', 'Preview')}
        </h2>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {settings.botName || 'LuxBot'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedPersonalityData ? t(selectedPersonalityData.nameKey, selectedPersonalityData.name) : 'Custom'}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('admin.ai.previewMessage', 'Hello! I\'m here to help you find the perfect products. How can I assist you today?')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAISettings;