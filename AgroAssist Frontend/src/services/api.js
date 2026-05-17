import { Platform } from 'react-native'
import { API } from '../constants/api'

const getToken = async () => {
  if (Platform.OS === 'web') return localStorage.getItem('access_token')
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  return AsyncStorage.getItem('access_token')
}

const authHeaders = async () => {
  const token = await getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const sendOTP = async (phone) => {
  const res = await fetch(API.SEND_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  })
  return res.json()
}

export const verifyOTP = async (phone, otp) => {
  const res = await fetch(API.VERIFY_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  })
  return res.json()
}

export const completeProfile = async (data) => {
  const headers = await authHeaders()
  const res = await fetch(API.COMPLETE_PROFILE, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getMe = async () => {
  const headers = await authHeaders()
  const res = await fetch(API.ME, { headers })
  return res.json()
}

export const predictDisease = async (imageUri, plantName, userQuery, language) => {
  const token = await getToken()
  const formData = new FormData()
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'crop.jpg',
  })
  formData.append('plant_name', plantName)
  formData.append('user_query', userQuery || 'Analyze this crop image')
  formData.append('language', language || 'english')

  const res = await fetch(API.PREDICT, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })
  return res.json()
}

export const sendChatMessage = async (message, plantName, language, sessionId) => {
  const headers = await authHeaders()
  const res = await fetch(API.CHAT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      plant_name: plantName || null,
      language: language || 'english',
      session_id: sessionId || null,
    }),
  })
  return res.json()
}

export const getChatMemory = async () => {
  const headers = await authHeaders()
  const res = await fetch(API.CHAT_MEMORY, { headers })
  return res.json()
}

export const clearChatMemory = async () => {
  const headers = await authHeaders()
  const res = await fetch(API.CHAT_MEMORY, { method: 'DELETE', headers })
  return res.json()
}