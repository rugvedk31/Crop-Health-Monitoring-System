import React, { useState, useRef, useEffect } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, StatusBar, Platform, ActivityIndicator
} from 'react-native'
import { verifyOTP, sendOTP } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function OTPScreen({ navigation, route }) {
  const { phone } = route.params
  const { login } = useAuth()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const inputs = useRef([])

  useEffect(() => {
    setTimeout(() => inputs.current[0]?.focus(), 300)
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (text, index) => {
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)
    if (text && index < 5) inputs.current[index + 1]?.focus()
    if (!text && index > 0) inputs.current[index - 1]?.focus()
  }

  const handleVerify = async () => {
    const otpStr = otp.join('')
    if (otpStr.length < 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const res = await verifyOTP(phone, otpStr)
      if (res.access_token) {
        await login(res.access_token, res.refresh_token, { id: res.farmer_id })
        if (res.is_new_farmer) {
          navigation.replace('CompleteProfile', { phone })
        } else {
          navigation.replace('Main')
        }
      } else {
        Alert.alert('Error', res.detail || 'Invalid OTP')
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0) return
    await sendOTP(phone)
    setTimer(30)
    setOtp(['', '', '', '', '', ''])
    inputs.current[0]?.focus()
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />
      <View style={[styles.inner, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>📱</Text>
          </View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Enter OTP</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={ref => inputs.current[i] = ref}
                value={digit}
                onChangeText={text => handleChange(text.slice(-1), i)}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectionColor="#2E6B2E"
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading}
            style={[styles.verifyBtn, loading && styles.verifyBtnDisabled]}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.verifyBtnText}>Verify OTP</Text>
            }
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive OTP? </Text>
            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
              <Text style={[styles.resendTimer, timer === 0 && styles.resendActive]}>
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeBtn}>
          <Text style={styles.changeBtnText}>Change Number</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EFF6EE',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backBtn: {
    marginTop: 12,
    marginBottom: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#1A3A1A',
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCF0DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 36 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A3A1A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A6741',
    marginBottom: 4,
  },
  phone: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E6B2E',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A3A1A',
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3A1A',
    textAlign: 'center',
    maxHeight: 50,
  },
  otpBoxFilled: {
    backgroundColor: '#C8E6C9',
  },
  verifyBtn: {
    backgroundColor: '#3A7D3A',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 14,
  },
  verifyBtnDisabled: { opacity: 0.6 },
  verifyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendLabel: {
    fontSize: 13,
    color: '#4A6741',
  },
  resendTimer: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A6741',
  },
  resendActive: { color: '#2E6B2E' },
  changeBtn: {
    alignItems: 'center',
    marginTop: 20,
  },
  changeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E6B2E',
  },
})