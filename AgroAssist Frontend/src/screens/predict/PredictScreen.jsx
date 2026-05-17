import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Alert, StatusBar, Platform,
  TextInput, ActivityIndicator
} from 'react-native'
import { predictDisease } from '../../services/api'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'

const PLANTS = [
  { label: 'Sugarcane', value: 'sugarcane', icon: '🌿' },
  { label: 'Tomato', value: null, icon: '🍅' },
  { label: 'Wheat', value: null, icon: '🌾' },
]

const LANGUAGES = [
  { label: 'EN', value: 'english' },
  { label: 'मराठी', value: 'marathi' },
  { label: 'हिंदी', value: 'hindi' },
]

export default function PredictScreen({ navigation }) {
  const [image, setImage] = useState(null)
  const [plant, setPlant] = useState('sugarcane')
  const [language, setLanguage] = useState('english')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
      if (res.didCancel) return
      if (res.assets?.[0]) setImage(res.assets[0])
    })
  }

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
      if (res.didCancel) return
      if (res.assets?.[0]) setImage(res.assets[0])
    })
  }

  const handleAnalyze = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or take a photo of your crop')
      return
    }
    setLoading(true)
    try {
      const res = await predictDisease(image.uri, plant, query || 'Analyze this crop image', language)
      if (res.success !== false) {
        navigation.navigate('Result', { result: res, imageUri: image.uri })
      } else {
        Alert.alert('Analysis Failed', res.message || 'Please try again with a clearer image')
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Title + Language */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.pageTitle}>Crop Disease{'\n'}Detection</Text>
          </View>
          <View style={styles.langRow}>
            {LANGUAGES.map((l, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setLanguage(l.value)}
                style={[styles.langBtn, language === l.value && styles.langBtnActive]}
              >
                <Text style={[styles.langText, language === l.value && styles.langTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upload Box */}
        <View style={styles.uploadBox}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIconCircle}>
                <Text style={styles.uploadIconEmoji}>🌿</Text>
              </View>
              <Text style={styles.uploadTitle}>Upload Leaf Photo</Text>
              <Text style={styles.uploadSubtitle}>
                For accurate AI analysis, ensure good{'\n'}lighting and clearly focus on the affected area.
              </Text>
            </View>
          )}
        </View>

        {/* Camera / Gallery */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
            <Text style={styles.cameraBtnIcon}>📷</Text>
            <Text style={styles.cameraBtnText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery}>
            <Text style={styles.galleryBtnIcon}>🖼</Text>
            <Text style={styles.galleryBtnText}>Gallery</Text>
          </TouchableOpacity>
          {image && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => setImage(null)}>
              <Text style={styles.galleryBtnIcon}>🗑</Text>
              <Text style={styles.galleryBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Crop Type */}
        <Text style={styles.sectionLabel}>Identify Crop Type</Text>
        <View style={styles.cropRow}>
          {PLANTS.map((p, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => p.value && setPlant(p.value)}
              disabled={!p.value}
              style={[
                styles.cropBtn,
                plant === p.value && styles.cropBtnActive,
                !p.value && styles.cropBtnDisabled,
              ]}
            >
              <Text style={styles.cropBtnIcon}>{p.icon}</Text>
              <Text style={[styles.cropBtnText, plant === p.value && styles.cropBtnTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Symptoms */}
        <Text style={styles.sectionLabel}>Describe crop symptoms... (Optional)</Text>
        <View style={styles.textAreaWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="e.g., Yellowing edges on lower leaves, small brown spots spreading quickly."
            placeholderTextColor="#A5C8A5"
            multiline
            numberOfLines={4}
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading}
          style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.analyzeBtnIcon}>🔬</Text>
              <Text style={styles.analyzeBtnText}>Analyze Crop</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EFF6EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#EFF6EE',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D0E8CC',
  },
  backIcon: { fontSize: 18, color: '#1A3A1A', fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A3A1A' },
  notifBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D0E8CC',
  },
  notifIcon: { fontSize: 16 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 40 },

  // Title Row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    marginTop: 4,
  },
  titleLeft: { flex: 1 },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A3A1A',
    lineHeight: 30,
  },
  langRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0E8CC',
    backgroundColor: '#fff',
  },
  langBtnActive: {
    backgroundColor: '#2E6B2E',
    borderColor: '#2E6B2E',
  },
  langText: { fontSize: 11, fontWeight: '600', color: '#4A6741' },
  langTextActive: { color: '#fff' },

  // Upload Box
  uploadBox: {
    backgroundColor: '#F0FAF0',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    padding: 24,
  },
  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIconEmoji: { fontSize: 28 },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A3A1A',
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#4A6741',
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  cameraBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2E6B2E',
    borderRadius: 12,
    paddingVertical: 12,
  },
  cameraBtnIcon: { fontSize: 16 },
  cameraBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  galleryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D0E8CC',
  },
  clearBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  galleryBtnIcon: { fontSize: 16 },
  galleryBtnText: { fontSize: 13, fontWeight: '600', color: '#1A3A1A' },

  // Crop Type
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A3A1A',
    marginBottom: 10,
  },
  cropRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  cropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D0E8CC',
    backgroundColor: '#fff',
  },
  cropBtnActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E6B2E',
  },
  cropBtnDisabled: { opacity: 0.4 },
  cropBtnIcon: { fontSize: 14 },
  cropBtnText: { fontSize: 13, fontWeight: '500', color: '#4A6741' },
  cropBtnTextActive: { color: '#2E6B2E', fontWeight: '700' },

  // Text Area
  textAreaWrap: {
    backgroundColor: '#F0FAF0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0E8CC',
    marginBottom: 20,
    padding: 12,
  },
  textArea: {
    fontSize: 14,
    color: '#1A3A1A',
    minHeight: 80,
  },

  // Analyze Button
  analyzeBtn: {
    backgroundColor: '#1A3A1A',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeBtnDisabled: { opacity: 0.6 },
  analyzeBtnIcon: { fontSize: 18 },
  analyzeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
})