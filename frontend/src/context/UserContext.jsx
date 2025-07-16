import React, { createContext, useState, useContext } from 'react'
import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000', // Your backend URL
  withCredentials: true, // Include cookies for auth
  headers: {
    'Content-Type': 'application/json'
  }
})

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Check if user is authenticated on app load
  const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/check-auth')
      if (response.data.success) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.log('No active session')
      // Clear any stored user data
      localStorage.removeItem('user')
    } finally {
      setInitialLoading(false)
    }
  }

  // Check auth on component mount
  React.useEffect(() => {
    checkAuth()
  }, [])

  const login = async (userData) => {
    setLoading(true)
    try {
      console.log('Attempting login with:', { email: userData.email, password: '***hidden***' })
      
      const response = await api.post('/api/auth/login', {
        email: userData.email,
        password: userData.password
      })
      
      console.log('Login successful:', response.data)
      const user = response.data.user
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.status === 400) {
        throw new Error('Please check your email and password.')
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please try again.')
      } else if (error.response?.status === 404) {
        throw new Error('Account not found. Please check your email or sign up.')
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check your internet connection.')
      } else {
        throw new Error('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    setLoading(true)
    try {
      console.log('Attempting signup with:', { 
        name: userData.name, 
        email: userData.email, 
        password: '***hidden***' 
      })
      
      const response = await api.post('/api/auth/signup', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      })
      
      console.log('Signup successful:', response.data)
      const user = response.data.user
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Signup error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.status === 400) {
        throw new Error('Invalid signup data. Please check your information.')
      } else if (error.response?.status === 409) {
        throw new Error('Email already exists. Please use a different email.')
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running.')
      } else {
        throw new Error('Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.get('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
    }
  }

  // Get current user data
  const getCurrentUser = async () => {
    try {
      const response = await api.get('/api/users/current')
      if (response.data.success) {
        setUser(response.data.user)
        return response.data.user
      }
    } catch (error) {
      console.error('Get current user error:', error)
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true)
    try {
      const response = await api.put('/api/users/profile', profileData)
      if (response.data.success) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data.user
      }
    } catch (error) {
      console.error('Update profile error:', error)
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Update password
  const updatePassword = async (passwordData) => {
    setLoading(true)
    try {
      const response = await api.put('/api/users/password', passwordData)
      if (response.data.success) {
        return response.data
      }
    } catch (error) {
      console.error('Update password error:', error)
      throw new Error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  // Update user preferences
  const updatePreferences = async (preferences) => {
    setLoading(true)
    try {
      const response = await api.put('/api/users/preferences', { preferences })
      if (response.data.success) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data.user
      }
    } catch (error) {
      console.error('Update preferences error:', error)
      throw new Error(error.response?.data?.message || 'Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  // Upload user image
  const uploadImage = async (imageFile) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api.post('/api/users/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data.imageUrl
      }
    } catch (error) {
      console.error('Upload image error:', error)
      throw new Error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  // Get user statistics
  const getUserStats = async () => {
    try {
      const response = await api.get('/api/users/stats')
      if (response.data.success) {
        return response.data.stats
      }
    } catch (error) {
      console.error('Get user stats error:', error)
      throw new Error(error.response?.data?.message || 'Failed to get user statistics')
    }
  }

  // Delete user account
  const deleteAccount = async () => {
    setLoading(true)
    try {
      const response = await api.delete('/api/users/delete-account')
      if (response.data.success) {
        setUser(null)
        localStorage.removeItem('user')
        return response.data
      }
    } catch (error) {
      console.error('Delete account error:', error)
      throw new Error(error.response?.data?.message || 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      signup, 
      logout, 
      loading,
      initialLoading,
      checkAuth,
      getCurrentUser,
      updateProfile,
      updatePassword,
      updatePreferences,
      uploadImage,
      getUserStats,
      deleteAccount
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext