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
  Platform
} from 'react-native'

// Mock Data Arrays matching your UI design
const LANGUAGES = ['English', 'मराठी (Marathi)', 'हिन्दी (Hindi)']

const TRENDING_ISSUES = [
  {
    id: '1',
    title: 'Pink Bollworm in Cotton - Early Stage Control',
    icon: '🐛',
    discussing: '1.2k discussing'
  },
  {
    id: '2',
    title: 'Monsoon Prep: Soil Drainage Techniques',
    icon: '💧',
    discussing: '850 discussing'
  }
]

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLang, setSelectedLang] = useState('English')

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />
      
      {/* Search Header Wrapper */}
      <View style={styles.searchHeaderContainer}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>AgroAssist</Text>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherText}>🌤 28°C Pune</Text>
          </View>
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

      {/* Main Page Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Farmer Community 🌱</Text>

        {/* 1. Connect Card Banner */}
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
            source={{ uri: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=300&auto=format&fit=crop' }} 
            style={styles.bannerImage}
          />
        </View>

        {/* 2. Language Filter Tags Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.langScrollGap}
          style={styles.langContainer}
        >
          {LANGUAGES.map((lang, index) => {
            const isSelected = selectedLang === lang
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedLang(lang)}
                style={[styles.langTag, isSelected && styles.langTagActive]}
              >
                <Text style={[styles.langTagText, isSelected && styles.langTagTextActive]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* 3. Community Post Component */}
        <View style={styles.postCard}>
          {/* User Meta Details */}
          <View style={styles.postHeaderRow}>
            <View style={styles.userInfoCol}>
              <View style={styles.userAvatarCircle}>
                <Text style={styles.avatarEmoji}>👨🏽‍🌾</Text>
              </View>
              <View>
                <Text style={styles.userName}>Ramesh P.</Text>
                <Text style={styles.userMetaLocation}>Pune, Maharashtra • 2 hours ago</Text>
              </View>
            </View>
            <TouchableOpacity><Text style={styles.moreOptionsIcon}>⋮</Text></TouchableOpacity>
          </View>

          {/* Issue Tags */}
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.statusBadgeText, { color: '#2E6B2E' }]}>Wheat</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.statusBadgeText, { color: '#E65100' }]}>⚠️ Disease Suspected</Text>
            </View>
          </View>

          {/* Message text */}
          <Text style={styles.postBodyText}>
            My wheat leaves are turning yellow from the tips, and there are small brown spots appearing. The soil is slightly damp. Has anyone faced this recently?
          </Text>

          {/* Attached Crop Image Layout */}
          <View style={styles.postImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=500&auto=format&fit=crop' }}
              style={styles.postAttachedImage}
            />
            <View style={styles.aiOverlayBadge}>
              <Text style={styles.aiOverlayText}>🔬 AI Scanned: High Probability Rust</Text>
            </View>
          </View>

          {/* Interactive Actions Grid */}
          <View style={styles.postActionsFooter}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnIcon}>👍 24</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnIcon}>💬 8 Replies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.expertBtn}>
              <Text style={styles.expertBtnText}>👨‍⚕️ Ask Experts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Trending Issues List Grid */}
        <View style={styles.trendingContainer}>
          <Text style={styles.trendingHeaderTitle}>📈 Trending Issues</Text>
          {TRENDING_ISSUES.map((issue) => (
            <View key={issue.id} style={styles.trendingListItem}>
              <View style={styles.trendingItemIconBg}>
                <Text style={styles.trendingItemIcon}>{issue.icon}</Text>
              </View>
              <View style={styles.trendingTextContainer}>
                <Text numberOfLines={1} style={styles.trendingItemTitle}>{issue.title}</Text>
                <Text style={styles.trendingItemSubtext}>{issue.discussing}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 5. Live Audio Discussion Card */}
        <View style={styles.voiceRoomsCard}>
          <View style={styles.voiceIconContainer}>
            <Text style={styles.voiceIconEmoji}>🎙️</Text>
          </View>
          <Text style={styles.voiceTitleText}>Voice Rooms Live</Text>
          <Text style={styles.voiceSubtitleText}>
            Join active voice discussions in your regional language. Currently 3 rooms active.
          </Text>
          <TouchableOpacity style={styles.voiceOutlineBtn} activeOpacity={0.8}>
            <Text style={styles.voiceOutlineBtnText}>Explore Rooms</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 6. Centered Absolute Floating Action Button */}
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
    paddingBottom: 110 // Safeguards components from overlapping behind the floating CTA block
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3A1A',
    marginVertical: 14
  },

  // Search Top Header Wrapper Layout
  searchHeaderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9'
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E6B2E'
  },
  weatherBadge: {
    backgroundColor: '#EFF6EE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12
  },
  weatherText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A3A1A'
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
    fontSize: 14
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A3A1A',
    paddingVertical: 0
  },

  // Informative Promo Panel Display
  bannerCard: {
    backgroundColor: '#1A3A1A',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 150
  },
  bannerLeft: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2
  },
  bannerHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
    marginBottom: 6
  },
  bannerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
    marginBottom: 14
  },
  bannerBtn: {
    backgroundColor: '#2E6B2E',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  bannerImage: {
    width: 110,
    height: '110%',
    borderRadius: 12,
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    bottom: -10
  },

  // Lang Picker Row Layout
  langContainer: {
    marginVertical: 14
  },
  langScrollGap: {
    gap: 8
  },
  langTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
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
    fontWeight: '500'
  },
  langTagTextActive: {
    color: '#fff',
    fontWeight: '600'
  },

  // Interactive Message Thread Blocks
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
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
    gap: 10
  },
  userAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE082',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarEmoji: {
    fontSize: 18
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3A1A'
  },
  userMetaLocation: {
    fontSize: 11,
    color: 'gray',
    marginTop: 1
  },
  moreOptionsIcon: {
    fontSize: 18,
    color: 'gray',
    paddingHorizontal: 4
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  postBodyText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 19,
    marginBottom: 12
  },
  postImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12
  },
  postAttachedImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F5F5'
  },
  aiOverlayBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(26, 58, 26, 0.85)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  aiOverlayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
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
    paddingHorizontal: 6
  },
  actionBtnIcon: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500'
  },
  expertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  expertBtnText: {
    fontSize: 12,
    color: '#2E6B2E',
    fontWeight: '700'
  },

  // Highlights Trending Columns
  trendingContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  trendingHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3A1A',
    marginBottom: 12
  },
  trendingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  trendingItemIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  trendingItemIcon: {
    fontSize: 16
  },
  trendingTextContainer: {
    flex: 1
  },
  trendingItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A3A1A'
  },
  trendingItemSubtext: {
    fontSize: 11,
    color: 'gray',
    marginTop: 2
  },

  // Streaming Channels Panel Block Layout
  voiceRoomsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9'
  },
  voiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  voiceIconEmoji: {
    fontSize: 22
  },
  voiceTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A3A1A',
    marginBottom: 6
  },
  voiceSubtitleText: {
    fontSize: 12,
    color: '#4A6741',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 10
  },
  voiceOutlineBtn: {
    borderWidth: 1,
    borderColor: '#2E6B2E',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  voiceOutlineBtnText: {
    color: '#2E6B2E',
    fontSize: 12,
    fontWeight: '700'
  },

  // Bottom Center Trigger Button Properties
  floatingAddBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#1A3A1A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  floatingAddBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  }
})