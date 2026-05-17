const LOCAL_IP = '192.168.1.9'

export const BASE_URL = `http://${LOCAL_IP}:8000`

export const API = {
  SEND_OTP: `${BASE_URL}/api/v1/auth/send-otp`,
  VERIFY_OTP: `${BASE_URL}/api/v1/auth/verify-otp`,
  COMPLETE_PROFILE: `${BASE_URL}/api/v1/auth/complete-profile`,
  REFRESH_TOKEN: `${BASE_URL}/api/v1/auth/refresh`,
  ME: `${BASE_URL}/api/v1/auth/me`,
  UPDATE_FARM: `${BASE_URL}/api/v1/auth/me/farm`,
  PREDICT: `${BASE_URL}/api/v1/predictions/analyze`,
  CHAT: `${BASE_URL}/api/v1/chat/message`,
  CHAT_MEMORY: `${BASE_URL}/api/v1/chat/memory`,
}