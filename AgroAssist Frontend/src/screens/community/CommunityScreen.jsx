import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native'

const { width } = Dimensions.get('window')

const LANGUAGES = [
  { id: 'all', label: 'All' },
  { id: 'en', label: 'English' },
  { id: 'mr', label: 'मराठी (Marathi)' },
  { id: 'hi', label: 'हिन्दी (Hindi)' }
]

const ALL_POSTS = [
  {
    id: 'post_1',
    lang: 'en',
    userName: 'Ramesh P.',
    location: 'Pune, Maharashtra • 2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80',
    cropTag: 'Wheat',
    statusTag: '⚠️ Disease Suspected',
    statusColor: '#D32F2F',
    statusBg: '#FFEBE6',
    bodyText: 'My wheat leaves are turning yellow from the tips, and there are small brown spots appearing. The soil is slightly damp. Has anyone faced this recently?',
    postImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    aiInsight: '✨ AI Scanned: High Probability Rust',
    likes: 24,
    replies: 8
  },
  {
    id: 'post_2',
    lang: 'mr',
    userName: 'ज्ञानेश्वर साळुंखे (Dnyaneshwar S.)',
    location: 'नाशिक, महाराष्ट्र • ३ तास पूर्वी',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    cropTag: 'द्राक्षे (Grapes)',
    statusTag: '🍂 बुरशीजन्य प्रादुर्भाव (Mildew)',
    statusColor: '#E65100',
    statusBg: '#FFF3E0',
    bodyText: 'माझ्या द्राक्ष बागेत पानाच्या पाठीमागच्या बाजूला पांढरी बुरशी दिसत आहे. यावर कोणती फवारणी घ्यावी? कृपया अनुभवी शेतकऱ्यांनी मार्गदर्शन करावे.',
    postImage: 'https://images.unsplash.com/photo-1532467414647-9e38ec47db1a?w=600&auto=format&fit=crop&q=80',
    aiInsight: '✨ AI तपासणी: डाउनी मिल्ड्यू (Downy Mildew)',
    likes: 42,
    replies: 15
  },
  {
    id: 'post_3',
    lang: 'hi',
    userName: 'सुरेश कुमार (Suresh K.)',
    location: 'इंदौर, मध्य प्रदेश • ४ घंटे पहले',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=80',
    cropTag: 'कपास (Cotton)',
    statusTag: '🐛 कीट का हमला (Pest Attack)',
    statusColor: '#B71C1C',
    statusBg: '#FFEBEE',
    bodyText: 'कपास की पत्तियों में सुंडी का प्रकोप दिख रहा है। पत्तियां किनारों से मुड़ रही हैं। इसके नियंत्रण के लिए सबसे असरदार दवा कौन सी रहेगी?',
    postImage: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
    aiInsight: '✨ AI स्कैन: गुलाबी सुंडी (Pink Bollworm)',
    likes: 35,
    replies: 11
  }
]

