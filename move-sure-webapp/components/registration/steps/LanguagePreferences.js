"use client";
import { useState, useEffect } from 'react';
import { Sun, Moon, RotateCcw, Building } from 'lucide-react';

export default function LanguagePreferences({ data, updateData }) {
  const [preferences, setPreferences] = useState({
    language: data.language || 'en',
    theme: data.theme || 'light'
  });

  useEffect(() => {
    setPreferences({
      language: data.language || 'en',
      theme: data.theme || 'light'
    });
  }, [data]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const themes = [
    { id: 'light', name: 'Light Mode', icon: <Sun className="w-6 h-6" />, desc: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark Mode', icon: <Moon className="w-6 h-6" />, desc: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: <RotateCcw className="w-6 h-6" />, desc: 'Follow system preference' }
  ];

  const handleChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updateData('language', newPreferences.language);
    updateData('theme', newPreferences.theme);
  };

  return (
    <div className="space-y-8">
      {/* Language Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleChange('language', lang.code)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                preferences.language === lang.code
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2 text-gray-700">{lang.flag}</div>
                <div className="text-lg font-semibold text-gray-900">{lang.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleChange('theme', theme.id)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                preferences.theme === theme.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-blue-500 mb-3 flex justify-center">{theme.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{theme.name}</div>
                <div className="text-sm text-gray-600">{theme.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">MOVESURE Dashboard</div>
            <div className="text-sm text-gray-600">
              Language: {languages.find(l => l.code === preferences.language)?.name} • 
              Theme: {themes.find(t => t.id === preferences.theme)?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}