import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Switch, StatusBar, Platform, ActivityIndicator,
  RefreshControl
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { getMe, clearChatMemory } from '../../services/api'

export default function ProfileScreen({ navigation }) {
  const { farmer, logout, updateFarmer } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const fetchProfile = async () => {
    try {
      const data = await getMe()
      if (data?.id) {
        setProfile(data)
        updateFarmer(data)
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

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ])
  }

  const handleClearMemory = async () => {
    Alert.alert('Clear Memory', 'This will clear all conversation history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await clearChatMemory(); Alert.alert('Done', 'Memory cleared') } },
    ])
  }

  const d = profile || farmer
  const avatarLetter = (d?.name || 'F')[0].toUpperCase()

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
            <View style={styles.verifiedDot}>
              <Text style={styles.verifiedDotText}>✓</Text>
            </View>
          </View>
          <Text style={styles.farmerName}>{d?.name || 'Farmer'}</Text>
          <Text style={styles.farmerLocation}>
            📍 {d?.farm?.soil_type ? `${d?.farm?.crop_type || 'Farmer'}, Maharashtra` : 'India'}
          </Text>
          <View style={styles.verifiedBadgePill}>
            <Text style={styles.verifiedBadgeText}>✓ Farmer Verified</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Crops{'\n'}Analyzed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Diseases{'\n'}Detected</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>104</Text>
            <Text style={styles.statLabel}>Total{'\n'}Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#76C442' }]}>93%</Text>
            <Text style={styles.statLabel}>AI{'\n'}Accuracy</Text>
          </View>
        </View>

        {/* Farm Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Details</Text>
          {[
            { icon: '📐', label: 'Total Farm Size', value: d?.farm?.area_acres ? `${d.farm.area_acres} acres` : 'Not set' },
            { icon: '💧', label: 'Irrigation Type', value: 'Drip System' },
            { icon: '🌍', label: 'Soil Type', value: d?.farm?.soil_type || 'Not set' },
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
          { icon: '📊', label: 'My Reports', color: '#E8F5E9', iconBg: '#C8E6C9', onPress: () => {} },
          { icon: '💊', label: 'Saved Treatments', color: '#E8F5E9', iconBg: '#C8E6C9', onPress: () => {} },
          { icon: '📅', label: 'Crop Schedule', color: '#E8F5E9', iconBg: '#C8E6C9', onPress: () => {} },
        ].map((item, i) => (
          <TouchableOpacity key={i} onPress={item.onPress} style={[styles.quickLink, { backgroundColor: item.color }]}>
            <View style={[styles.quickLinkIcon, { backgroundColor: item.iconBg }]}>
              <Text style={styles.quickLinkIconText}>{item.icon}</Text>
            </View>
            <Text style={styles.quickLinkLabel}>{item.label}</Text>
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
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <Text style={styles.settingValue}>
              {d?.language === 'marathi' ? 'मराठी' : d?.language === 'hindi' ? 'हिंदी' : 'English'}
            </Text>
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconCircle}>
                <Text style={styles.settingIcon}>🌙</Text>
              </View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D0E8CC', true: '#2E6B2E' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutRow}>
          <View style={[styles.settingIconCircle, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.settingIcon}>🚪</Text>
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>AgroAssist v1.0.0 • Made for Indian Farmers 🇮🇳</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF6EE' },
  loadingRoot: { flex: 1, backgroundColor: '#EFF6EE', alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#4A6741' },

  // Header
  header: {
    backgroundColor: '#1A3A1A',
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: '#fff', fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  notifBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  notifIcon: { fontSize: 18 },

  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // Profile Hero
  profileHero: {
    backgroundColor: '#1A3A1A',
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 10,
    marginBottom: 0,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#C8E6C9',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#1A3A1A' },
  verifiedDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#76C442',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#1A3A1A',
  },
  verifiedDotText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  farmerName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  farmerLocation: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  verifiedBadgePill: {
    backgroundColor: 'rgba(118,196,66,0.25)',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: '#76C442',
  },
  verifiedBadgeText: { fontSize: 12, color: '#76C442', fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 16,
    marginTop: -1,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1A3A1A', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#4A6741', textAlign: 'center', lineHeight: 14 },
  statDivider: { width: 1, backgroundColor: '#E8F5E9', marginHorizontal: 4 },

  // Section
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A3A1A', marginBottom: 14 },

  // Farm Row
  farmRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#F0FAF0',
    gap: 10,
  },
  farmIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  farmIcon: { fontSize: 14 },
  farmLabel: { flex: 1, fontSize: 13, color: '#4A6741' },
  farmValue: { fontSize: 13, fontWeight: '600', color: '#1A3A1A' },

  // Quick Links
  quickLink: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 14,
    marginHorizontal: 18, marginBottom: 10,
    gap: 12,
    borderWidth: 1, borderColor: '#D0E8CC',
  },
  quickLinkIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLinkIconText: { fontSize: 18 },
  quickLinkLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A3A1A' },
  quickLinkArrow: { fontSize: 20, color: '#4A6741' },

  // Settings
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F0FAF0',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  settingIcon: { fontSize: 14 },
  settingLabel: { fontSize: 14, fontWeight: '500', color: '#1A3A1A' },
  settingValue: { fontSize: 13, color: '#4A6741', fontWeight: '500' },

  // Logout
  logoutRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14, padding: 14,
    marginHorizontal: 18, marginBottom: 16,
    gap: 12,
    borderWidth: 1, borderColor: '#FFCDD2',
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#C62828' },

  footer: { textAlign: 'center', fontSize: 11, color: '#4A6741', paddingHorizontal: 18 },
})