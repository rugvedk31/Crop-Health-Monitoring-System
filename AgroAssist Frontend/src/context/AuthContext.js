import React, { createContext, useContext, useState, useEffect } from 'react'
import { Platform } from 'react-native'

const AuthContext = createContext(null)

const storage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.getItem(key)
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    return AsyncStorage.getItem(key)
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') return localStorage.setItem(key, value)
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    return AsyncStorage.setItem(key, value)
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.removeItem(key)
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    return AsyncStorage.removeItem(key)
  },
}

export function AuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getItem('access_token')
      if (storedToken) {
        setToken(storedToken)
        try {
          const { getMe } = require('../services/api')
          const data = await getMe()
          if (data?.id) {
            setFarmer(data)
          } else {
            await logout()
          }
        } catch (e) {
          await logout()
        }
      }
    } catch (e) {
      console.log('Auth load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const login = async (accessToken, refreshToken, farmerData) => {
    await storage.setItem('access_token', accessToken)
    await storage.setItem('refresh_token', refreshToken)
    setToken(accessToken)
    setFarmer(farmerData)
  }

  const logout = async () => {
    await storage.removeItem('access_token')
    await storage.removeItem('refresh_token')
    setToken(null)
    setFarmer(null)
  }

  const updateFarmer = (data) => setFarmer(prev => ({ ...prev, ...data }))

  return (
    <AuthContext.Provider value={{ farmer, token, loading, login, logout, updateFarmer }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)