const TRENDING_ISSUES = [
  {
    id: '1',
    title: 'Pink Bollworm in Cotton - Early Stage Control',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=100&auto=format&fit=crop&q=60',
    discussing: '1.2k discussing'
  },
  {
    id: '2',
    title: 'Monsoon Prep: Soil Drainage Techniques',
    image: 'https://images.unsplash.com/photo-1463123081488-729f551ee6f0?w=100&auto=format&fit=crop&q=60',
    discussing: '850 discussing'
  }
]

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLangCode, setSelectedLangCode] = useState('all')

  const filteredPosts = selectedLangCode === 'all' 
    ? ALL_POSTS 
    : ALL_POSTS.filter(post => post.lang === selectedLangCode)

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />
      
      {/* Top Appbar & Search Infrastructure */}
      <View style={styles.searchHeaderContainer}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>AgroAssist</Text>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherText}>🌤 35°C Pune</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search discussions..."
            placeholderTextColor="#7A8B75"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Main Container Layout */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Farmer Community 🌱</Text>

        {/* 1. Main Connect Banner Component */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerHeading}>Connect with Farmers Across India</Text>
            <Text style={styles.bannerSubtitle}>
              Share knowledge, ask experts, and grow together.
            </Text>
            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.8}>
              <Text style={styles.bannerBtnText}>Join Community</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&auto=format&fit=crop&q=80' }} 
            style={styles.bannerImage}
          />
        </View>

        {/* 2. Languages Selection Carousel Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.langScrollGap}
          style={styles.langContainer}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLangCode === lang.id
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setSelectedLangCode(lang.id)}
                style={[styles.langTag, isSelected && styles.langTagActive]}
              >
                <Text style={[styles.langTagText, isSelected && styles.langTagActiveText]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* 3. Community Post Feeds Section */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* User Header Details */}
              <View style={styles.postHeaderRow}>
                <View style={styles.userInfoCol}>
                  <Image source={{ uri: post.avatar }} style={styles.userAvatarImage} />
                  <View>
                    <Text style={styles.userName}>{post.userName}</Text>
                    <Text style={styles.userMetaLocation}>{post.location}</Text>
                  </View>
                </View>
                <TouchableOpacity><Text style={styles.moreOptionsIcon}>⋮</Text></TouchableOpacity>
              </View>

              {/* Status Context Indicator Badges */}
              <View style={styles.badgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.statusBadgeText, { color: '#2E6B2E' }]}>{post.cropTag}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: post.statusBg }]}>
                  <Text style={[styles.statusBadgeText, { color: post.statusColor }]}>{post.statusTag}</Text>
                </View>
              </View>

              {/* Body Content Description */}
              <Text style={styles.postBodyText}>{post.bodyText}</Text>

              {/* Diagnosis Showcase Layout Image */}
              <View style={styles.postImageContainer}>
                <Image source={{ uri: post.postImage }} style={styles.postAttachedImage} />
                <View style={styles.aiOverlayBadge}>
                  <Text style={styles.aiOverlayText}>{post.aiInsight}</Text>
                </View>
              </View>

              {/* Interactive Metric Feed Actions Footer */}
              <View style={styles.postActionsFooter}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnIcon}>👍 {post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnIcon}>💬 {post.replies} Replies</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.expertBtn}>
                  <Text style={styles.expertBtnText}>👨‍⚕️ Ask Experts</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyFeedBox}>
            <Text style={styles.emptyFeedText}>No discussions available at the moment.</Text>
          </View>
        )}

        {/* 4. Trending Issues List Group Block */}
        <View style={styles.trendingContainer}>
          <Text style={styles.trendingHeaderTitle}>📈 Trending Issues</Text>
          {TRENDING_ISSUES.map((issue) => (
            <View key={issue.id} style={styles.trendingListItem}>
              <Image source={{ uri: issue.image }} style={styles.trendingItemThumbnail} />
              <View style={styles.trendingTextContainer}>
                <Text numberOfLines={1} style={styles.trendingItemTitle}>{issue.title}</Text>
                <Text style={styles.trendingItemSubtext}>{issue.discussing}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 5. Base Absolute Position Floating Add Trigger Component */}
      <TouchableOpacity style={styles.floatingAddBtn} activeOpacity={0.9}>
        <Text style={styles.floatingAddBtnText}>+ Ask Community</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EFF6EE'
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3A1A',
    marginVertical: 14
  },

  // Header Structural Layout properties
  searchHeaderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E6B2E',
    flex: 1
  },
  weatherBadge: {
    backgroundColor: '#EFF6EE',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8
  },
  weatherText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A3A1A'
  },
  notifBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notifIcon: {
    fontSize: 18
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
    color: '#7A8B75'
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A3A1A',
    paddingVertical: 0
  },

  // Display Promo Banner Settings Block
  bannerCard: {
    backgroundColor: '#1A3A1A',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 160
  },
  bannerLeft: {
    flex: 1.2,
    justifyContent: 'center',
    zIndex: 2
  },
  bannerHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 6
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 18,
    marginBottom: 16
  },
  bannerBtn: {
    backgroundColor: '#2E6B2E',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  bannerImage: {
    width: 140,
    height: '120%',
    opacity: 0.85,
    position: 'absolute',
    right: -10,
    bottom: -15,
    resizeMode: 'contain'
  },

  // Language Horizontal Pills Slider Layout
  langContainer: {
    marginVertical: 14
  },
  langScrollGap: {
    gap: 8
  },
  langTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0E8CC'
  },
  langTagActive: {
    backgroundColor: '#2E6B2E',
    borderColor: '#2E6B2E'
  },
  langTagText: {
    fontSize: 12,
    color: '#4A6741',
    fontWeight: '600'
  },
  langTagActiveText: {
    color: '#fff',
    fontWeight: '700'
  },

  // Post Discussion Cards Panel
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  postHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  userAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5'
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3A1A'
  },
  userMetaLocation: {
    fontSize: 11,
    color: '#7A8B75',
    marginTop: 2
  },
  moreOptionsIcon: {
    fontSize: 18,
    color: '#7A8B75',
    paddingHorizontal: 4
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  postBodyText: {
    fontSize: 13,
    color: '#2C3E2B',
    lineHeight: 20,
    marginBottom: 12
  },
  postImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12
  },
  postAttachedImage: {
    width: '100%',
    height: 190,
    resizeMode: 'cover'
  },
  aiOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(14, 77, 32, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  aiOverlayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700'
  },
  postActionsFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 12,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4
  },
  actionBtnIcon: {
    fontSize: 13,
    color: '#4A6741',
    fontWeight: '600'
  },
  expertBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  expertBtnText: {
    fontSize: 13,
    color: '#2E6B2E',
    fontWeight: '800'
  },

  // Fallback Empty State
  emptyFeedBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16
  },
  emptyFeedText: {
    color: '#7A8B75',
    fontSize: 13,
    textAlign: 'center'
  },

  // Highlights Trending System List Row
  trendingContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16
  },
  trendingHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A3A1A',
    marginBottom: 6
  },
  trendingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  trendingItemThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 12
  },
  trendingTextContainer: {
    flex: 1
  },
  trendingItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A3A1A'
  },
  trendingItemSubtext: {
    fontSize: 11,
    color: '#7A8B75',
    marginTop: 3
  },

  // Absolut Bottom Center Sticky CTA Properties
  floatingAddBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#1A3A1A',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  floatingAddBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  }
})