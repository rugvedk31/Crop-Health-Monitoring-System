import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, Platform, Image, ActivityIndicator,
  Linking
} from 'react-native'
import { useAuth } from '../context/AuthContext'

const QUICK_ACTIONS = [
  { icon: '🌿', title: 'Scan Crop', subtitle: 'Detect disease', screen: 'Predict', bg: '#F0FAF0', iconBg: '#C8E6C9' },
  { icon: '📋', title: 'My Reports', subtitle: 'Past results', screen: 'Profile', bg: '#FFF0F5', iconBg: '#F8BBD0' },
]

const INSIGHTS = [
  { icon: '🌱', title: 'Soil Health', color: '#4CAF50', text: 'Based on recent rain, delay applying nitrogen fertilizers for 2 days to prevent runoff.' },
  { icon: '⚠️', title: 'Early Warning', color: '#FF9800', text: 'Red rot risk is high in nearby fields. Inspect your crop in lower sections.' },
]

export default function HomeScreen({ navigation }) {
  const { farmer } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [news, setNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)

  // --- Real-time Weather States ---
  const [weatherData, setWeatherData] = useState({
    temp: '28°C',
    humidity: '65%',
    rainChance: '20%',
    desc: 'Loading location...',
    icon: '🌤'
  })
  const [loadingWeather, setLoadingWeather] = useState(true)

  // 1. Fetch Real-time Weather & Reverse Geocode Location Name
  const fetchRealTimeWeather = async (lat, lon) => {
    try {
      setLoadingWeather(true)
      
      // A. Reverse Geocode Coordinates to get the actual Town/City/Village Name (100% Free, No Key)
      let locationName = "My Farm"
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        const geoResponse = await fetch(geoUrl)
        const geoData = await geoResponse.json()
        
        // Grab village, suburb, town, or city depending on what is available in the rural/urban area
        locationName = geoData.locality || geoData.city || geoData.principalSubdivision || "My Farm"
      } catch (geoErr) {
        console.log("Failed to reverse geocode location name, falling back to default string:", geoErr)
      }

      // B. Fetch Meteorological Climate Forecast Data
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=precipitation_probability&forecast_days=1`
      const response = await fetch(weatherUrl)
      const data = await response.json()

      if (data.current) {
        const currentTemp = Math.round(data.current.temperature_2m)
        const currentHumidity = data.current.relative_humidity_2m
        const currentRainChance = data.hourly?.precipitation_probability?.[0] || Math.round(data.current.precipitation * 100)
        
        let conditionDesc = 'Clear Sky'
        let conditionIcon = '☀️'
        
        if (data.current.precipitation > 0) {
          conditionDesc = 'Raining'
          conditionIcon = '🌧'
        } else if (currentTemp < 20) {
          conditionDesc = 'Cool Breezes'
          conditionIcon = '🍃'
        } else if (currentHumidity > 70) {
          conditionDesc = 'Humid / Overcast'
          conditionIcon = '☁️'
        } else {
          conditionDesc = 'Partly Cloudy'
          conditionIcon = '🌤'
        }

        setWeatherData({
          temp: `${currentTemp}°C`,
          humidity: `${currentHumidity}%`,
          rainChance: `${currentRainChance}%`,
          desc: `${conditionDesc} • ${locationName}`, // Injected the real-time location name here dynamically
          icon: conditionIcon
        })
      }
    } catch (error) {
      console.error("Error fetching live weather data: ", error)
      setWeatherData(prev => ({ ...prev, desc: "Weather update failed" }))
    } finally {
      setLoadingWeather(false)
    }
  }

  // 2. Request Mobile Core Location coordinates
  const getUserLocationAndLoadDashboard = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchRealTimeWeather(latitude, longitude)
        },
        (error) => {
          console.log("Location permission rejected or timed out, loading defaults: ", error.message)
          // Default fallbacks to Pune coordinates if location access is denied
          fetchRealTimeWeather(18.5204, 73.8567) 
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    } else {
      fetchRealTimeWeather(18.5204, 73.8567)
    }
  }

  // 3. 100% Free RSS-to-JSON News Fetcher
  const fetchFarmingNews = async () => {
    try {
      setLoadingNews(true)
      const targetRssFeed = "https://www.thehindu.com/sci-tech/agriculture/feeder/default.rss"
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetRssFeed)}`
      )
      const data = await response.json()
      
      if (data.items) {
        const formattedArticles = data.items.slice(0, 5).map(item => ({
          title: item.title,
          urlToImage: item.enclosure?.link || item.thumbnail || null, 
          source: { name: "The Hindu" },
          link: item.link 
        }))
        setNews(formattedArticles)
      }
    } catch (error) {
      console.error("Error fetching agricultural news: ", error)
    } finally {
      setLoadingNews(false)
    }
  }

  const handleOpenNewsLink = (url) => {
    if (!url) return;
    Linking.openURL(url).catch((err) => 
      console.error("Failed to open web link: ", err)
    )
  }

  useEffect(() => {
    getUserLocationAndLoadDashboard()
    fetchFarmingNews()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    getUserLocationAndLoadDashboard() 
    fetchFarmingNews() 
    setTimeout(() => setRefreshing(false), 1000)
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
          {loadingWeather ? (
            <View style={{ flex: 1, height: 120, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, marginTop: 8, opacity: 0.8 }}>Updating live climate feed...</Text>
            </View>
          ) : (
            <>
              <View style={styles.weatherLeft}>
                <Text style={styles.weatherLabel}>CURRENT WEATHER</Text>
                <Text style={styles.weatherTemp}>{weatherData.temp}</Text>
                <Text style={styles.weatherDesc}>{weatherData.desc}</Text>
                <View style={styles.weatherStats}>
                  <View style={styles.weatherStat}>
                    <Text style={styles.weatherStatIcon}>💧</Text>
                    <Text style={styles.weatherStatLabel}>Humidity</Text>
                    <Text style={styles.weatherStatValue}>{weatherData.humidity}</Text>
                  </View>
                  <View style={styles.weatherStatDivider} />
                  <View style={styles.weatherStat}>
                    <Text style={styles.weatherStatIcon}>🌧</Text>
                    <Text style={styles.weatherStatLabel}>Rain Chance</Text>
                    <Text style={styles.weatherStatValue}>{weatherData.rainChance}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.weatherRight}>
                <View style={styles.weatherIconCircle}>
                  <Text style={styles.weatherIconEmoji}>{weatherData.icon}</Text>
                </View>
              </View>
            </>
          )}
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
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Insights</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollGap}
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

        {/* Real-time Farming News */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Farming News</Text>
          <Text style={styles.liveBadge}>● LIVE</Text>
        </View>

        {loadingNews ? (
          <ActivityIndicator size="small" color="#2E6B2E" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {news.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.newsCard}
                onPress={() => handleOpenNewsLink(item.link)}
                activeOpacity={0.9}
              >
                <Image 
                  source={{ uri: item.urlToImage || 'https://via.placeholder.com/220x110.png?text=Agro+News' }} 
                  style={styles.newsImage} 
                />
                <View style={styles.newsContent}>
                  <Text style={styles.newsSource}>{item.source?.name || 'Agriculture Update'}</Text>
                  <Text numberOfLines={2} style={styles.newsTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

      </ScrollView>

      {/* Floating Meta AI-Style Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={() => navigation.navigate('Chat')}
        activeOpacity={0.85}
      >
        <Text style={styles.floatingChatEmoji}>🤖</Text>
      </TouchableOpacity>
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
    paddingBottom: 100, 
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

  // Weather Card Container
  weatherCard: {
    backgroundColor: '#2E6B2E',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    minHeight: 140,
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
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 12,
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

  // Shared Horizontal Header Layout
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E6B2E',
    letterSpacing: 0.5,
  },
  horizontalScrollGap: {
    gap: 12,
    paddingRight: 4,
  },

  // Insights Card Styles
  insightCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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

  // News Card Styles 
  newsCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  newsImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#E8F5E9',
  },
  newsContent: {
    padding: 12,
  },
  newsSource: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E6B2E',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  newsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A3A1A',
    lineHeight: 16,
  },
  liveBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E53935',
  },

  // Floating Chatbot Button
  floatingChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E6B2E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  floatingChatEmoji: {
    fontSize: 26,
  },
})