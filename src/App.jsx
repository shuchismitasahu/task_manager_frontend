import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

// Simple state-based routing (no react-router needed)
function AppRoutes() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState('login') // 'login' | 'register'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    )
  }

  // Authenticated — show dashboard
  if (user) {
    return <DashboardPage />
  }

  // Not authenticated — show login or register
  if (page === 'register') {
    return <RegisterPage onGoLogin={() => setPage('login')} />
  }

  return <LoginPage onGoRegister={() => setPage('register')} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
