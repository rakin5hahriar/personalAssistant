import React from 'react'

function ProfileCard({ profileData, onInputChange, onSave, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
      
      <div className="space-y-6">
        {/* Profile Form */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assistant Name
            </label>
            <input
              type="text"
              name="assistantName"
              value={profileData.assistantName}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Name your assistant"
            />
          </div>
        </div>

        {/* Bio/Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assistant Description
          </label>
          <textarea
            name="assistantDescription"
            value={profileData.assistantDescription || ''}
            onChange={onInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="Describe your assistant's personality..."
          />
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
              'Save Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
