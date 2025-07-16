import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import { useContext } from 'react'

function App() {
  const { userData, setUserData } = useContext(UserContext)
  return (
    <UserProvider>
      <div>
        <Routes>
          <Route path="/" element={(userData?.assistantImage && userData?.assistantname) ? <Home /> : <Navigate to="/customize"  />} />
          <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/customize" element={!userData ? <Customize /> : <Navigate to="/signin" />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App