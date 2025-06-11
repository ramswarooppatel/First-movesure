import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth data
    const checkAuthState = async () => {
      try {
        const storedToken = localStorage.getItem('movesure_token')
        const storedUser = localStorage.getItem('movesure_user')
        
        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setToken(storedToken)
            setUser(userData)
            
            // Optionally verify token validity here
            // await verifyToken(storedToken)
            
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
            logout()
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const login = (authData) => {
    setUser(authData.user)
    setToken(authData.token)
    
    localStorage.setItem('movesure_token', authData.token)
    localStorage.setItem('movesure_refresh_token', authData.refreshToken)
    localStorage.setItem('movesure_session', authData.sessionToken)
    localStorage.setItem('movesure_user', JSON.stringify(authData.user))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    
    localStorage.removeItem('movesure_token')
    localStorage.removeItem('movesure_refresh_token')
    localStorage.removeItem('movesure_session')
    localStorage.removeItem('movesure_user')
    
    // Only redirect if router is available and not on login page
    if (router && router.pathname !== '/login') {
      router.push('/login')
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}