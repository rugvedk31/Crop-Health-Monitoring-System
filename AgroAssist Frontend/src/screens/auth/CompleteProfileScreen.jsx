import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { COLORS, SIZES, FONTS, RADIUS, SHADOWS } from '../../constants/theme'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { completeProfile } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const LANGUAGES = [
  { label: 'English', value: 'english', flag: '🇬🇧' },
  { label: 'मराठी', value: 'marathi', flag: '🇮🇳' },
  { label: 'हिंदी', value: 'hindi', flag: '🇮🇳' },
]

export default function CompleteProfileScreen({ navigation, route }) {
  const { phone } = route.params
  const { updateFarmer } = useAuth()
  const [name, setName] = useState('')
  const [language, setLanguage] = useState('english')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return
    }
    setLoading(true)
    try {
      const res = await completeProfile({ phone, name: name.trim(), language })
      if (res.id) {
        updateFarmer(res)
        navigation.replace('Main')
      } else {
        Alert.alert('Error', res.detail || 'Failed to save profile')
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>👨‍🌾</Text>
        </View>
        <Text style={styles.title}>Complete Profile</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>
      </View>

      <View style={[styles.card, SHADOWS.large]}>
        <Input
          label="Your Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        <Text style={styles.sectionLabel}>Preferred Language</Text>
        <View style={styles.languageRow}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.value}
              onPress={() => setLanguage(lang.value)}
              style={[styles.langBtn, language === lang.value && styles.langBtnActive]}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, language === lang.value && styles.langLabelActive]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Start Farming 🌾" onPress={handleSubmit} loading={loading} style={styles.btn} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  icon: { fontSize: 44 },
  title: { fontSize: SIZES.xxxl, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  subtitle: { fontSize: SIZES.base, color: COLORS.textMuted, marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.xxl, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  sectionLabel: { fontSize: SIZES.sm, fontWeight: FONTS.semiBold, color: COLORS.textSecondary, marginBottom: 12 },
  languageRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  langBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  langBtnActive: { borderColor: COLORS.primaryMid, backgroundColor: '#E8F5E9' },
  langFlag: { fontSize: 22, marginBottom: 4 },
  langLabel: { fontSize: SIZES.sm, fontWeight: FONTS.medium, color: COLORS.textMuted },
  langLabelActive: { color: COLORS.primary, fontWeight: FONTS.bold },
  btn: { marginTop: 8 },
})
