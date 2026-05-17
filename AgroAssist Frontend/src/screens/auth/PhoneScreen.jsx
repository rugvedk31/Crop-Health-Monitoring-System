import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, StatusBar, SafeAreaView
} from 'react-native'
import { COLORS, SIZES, FONTS, RADIUS } from '../../constants/theme'
import Button from '../../components/Button'
import { sendOTP } from '../../services/api'

export default function PhoneScreen({ navigation }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }
    setError('')
    setLoading(true)
    try {
      const formatted = phone.startsWith('+') ? phone : `+91${phone}`
      const res = await sendOTP(formatted)
      if (res.message) {
        navigation.navigate('OTP', { phone: formatted })
      } else {
        Alert.alert('Error', res.detail || 'Failed to send OTP')
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.appName}>AgroAssist</Text>
            <Text style={styles.tagline}>Smart Crop Health Monitoring</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Enter Mobile Number</Text>

            <View style={[styles.phoneRow, focused && styles.phoneRowFocused, error ? styles.phoneRowError : null]}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCodeText}>+91</Text>
                <Text style={styles.chevron}>▾</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                value={phone}
                onChangeText={(t) => { setPhone(t.replace(/[^0-9]/g, '')); setError('') }}
                placeholder="98765 43210"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={styles.phoneInput}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={loading}
              style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendBtnText}>Send OTP  →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Feature Pills */}
          <View style={styles.pillsRow}>
            {[
              { icon: '🌾', text: 'AI Detection' },
              { icon: '🌤', text: 'Weather' },
              { icon: '🌐', text: 'Multilingual' },
            ].map((f, i) => (
              <View key={i} style={styles.pill}>
                <Text style={styles.pillIcon}>{f.icon}</Text>
                <Text style={styles.pillText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

import { TextInput, ActivityIndicator } from 'react-native'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EFF6EE',
  },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2E6B2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A3A1A',
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 13,
    color: '#4A6741',
    marginTop: 4,
    fontWeight: '400',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A6741',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D0E8CC',
    borderRadius: 12,
    backgroundColor: '#F7FBF6',
    marginBottom: 14,
    overflow: 'hidden',
  },
  phoneRowFocused: {
    borderColor: '#2E6B2E',
    backgroundColor: '#fff',
  },
  phoneRowError: {
    borderColor: '#C62828',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
  },
  flag: { fontSize: 18 },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A3A1A',
  },
  chevron: {
    fontSize: 10,
    color: '#4A6741',
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#D0E8CC',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A3A1A',
    fontWeight: '400',
  },
  errorText: {
    fontSize: 11,
    color: '#C62828',
    marginBottom: 10,
    marginTop: -8,
  },
  sendBtn: {
    backgroundColor: '#2E6B2E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Pills
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pillIcon: { fontSize: 14 },
  pillText: {
    fontSize: 12,
    color: '#2E6B2E',
    fontWeight: '500',
  },
})