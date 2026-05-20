import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
  Linking,
  Modal,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { useAuth } from '../context/AuthContext'

const { height } = Dimensions.get('window')

const QUICK_ACTIONS = [
  { icon: '🌿', title: 'Scan Crop', subtitle: 'Detect disease', screen: 'Predict', bg: '#F0FAF0', iconBg: '#C8E6C9' },
  { icon: '📋', title: 'My Reports', subtitle: 'Past results', screen: 'Profile', bg: '#FFF0F5', iconBg: '#F8BBD0' },
]

export default function HomeScreen({ navigation }) {
  const { farmer } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [news, setNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)

  // --- Dynamic Dashboard States ---
  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [weatherData, setWeatherData] = useState({
    temp: '28°C',
    humidity: '65%',
    rainChance: '20%',
    desc: 'Loading location...',
    icon: '🌤'
  })
  const [loadingWeather, setLoadingWeather] = useState(true)

  // --- Real-time Notification System States ---
  const [notifications, setNotifications] = useState([])
  const [isNotifVisible, setIsNotifVisible] = useState(false)
  const [hasUnreadNotif, setHasUnreadNotif] = useState(true)

  // --- Dynamic First Name Parser ---
  const getFarmerFirstName = () => {
    if (!farmer?.name) return 'Farmer'
    const trimmedName = farmer.name.trim()
    return trimmedName.split(' ')[0]
  }

  // 1. Core Engine: Dynamically maps alerts based on actual location climate metrics
  const generateLiveAlertsAndInsights = (temp, humidity, rainChance, locationName) => {
    setLoadingInsights(true)
    try {
      let generatedInsights = []
      let generatedNotifications = []

      // --- CRITERIA A: SOIL HEALTH, RAIN & FERTILIZER MANAGEMENT ---
      if (rainChance >= 50) {
        const rainText = `High (${rainChance}%) rain forecast in ${locationName}. Delay applying granular nitrogen fertilizers for 48 hours to avoid field runoff.`
        generatedInsights.push({
          icon: '🌱',
          title: 'Soil Nutrient Alert',
          color: '#4CAF50',
          text: rainText
        })
        generatedNotifications.push({
          id: 'notif_1',
          icon: '🌧️',
          title: 'Fertilizer Runoff Warning',
          time: 'Just Now',
          description: rainText,
          tag: 'Soil Health',
          tagColor: '#E8F5E9',
          textColor: '#2E6B2E'
        })
      } else if (temp > 32) {
        const heatText = `High heat conditions (${temp}°C) spotted. Shift micro-irrigation scheduling to early morning hours to minimize evaporation loss.`
        generatedInsights.push({
          icon: '💧',
          title: 'Moisture Preservation',
          color: '#0288D1',
          text: heatText
        })
        generatedNotifications.push({
          id: 'notif_1',
          icon: '☀️',
          title: 'Irrigation Adjustments Required',
          time: 'Just Now',
          description: heatText,
          tag: 'Water Management',
          tagColor: '#E1F5FE',
          textColor: '#0288D1'
        })
      } else {
        generatedInsights.push({
          icon: '🌱',
          title: 'Optimal Soil Window',
          color: '#4CAF50',
          text: `Mild ambient conditions in ${locationName} are excellent for applying standard organic bio-fertilizers or executing routine weeding.`
        })
      }

      // --- CRITERIA B: REAL-TIME DISEASE/PEST RISK MATRIX ---
      if (humidity > 75 && temp >= 22 && temp <= 32) {
        const fungusText = `High humidity (${humidity}%) and warm weather create prime conditions for powdery mildew spore propagation. Inspect leaves closely.`
        generatedInsights.push({
          icon: '⚠️',
          title: 'Fungal Infection Risk',
          color: '#E65100',
          text: fungusText
        })
        generatedNotifications.push({
          id: 'notif_2',
          icon: '⚠️',
          title: 'Fungal Spore Risk: High',
          time: '5m ago',
          description: fungusText,
          tag: 'Crop Protection',
          tagColor: '#FFF3E0',
          textColor: '#E65100'
        })
      } else if (rainChance > 40 && humidity > 70) {
        const pestText = `Prolonged moisture patterns in ${locationName} increase risk thresholds for aphid activity. Keep sticky traps configured in lower quadrants.`
        generatedInsights.push({
          icon: '🐛',
          title: 'Pest Outbreak Alert',
          color: '#FF9800',
          text: pestText
        })
        generatedNotifications.push({
          id: 'notif_2',
          icon: '🐛',
          title: 'Pest Outbreak Warning',
          time: '10m ago',
          description: pestText,
          tag: 'Pest Control',
          tagColor: '#FFFDE7',
          textColor: '#F57F17'
        })
      } else {
        generatedInsights.push({
          icon: '🛡️',
          title: 'Crop Protection Steady',
          color: '#2E6B2E',
          text: `Atmospheric microclimates look balanced. Continue routine bio-pesticide perimeter sweeps to secure seasonal crop yields.`
        })
      }

      // Add a baseline notification if no extreme weather conditions hit
      if (generatedNotifications.length === 0) {
        generatedNotifications.push({
          id: 'notif_stable',
          icon: '✅',
          title: 'Farm Diagnostics Stable',
          time: '1h ago',
          description: `Microclimate grids in ${locationName} are safe. Ideal conditions maintained for standard crop maintenance windows.`,
          tag: 'Routine Sync',
          tagColor: '#EFF6EE',
          textColor: '#2E6B2E'
        })
      }

      setInsights(generatedInsights)
      setNotifications(generatedNotifications)
    } catch (err) {
      console.log("Failed to process dynamic real-time insights cascade:", err)
    } finally {
      setLoadingInsights(false)
    }
  }

  // 2. Fetch Real-time Weather & Coordinate Conversion
  const fetchRealTimeWeather = async (lat, lon) => {
    try {
      setLoadingWeather(true)
      let locationName = "My Farm"
      
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        const geoResponse = await fetch(geoUrl)
        const geoData = await geoResponse.json()
        locationName = geoData.locality || geoData.city || geoData.principalSubdivision || "Pune"
      } catch (geoErr) {
        console.log("Failed to reverse geocode location name:", geoErr)
      }

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=precipitation_probability&forecast_days=1`
      const response = await fetch(weatherUrl)
      const data = await response.json()

      if (data.current) {
        const currentTemp = Math.round(data.current.temperature_2m)
        const currentHumidity = data.current.relative_humidity_2m
        const currentRainChance = data.hourly?.precipitation_probability?.[0] || 0
        const wmoCode = data.current.weather_code

        let conditionDesc = 'Clear Sky'
        let conditionIcon = '☀️'
        
        if (currentTemp >= 32 && currentRainChance < 30) {
          conditionDesc = 'Hot & Sunny'
          conditionIcon = '☀️'
        } else if (currentRainChance >= 50 || wmoCode >= 51) {
          conditionDesc = 'Raining'
          conditionIcon = '🌧'
        } else if (currentRainChance >= 30) {
          conditionDesc = 'Overcast / Light Drizzle'
          conditionIcon = '☁️'
        } else if (wmoCode === 1 || wmoCode === 2 || wmoCode === 3) {
          conditionDesc = 'Partly Cloudy'
          conditionIcon = '🌤'
        } else if (currentTemp < 20) {
          conditionDesc = 'Cool Breeze'
          conditionIcon = '🍃'
        }

        setWeatherData({
          temp: `${currentTemp}°C`,
          humidity: `${currentHumidity}%`,
          rainChance: `${currentRainChance}%`,
          desc: `${conditionDesc} • ${locationName}`,
          icon: conditionIcon
        })

        generateLiveAlertsAndInsights(currentTemp, currentHumidity, currentRainChance, locationName)
      }
    } catch (error) {
      console.error("Error fetching live weather data: ", error)
      setWeatherData(prev => ({ ...prev, desc: "Weather update failed" }))
      setLoadingInsights(false)
    } finally {
      setLoadingWeather(false)
    }
  }

  // 3. Request Location Coordinates
  const getUserLocationAndLoadDashboard = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchRealTimeWeather(latitude, longitude)
        },
        (error) => {
          console.log("Location permission rejected, using fallbacks:", error.message)
          fetchRealTimeWeather(18.5204, 73.8567) 
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    } else {
      fetchRealTimeWeather(18.5204, 73.8567)
    }
  }

  // 4. RSS News Stream Fetcher
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

  const handleOpenNotifications = () => {
    setIsNotifVisible(true)
    setHasUnreadNotif(false) // Dismiss unread badge upon tapping the appbar control
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
        {/* HEADER BAR (With working dynamic alert notification counter dots) */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👨‍🌾</Text>
            </View>
            <View style={styles.textContainerColumn}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <View style={styles.nameRow}>
                <Text numberOfLines={1} style={styles.nameText}>
                  Namaste, {getFarmerFirstName()} 👋
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity onPress={handleOpenNotifications} style={styles.notifBtn} activeOpacity={0.7}>
            <Text style={styles.notifIcon}>🔔</Text>
            {hasUnreadNotif && <View style={styles.unreadBadgeIndicatorPin} />}
          </TouchableOpacity>
        </View>

        {/* Dynamic Weather Climate Box */}
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

        {/* Real-time Generated AI Insights Shelf */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Insights</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.seeAllText}>REFRESH</Text>
          </TouchableOpacity>
        </View>

        {loadingInsights ? (
          <View style={styles.loadingInsightsWrapper}>
            <ActivityIndicator size="small" color="#2E6B2E" />
            <Text style={styles.loadingInsightsText}>Analyzing eco-factors...</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollGap}
          >
            {insights.map((insight, i) => (
              <View key={i} style={styles.insightCard}>
                <View style={[styles.insightIconCircle, { backgroundColor: insight.color + '15' }]}>
                  <Text style={styles.insightIconEmoji}>{insight.icon}</Text>
                </View>
                <Text style={[styles.insightTitle, { color: insight.color }]}>{insight.title}</Text>
                <Text style={styles.insightText}>{insight.text}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Real-time Farming RSS News */}
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

      {/* =======================================================
          DYNAMIC SLIDE-UP REAL-TIME NOTIFICATIONS PANEL (MODAL)
         ======================================================= */}
      <Modal visible={isNotifVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.notifModalContainerCard}>
            
            {/* Modal Drag/Dismiss Handle */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.notifTitleHeaderFlex}>
                <Text style={styles.modalHeaderTitle}>Farm Advisory Alerts</Text>
                <View style={styles.notifLiveBadgeCount}>
                  <Text style={styles.notifLiveBadgeText}>{notifications.length} Live</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsNotifVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Alert Stream */}
            <ScrollView style={styles.notifItemsScrollView} showsVerticalScrollIndicator={false}>
              {notifications.map((notif) => (
                <View key={notif.id} style={styles.notifAlertItemRow}>
                  <View style={styles.notifAlertIconWrapper}>
                    <Text style={styles.notifAlertIconEmoji}>{notif.icon}</Text>
                  </View>
                  <View style={styles.notifAlertMetadataColumn}>
                    <View style={notifStyles.metaRow}>
                      <Text style={styles.notifAlertTitleText}>{notif.title}</Text>
                      <Text style={styles.notifAlertTimeSpan}>{notif.time}</Text>
                    </View>
                    <Text style={styles.notifAlertDescPayload}>{notif.description}</Text>
                    
                    {/* Actionable Scope Categories Pills */}
                    <View style={[styles.notifParamPillTag, { backgroundColor: notif.tagColor }]}>
                      <Text style={[styles.notifParamPillText, { color: notif.textColor }]}>
                        ⚡ {notif.tag}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

          </SafeAreaView>
        </View>
      </Modal>

      {/* Floating Chatbot Button */}
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

// Extra sub-row configurations mapping setup helpers
const notifStyles = {
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EFF6EE',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 110,
  },

  // Custom Balanced App Bar Elements
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    alignSelf: 'stretch',
    paddingRight: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 16,
  },
  textContainerColumn: {
    flex: 1,
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
    width: '100%',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3A1A',
    flex: 1,
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
    position: 'relative'
  },
  notifIcon: { fontSize: 18 },
  unreadBadgeIndicatorPin: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#E53935',
    borderWidth: 1.5,
    borderColor: '#fff'
  },

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
    fontSize: 11,
    fontWeight: '700',
    color: '#2E6B2E',
    letterSpacing: 0.5,
  },
  horizontalScrollGap: {
    gap: 12,
    paddingRight: 4,
  },

  // Insights Loading States
  loadingInsightsWrapper: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  loadingInsightsText: {
    fontSize: 12,
    color: '#7A8B75',
    fontWeight: '500',
  },

  // Insights Card Styles
  insightCard: {
    width: 210,
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
    fontSize: 11,
    color: '#2C3E2B',
    lineHeight: 16,
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
    bottom: 96,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E6B2E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  floatingChatEmoji: {
    fontSize: 26,
  },

  // =======================================================
  // NEW NOTIFICATIONS OVERLAY MODAL SHEET STYLES
  // =======================================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  notifModalContainerCard: {
    backgroundColor: '#F7FAF6',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  notifTitleHeaderFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3A1A',
  },
  notifLiveBadgeCount: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  notifLiveBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  closeModalText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '700',
  },
  notifItemsScrollView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notifAlertItemRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  notifAlertIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifAlertIconEmoji: {
    fontSize: 18,
  },
  notifAlertMetadataColumn: {
    flex: 1,
  },
  notifAlertTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3A1A',
    flex: 1,
    paddingRight: 6,
  },
  notifAlertTimeSpan: {
    fontSize: 11,
    color: '#7A8B75',
    fontWeight: '500',
  },
  notifAlertDescPayload: {
    fontSize: 12,
    color: '#4A6741',
    lineHeight: 18,
    marginBottom: 8,
  },
  notifParamPillTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  notifParamPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
})