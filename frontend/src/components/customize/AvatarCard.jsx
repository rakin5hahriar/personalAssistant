import React from 'react'
import { useUser } from '../../context/UserContext'

function AvatarCard({ 
  imagePreview, 
  assistantName, 
  assistantImages, 
  selectedImage, 
  onImageSelect, 
  onImageUpload 
}) {
  const { uploadImage } = useUser()
  
  // Handle custom image upload to backend
  const handleCustomUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      onImageUpload(imageUrl) // Update parent component state
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Assistant Avatar</h3>
      
      {/* Current Avatar Preview */}
      <div className="text-center mb-6">
        <div className="inline-block relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4 border-4 border-purple-100">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Assistant Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <h4 className="text-lg font-medium text-gray-900">
            {assistantName || 'Your Assistant'}
          </h4>
        </div>
      </div>

      {/* Predefined Images Gallery */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Choose from gallery:</h5>
        <div className="grid grid-cols-5 gap-3">
          {assistantImages.map((imagePath, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(imagePath)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedImage === imagePath
                  ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <img
                src={imagePath}
                alt={`Avatar option ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/src/assets/react.svg' // Fallback image
                }}
              />
              {selectedImage === imagePath && (
                <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Image Upload */}
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-3">Or upload your own:</h5>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleCustomUpload}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default AvatarCard
