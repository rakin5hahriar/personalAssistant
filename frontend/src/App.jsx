import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  )
}

export default App