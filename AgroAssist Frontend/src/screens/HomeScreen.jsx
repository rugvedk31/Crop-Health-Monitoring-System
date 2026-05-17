import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, Platform
} from 'react-native'
import { useAuth } from '../context/AuthContext'

const QUICK_ACTIONS = [
  { icon: '🌿', title: 'Scan Crop', subtitle: 'Detect disease', screen: 'Predict', bg: '#F0FAF0', iconBg: '#C8E6C9' },
  { icon: '📤', title: 'Upload Image', subtitle: 'From gallery', screen: 'Predict', bg: '#F0F4FF', iconBg: '#BBDEFB' },
  { icon: '🤖', title: 'Ask Expert', subtitle: 'AI advisor', screen: 'Chat', bg: '#FFFBF0', iconBg: '#FFE082' },
  { icon: '📋', title: 'My Reports', subtitle: 'Past results', screen: 'Profile', bg: '#FFF0F5', iconBg: '#F8BBD0' },
]

const INSIGHTS = [
  { icon: '🌱', title: 'Soil Health', color: '#4CAF50', text: 'Based on recent rain, delay applying nitrogen fertilizers for 2 days to prevent runoff.' },
  { icon: '⚠️', title: 'Early Warning', color: '#FF9800', text: 'Red rot risk is high in nearby fields. Inspect your crop in lower sections.' },
]

export default function HomeScreen({ navigation }) {
  const { farmer } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 12 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E6B2E']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👨‍🌾</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>
                  Namaste, {farmer?.name || 'Farmer'} 👋
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherLabel}>CURRENT WEATHER</Text>
            <Text style={styles.weatherTemp}>28°C</Text>
            <Text style={styles.weatherDesc}>Partly Cloudy • Pune</Text>
            <View style={styles.weatherStats}>
              <View style={styles.weatherStat}>
                <Text style={styles.weatherStatIcon}>💧</Text>
                <Text style={styles.weatherStatLabel}>Humidity</Text>
                <Text style={styles.weatherStatValue}>65%</Text>
              </View>
              <View style={styles.weatherStatDivider} />
              <View style={styles.weatherStat}>
                <Text style={styles.weatherStatIcon}>🌧</Text>
                <Text style={styles.weatherStatLabel}>Rain Chance</Text>
                <Text style={styles.weatherStatValue}>20%</Text>
              </View>
            </View>
          </View>
          <View style={styles.weatherRight}>
            <View style={styles.weatherIconCircle}>
              <Text style={styles.weatherIconEmoji}>🌤</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(action.screen)}
              style={[styles.actionCard, { backgroundColor: action.bg }]}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: action.iconBg }]}>
                <Text style={styles.actionIconEmoji}>{action.icon}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Insights */}
        <View style={styles.insightHeader}>
          <Text style={styles.sectionTitle}>Daily Insights</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insightScroll}
        >
          {INSIGHTS.map((insight, i) => (
            <View key={i} style={styles.insightCard}>
              <View style={[styles.insightIconCircle, { backgroundColor: insight.color + '22' }]}>
                <Text style={styles.insightIconEmoji}>{insight.icon}</Text>
              </View>
              <Text style={[styles.insightTitle, { color: insight.color }]}>{insight.title}</Text>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </ScrollView>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EFF6EE',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },
  welcomeText: {
    fontSize: 12,
    color: '#4A6741',
    fontWeight: '400',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3A1A',
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0E8CC',
  },
  notifIcon: { fontSize: 18 },

  // Weather
  weatherCard: {
    backgroundColor: '#2E6B2E',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  weatherLeft: { flex: 1 },
  weatherLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  weatherDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  weatherStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  weatherStat: { alignItems: 'flex-start' },
  weatherStatIcon: { fontSize: 14, marginBottom: 2 },
  weatherStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  weatherStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  weatherStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  weatherRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  weatherIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIconEmoji: { fontSize: 34 },

  // Section Title
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A3A1A',
    marginBottom: 12,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconEmoji: { fontSize: 24 },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A3A1A',
    textAlign: 'center',
  },

  // Insights
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E6B2E',
    letterSpacing: 0.5,
  },
  insightScroll: {
    gap: 12,
    paddingRight: 4,
  },
  insightCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  insightIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  insightIconEmoji: { fontSize: 18 },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 12,
    color: '#4A6741',
    lineHeight: 18,
  },
})