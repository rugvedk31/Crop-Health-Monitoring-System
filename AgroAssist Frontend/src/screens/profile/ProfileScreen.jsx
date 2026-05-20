import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Switch, StatusBar, Platform, ActivityIndicator,
  RefreshControl, Modal, TextInput, KeyboardAvoidingView
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { getMe, clearChatMemory } from '../../services/api'
import { API } from '../../constants/api'

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

const LANGUAGES = [
  { label: 'English', value: 'english' },
  { label: 'मराठी', value: 'marathi' },
  { label: 'हिंदी', value: 'hindi' },
]

const CROPS = ['Sugarcane', 'Wheat', 'Rice', 'Tomato', 'Cotton', 'Soybean']
const SOIL_TYPES = ['Black Soil', 'Red Soil', 'Sandy Soil', 'Clay Soil', 'Loamy Soil']

export default function ProfileScreen({ navigation }) {
  const { farmer, logout, updateFarmer } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [farmModal, setFarmModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit profile fields
  const [editName, setEditName] = useState('')
  const [editLanguage, setEditLanguage] = useState('english')

  // Farm fields
  const [editCropType, setEditCropType] = useState('')
  const [editAreaAcres, setEditAreaAcres] = useState('')
  const [editSoilType, setEditSoilType] = useState('')
  const [editIrrigation, setEditIrrigation] = useState('')

  const d = profile || farmer
  const avatarLetter = (d?.name || 'F')[0].toUpperCase()

  const fetchProfile = async () => {
    try {
      const data = await getMe()
      if (data?.id) {
        setProfile(data)
        updateFarmer(data)
        setEditName(data.name || '')
        setEditLanguage(data.language || 'english')
        setEditCropType(data.farm?.crop_type || '')
        setEditAreaAcres(data.farm?.area_acres?.toString() || '')
        setEditSoilType(data.farm?.soil_type || '')
        setEditIrrigation(data.farm?.irrigation_type || '')
      }
    } catch (e) {
      console.log('Profile fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchProfile()
    setRefreshing(false)
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty')
      return
    }
    setSaving(true)
    try {
      const headers = await authHeaders()
      const res = await fetch(`${API.ME}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: editName.trim(), language: editLanguage }),
      })
      const data = await res.json()
      if (data?.id) {
        setProfile(data)
        updateFarmer(data)
        setEditModal(false)
        Alert.alert('Success', 'Profile updated successfully!')
      } else {
        Alert.alert('Error', data.detail || 'Failed to update profile')
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFarm = async () => {
    setSaving(true)
    try {
      const headers = await authHeaders()
      const res = await fetch(`${API.UPDATE_FARM}`, {
        method: 'PUT', // Fixed to PUT method matching API route configurations
        headers,
        body: JSON.stringify({
          crop_type: editCropType,
          area_acres: editAreaAcres ? parseFloat(editAreaAcres) : null,
          soil_type: editSoilType,
          irrigation_type: editIrrigation,
        }),
      })
      const data = await res.json()
      
      if (data && (data.id || data.crop_type)) {
        // Construct complete target context model object layout smoothly without truncating profile attributes
        const updatedProfile = {
          ...d,
          farm: {
            ...d?.farm,
            crop_type: editCropType,
            area_acres: editAreaAcres ? parseFloat(editAreaAcres) : null,
            soil_type: editSoilType,
            irrigation_type: editIrrigation,
          }
        }
        
        setProfile(updatedProfile)
        updateFarmer(updatedProfile)
        setFarmModal(false)
        Alert.alert('Success', 'Farm details updated!')
      } else {
        Alert.alert('Error', data.detail || 'Failed to update farm details')
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ])
  }

  const handleClearMemory = async () => {
    Alert.alert('Clear Memory', 'This will clear all conversation history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          try {
            await clearChatMemory()
            Alert.alert('Done', 'Conversation memory cleared')
          } catch (e) {
            Alert.alert('Error', 'Failed to clear memory')
          }
        }
      },
    ])
  }

  const getLanguageLabel = (lang) => {
    if (lang === 'marathi') return '🇮🇳 मराठी'
    if (lang === 'hindi') return '🇮🇳 हिंदी'
    return '🌐 English'
  }

  if (loading) {
    return (
      <View style={styles.loadingRoot}>
        <StatusBar backgroundColor="#1A3A1A" barStyle="light-content" />
        <ActivityIndicator size="large" color="#2E6B2E" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#1A3A1A" barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AgroAssist</Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E6B2E']} />}
      >
        {/* Profile Hero */}
        <View style={styles.profileHero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
            {d?.is_profile_complete && (
              <View style={styles.verifiedDot}>
                <Text style={styles.verifiedDotText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.farmerName}>{d?.name || 'Farmer'}</Text>
          <Text style={styles.farmerPhone}>{d?.phone || ''}</Text>
          <Text style={styles.farmerLocation}>
            📍 {d?.farm?.crop_type ? `${d.farm.crop_type} Farmer` : 'Farmer'}, India
          </Text>
          {d?.is_profile_complete && (
            <View style={styles.verifiedBadgePill}>
              <Text style={styles.verifiedBadgeText}>✓ Farmer Verified</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditModal(true)}>
            <Text style={styles.editProfileBtnText}>✏️  Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row (Removed Duplicate Total Scans Column Block Element) */}
        <View style={styles.statsRow}>
          {[
            { value: d?.total_scans || '0', label: 'Total\nScans' },
            { value: d?.diseases_detected || '0', label: 'Diseases\nDetected' },
            { value: '93%', label: 'AI\nAccuracy', color: '#76C442' },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, stat.color && { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < 2 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Farm Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Farm Details</Text>
            <TouchableOpacity onPress={() => setFarmModal(true)} style={styles.editBtn}>
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>
          {[
            { icon: '📐', label: 'Total Farm Size', value: d?.farm?.area_acres ? `${d.farm.area_acres} acres` : 'Not set' },
            { icon: '💧', label: 'Irrigation Type', value: d?.farm?.irrigation_type || 'Not set' },
            { icon: '🌍', label: 'Soil Type', value: d?.farm?.soil_type || 'Not set' },
            { icon: '🌱', label: 'Crop Type', value: d?.farm?.crop_type || 'Not set' },
          ].map((item, i) => (
            <View key={i} style={styles.farmRow}>
              <View style={styles.farmIconCircle}>
                <Text style={styles.farmIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.farmLabel}>{item.label}</Text>
              <Text style={styles.farmValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        {[
          { icon: '📊', label: 'My Reports', desc: 'View all scan history', onPress: () => navigation.navigate('Predict') },
          { icon: '💬', label: 'Chat History', desc: 'Past AI conversations', onPress: () => navigation.navigate('Chat') },
          { icon: '🧹', label: 'Clear Chat Memory', desc: 'Remove conversation history', onPress: handleClearMemory, danger: true },
        ].map((item, i) => (
          <TouchableOpacity key={i} onPress={item.onPress} style={[styles.quickLink, item.danger && styles.quickLinkDanger]}>
            <View style={[styles.quickLinkIconCircle, item.danger && { backgroundColor: '#FFEBEE' }]}>
              <Text style={styles.quickLinkIconText}>{item.icon}</Text>
            </View>
            <View style={styles.quickLinkInfo}>
              <Text style={[styles.quickLinkLabel, item.danger && { color: '#C62828' }]}>{item.label}</Text>
              <Text style={styles.quickLinkDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.quickLinkArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconCircle}>
                <Text style={styles.settingIcon}>🌐</Text>
              </View>
              <View>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDesc}>{getLanguageLabel(d?.language)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setEditModal(true)} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconCircle}>
                <Text style={styles.settingIcon}>🌙</Text>
              </View>
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDesc}>Coming soon</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D0E8CC', true: '#2E6B2E' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          {[
            { icon: '📱', label: 'Version', value: '1.0.0' },
            { icon: '🤖', label: 'AI Model', value: 'DenseNet201' },
            { icon: '📞', label: 'Phone', value: d?.phone || 'N/A' },
            { icon: '📅', label: 'Member Since', value: d?.created_at ? new Date(d.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : 'N/A' },
          ].map((item, i) => (
            <View key={i} style={styles.farmRow}>
              <View style={styles.farmIconCircle}>
                <Text style={styles.farmIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.farmLabel}>{item.label}</Text>
              <Text style={styles.farmValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>AgroAssist v1.0.0 • Made for Indian Farmers 🇮🇳</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              style={styles.fieldInput}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Language</Text>
            <View style={styles.langBtnRow}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.value}
                  onPress={() => editLanguage !== lang.value && setEditLanguage(lang.value)}
                  style={[styles.langOptionBtn, editLanguage === lang.value && styles.langOptionBtnActive]}
                >
                  <Text style={[styles.langOptionText, editLanguage === lang.value && styles.langOptionTextActive]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={saving}
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.saveBtnText}>Save Changes</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Farm Modal */}
      <Modal visible={farmModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Farm Details</Text>
                <TouchableOpacity onPress={() => setFarmModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Crop Type</Text>
              <View style={styles.chipRow}>
                {CROPS.map(crop => (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => setEditCropType(crop)}
                    style={[styles.chip, editCropType === crop && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, editCropType === crop && styles.chipTextActive]}>{crop}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Farm Area (acres)</Text>
              <TextInput
                value={editAreaAcres}
                onChangeText={setEditAreaAcres}
                placeholder="e.g. 5.5"
                style={styles.fieldInput}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>Soil Type</Text>
              <View style={styles.chipRow}>
                {SOIL_TYPES.map(soil => (
                  <TouchableOpacity
                    key={soil}
                    onPress={() => setEditSoilType(soil)}
                    style={[styles.chip, editSoilType === soil && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, editSoilType === soil && styles.chipTextActive]}>{soil}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Irrigation Type</Text>
              <TextInput
                value={editIrrigation}
                onChangeText={setEditIrrigation}
                placeholder="e.g. Drip, Flood, Sprinkler"
                style={styles.fieldInput}
                autoCapitalize="words"
              />

              <TouchableOpacity
                onPress={handleSaveFarm}
                disabled={saving}
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveBtnText}>Save Farm Details</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF6EE' },
  loadingRoot: { flex: 1, backgroundColor: '#EFF6EE', alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#4A6741' },
  header: {
    backgroundColor: '#1A3A1A', paddingHorizontal: 18, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: '#fff', fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  notifBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  notifIcon: { fontSize: 18 },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  profileHero: {
    backgroundColor: '#1A3A1A', alignItems: 'center',
    paddingBottom: 24, paddingTop: 16,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#C8E6C9', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#1A3A1A' },
  verifiedDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#76C442', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#1A3A1A',
  },
  verifiedDotText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  farmerName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 2 },
  farmerPhone: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  farmerLocation: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 10 },
  verifiedBadgePill: {
    backgroundColor: 'rgba(118,196,66,0.25)', paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 20, borderWidth: 1,
    borderColor: '#76C442', marginBottom: 12,
  },
  verifiedBadgeText: { fontSize: 12, color: '#76C442', fontWeight: '600' },
  editProfileBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editProfileBtnText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    marginHorizontal: 18, borderRadius: 16, padding: 16,
    marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E8F5E9', elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1A3A1A', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#4A6741', textAlign: 'center', lineHeight: 14 },
  statDivider: { width: 1, backgroundColor: '#E8F5E9', marginHorizontal: 4 },
  section: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginHorizontal: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E8F5E9',
  },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A3A1A' },
  editBtn: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  editBtnText: { fontSize: 12, color: '#2E6B2E', fontWeight: '600' },
  farmRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0FAF0', gap: 10,
  },
  farmIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  farmIcon: { fontSize: 14 },
  farmLabel: { flex: 1, fontSize: 13, color: '#4A6741' },
  farmValue: { fontSize: 13, fontWeight: '600', color: '#1A3A1A' },
  quickLink: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginHorizontal: 18, marginBottom: 10,
    gap: 12, borderWidth: 1, borderColor: '#E8F5E9',
  },
  quickLinkDanger: { borderColor: '#FFCDD2', backgroundColor: '#FFF8F8' },
  quickLinkIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  quickLinkIconText: { fontSize: 18 },
  quickLinkInfo: { flex: 1 },
  quickLinkLabel: { fontSize: 14, fontWeight: '600', color: '#1A3A1A' },
  quickLinkDesc: { fontSize: 11, color: '#4A6741', marginTop: 2 },
  quickLinkArrow: { fontSize: 20, color: '#4A6741' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0FAF0',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  settingIcon: { fontSize: 14 },
  settingLabel: { fontSize: 14, fontWeight: '500', color: '#1A3A1A' },
  settingDesc: { fontSize: 11, color: '#4A6741', marginTop: 1 },
  changeBtn: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  changeBtnText: { fontSize: 12, color: '#2E6B2E', fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginHorizontal: 18, marginBottom: 16, gap: 8,
    borderWidth: 1.5, borderColor: '#FFCDD2',
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#C62828' },
  footer: { textAlign: 'center', fontSize: 11, color: '#4A6741', paddingHorizontal: 18, marginBottom: 10 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalScrollContent: { justifyContent: 'flex-end', flexGrow: 1 },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1A3A1A' },
  modalClose: { fontSize: 20, color: '#888' },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#4A6741', marginBottom: 8 },
  fieldInput: {
    backgroundColor: '#F0FAF0', borderRadius: 12, padding: 14,
    fontSize: 14, color: '#1A3A1A', borderWidth: 1, borderColor: '#D0E8CC', marginBottom: 16,
  },
  langBtnRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  langOptionBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#D0E8CC', alignItems: 'center', backgroundColor: '#F0FAF0',
  },
  langOptionBtnActive: { backgroundColor: '#2E6B2E', borderColor: '#2E6B2E' },
  langOptionText: { fontSize: 13, fontWeight: '500', color: '#4A6741' },
  langOptionTextActive: { color: '#fff', fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#F0FAF0', borderWidth: 1, borderColor: '#D0E8CC',
  },
  chipActive: { backgroundColor: '#2E6B2E', borderColor: '#2E6B2E' },
  chipText: { fontSize: 12, fontWeight: '500', color: '#4A6741' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  saveBtn: { backgroundColor: '#1A3A1A', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
})