import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Customize from './pages/Customize.jsx'

function AppRoutes() {
  const { user, initialLoading } = useUser()
  
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/customize" replace /> : <Navigate to="/signin" replace />} />
      <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/customize" replace />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/customize" replace />} />
      <Route path="/customize" element={user ? <Customize /> : <Navigate to="/signin" replace />} />
      {/* Add more routes as needed */}
    </Routes>
  )
}

function App() {
  return (
    <UserProvider>
      <div>
        <AppRoutes />
      </div>
    </UserProvider>
  )
}

export default App