import React from 'react'

function ThemeCard({ themeData, onThemeChange, onSave, loading }) {
  const themes = [
    { id: 'light', name: 'Light', color: '#f8fafc', accent: '#8b5cf6' },
    { id: 'dark', name: 'Dark', color: '#1e293b', accent: '#a855f7' },
    { id: 'blue', name: 'Ocean', color: '#1e40af', accent: '#3b82f6' },
    { id: 'green', name: 'Forest', color: '#166534', accent: '#22c55e' },
    { id: 'purple', name: 'Royal', color: '#7c3aed', accent: '#a855f7' },
    { id: 'pink', name: 'Sunset', color: '#ec4899', accent: '#f472b6' },
  ]

  const personalities = [
    { id: 'helpful', name: 'Helpful', description: 'Friendly and supportive' },
    { id: 'professional', name: 'Professional', description: 'Formal and efficient' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'witty', name: 'Witty', description: 'Clever and humorous' },
    { id: 'empathetic', name: 'Empathetic', description: 'Understanding and caring' },
    { id: 'direct', name: 'Direct', description: 'Straight to the point' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Theme & Personality</h3>
      
      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Choose Theme
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => onThemeChange('theme', theme.id)}
                className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all ${
                  themeData.theme === theme.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-900">{theme.name}</h4>
                </div>
                {themeData.theme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Personality Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Assistant Personality
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {personalities.map((personality) => (
              <div
                key={personality.id}
                onClick={() => onThemeChange('personality', personality.id)}
                className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all ${
                  themeData.personality === personality.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{personality.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{personality.description}</p>
                  </div>
                  {themeData.personality === personality.id && (
                    <div className="ml-3">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Length Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Response Length Preference
          </label>
          <div className="flex space-x-4">
            {['short', 'medium', 'detailed'].map((length) => (
              <label key={length} className="flex items-center">
                <input
                  type="radio"
                  name="responseLength"
                  value={length}
                  checked={themeData.responseLength === length}
                  onChange={(e) => onThemeChange('responseLength', e.target.value)}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{length}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemeCard
