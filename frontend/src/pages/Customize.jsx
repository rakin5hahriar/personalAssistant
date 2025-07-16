import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import AvatarCard from '../components/customize/AvatarCard'
import ProfileCard from '../components/customize/ProfileCard'
import ThemeCard from '../components/customize/ThemeCard'

function Customize() {
  const { user, updateProfile, updatePreferences, loading } = useUser()
  
  const [profileData, setProfileData] = useState({
    name: '',
    assistantName: '',
    assistantDescription: '',
    assistantImage: ''
  })
  
  const [themeData, setThemeData] = useState({
    theme: 'purple',
    personality: 'helpful',
    responseLength: 'medium'
  })
  
  const [selectedImage, setSelectedImage] = useState('')
  const [customImage, setCustomImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [activeTab, setActiveTab] = useState('avatar')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Predefined assistant images from assets
  const assistantImages = [
    '/src/assets/image1.png',
    '/src/assets/image2.jpg',
    '/src/assets/image4.png',
    '/src/assets/image5.png',
    '/src/assets/image6.jpeg',
    '/src/assets/image7.jpeg',
    '/src/assets/authBg.png'
  ]

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        assistantName: user.assistantName || 'Assistant',
        assistantDescription: user.assistantDescription || '',
        assistantImage: user.assistantImage || ''
      })
      setThemeData({
        theme: user.preferences?.theme || 'purple',
        personality: user.preferences?.personality || 'helpful',
        responseLength: user.preferences?.responseLength || 'medium'
      })
      setSelectedImage(user.assistantImage || '')
      setImagePreview(user.assistantImage || '')
    }
  }, [user])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle preference changes
  const handleThemeChange = (key, value) => {
    setThemeData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle predefined image selection
  const handleImageSelect = (imagePath) => {
    setSelectedImage(imagePath)
    setImagePreview(imagePath)
    setCustomImage(null)
    setProfileData(prev => ({
      ...prev,
      assistantImage: imagePath
    }))
  }

  // Handle custom image upload - now receives the uploaded URL
  const handleImageUpload = (uploadedImageUrl) => {
    setImagePreview(uploadedImageUrl)
    setSelectedImage('')
    setCustomImage(null)
    setProfileData(prev => ({
      ...prev,
      assistantImage: uploadedImageUrl
    }))
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    setError('')
    setSuccess('')
    
    try {
      await updateProfile(profileData)
      setSuccess('Profile updated successfully!')
    } catch (error) {
      setError(error.message)
    }
  }

  // Save preferences
  const handleSaveTheme = async () => {
    setError('')
    setSuccess('')
    
    try {
      await updatePreferences(themeData)
      setSuccess('Theme preferences updated successfully!')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Customize Your Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Personalize your virtual assistant experience
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('avatar')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'avatar'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Avatar Selection
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'theme'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Theme & Personality
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Avatar Selection Tab */}
          {activeTab === 'avatar' && (
            <AvatarCard
              assistantImages={assistantImages}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              customImage={customImage}
              onImageSelect={handleImageSelect}
              onImageUpload={handleImageUpload}
              assistantName={profileData.assistantName}
            />
          )}

          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <ProfileCard
              profileData={profileData}
              onInputChange={handleInputChange}
              onSave={handleSaveProfile}
              loading={loading}
            />
          )}

          {/* Theme & Personality Tab */}
          {activeTab === 'theme' && (
            <ThemeCard
              themeData={themeData}
              onThemeChange={handleThemeChange}
              onSave={handleSaveTheme}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Customize
