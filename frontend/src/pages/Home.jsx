import React, { useState, useRef, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import axios from 'axios'

function Home() {
  const { user, logout } = useUser()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Hello ${user?.name || 'there'}! I'm ${user?.assistantName || 'your AI assistant'}. How can I help you today?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // API instance with credentials
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true
  })

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message to AI assistant
  const sendMessageToAI = async (userMessage) => {
    setIsTyping(true)
    
    try {
      const response = await api.post('/api/users/send-message', {
        message: userMessage
      })

      if (response.data.success) {
        const aiMessage = {
          id: Date.now(),
          type: 'assistant',
          content: response.data.response,
          timestamp: new Date(response.data.timestamp)
        }
        
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback response if API fails
      const fallbackMessage = {
        id: Date.now(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your message right now. Please try again later.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now() - 1,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Send to AI assistant
    await sendMessageToAI(userMessage.content)
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Assistant Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                {user?.assistantImage ? (
                  <img
                    src={user.assistantImage}
                    alt={user.assistantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {user?.assistantName || 'AI Assistant'}
                </h1>
                <p className="text-sm text-gray-500">
                  {user?.assistantDescription || 'Your personal AI assistant'}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/customize'}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Customize
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-purple-600' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.type === 'user' ? (
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) : (
                    user?.assistantImage ? (
                      <img
                        src={user.assistantImage}
                        alt={user.assistantName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    )
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`relative px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${user?.assistantName || 'AI Assistant'}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-12"
                disabled={isTyping}
              />
              {inputMessage && (
                <button
                  type="button"
                  onClick={() => setInputMessage('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
