import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Share, StatusBar, Platform
} from 'react-native'

export default function ResultScreen({ route, navigation }) {
  const { result = {}, imageUri } = route.params || {}
  const { disease, summary, analysis = {}, treatment_plan = {}, message } = result
  const isHealthy = disease?.name?.toLowerCase() === 'healthy'
  const confidence = disease?.confidence || 'N/A'

  const handleShare = async () => {
    try {
      await Share.share({
        message: `AgroAssist Report\nDisease: ${disease?.name || 'Unknown'}\nConfidence: ${confidence}\n\n${summary || ''}\n\nPowered by AgroAssist`,
      })
    } catch (e) {}
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />

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
      >
        {/* Crop Image */}
        {imageUri && (
          <View style={styles.imageWrap}>
            <Image source={{ uri: imageUri }} style={styles.cropImage} />
            {/* Disease Badge on image */}
            <View style={styles.diseaseBadge}>
              <Text style={styles.diseaseBadgeText}>{disease?.name || 'Result'}</Text>
            </View>
            {/* Confidence bar */}
            <View style={styles.confidenceBar}>
              <Text style={styles.confidenceLabel}>AI Confidence</Text>
              <View style={styles.confidenceTrack}>
                <View style={[styles.confidenceFill, {
                  width: `${parseFloat(confidence) * 100 || 90}%`,
                  backgroundColor: isHealthy ? '#4CAF50' : '#FF5722'
                }]} />
              </View>
            </View>
          </View>
        )}

        {/* Immediate Steps */}
        {treatment_plan?.immediate_steps?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚡</Text>
              <Text style={styles.sectionTitle}>Immediate Steps</Text>
            </View>
            {treatment_plan.immediate_steps.map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recommended Treatments */}
        {(treatment_plan?.fertilizers?.length > 0 || treatment_plan?.pesticides?.length > 0) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💊</Text>
              <Text style={styles.sectionTitle}>Recommended Treatments</Text>
            </View>
            {treatment_plan?.pesticides?.map((p, i) => (
              <View key={i} style={styles.treatmentItem}>
                <View style={styles.treatmentIconCircle}>
                  <Text style={styles.treatmentIcon}>🧪</Text>
                </View>
                <View style={styles.treatmentInfo}>
                  <Text style={styles.treatmentName}>{p.split('–')[0] || p}</Text>
                  <Text style={styles.treatmentDose}>{p.split('–')[1] || ''}</Text>
                </View>
                <TouchableOpacity style={styles.cartBtn}>
                  <Text style={styles.cartIcon}>🛒</Text>
                </TouchableOpacity>
              </View>
            ))}
            {treatment_plan?.fertilizers?.map((f, i) => (
              <View key={i} style={styles.treatmentItem}>
                <View style={styles.treatmentIconCircle}>
                  <Text style={styles.treatmentIcon}>🌱</Text>
                </View>
                <View style={styles.treatmentInfo}>
                  <Text style={styles.treatmentName}>{f.split('–')[0] || f}</Text>
                  <Text style={styles.treatmentDose}>{f.split('–')[1] || ''}</Text>
                </View>
                <TouchableOpacity style={styles.cartBtn}>
                  <Text style={styles.cartIcon}>🛒</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Prevention */}
        {treatment_plan?.prevention?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🛡</Text>
              <Text style={styles.sectionTitle}>Prevention Measures</Text>
            </View>
            {treatment_plan.prevention.map((p, i) => (
              <View key={i} style={styles.preventItem}>
                <Text style={styles.preventCheck}>✓</Text>
                <Text style={styles.preventText}>{p}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={styles.sectionTitle}>Summary</Text>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Follow up days */}
        {treatment_plan?.follow_up_days && (
          <View style={styles.followUpBanner}>
            <Text style={styles.followUpIcon}>📅</Text>
            <Text style={styles.followUpText}>
              Re-check your crop in{' '}
              <Text style={styles.followUpDays}>{treatment_plan.follow_up_days} days</Text>
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Text style={styles.shareBtnIcon}>↑</Text>
            <Text style={styles.shareBtnText}>Share Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.scanAgainBtn}
          >
            <Text style={styles.scanAgainIcon}>🔬</Text>
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={styles.chatBtn}
        >
          <Text style={styles.chatBtnText}>💬  Ask Follow-up Question</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF6EE' },
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

  // Image
  imageWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cropImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  diseaseBadge: {
    position: 'absolute',
    bottom: 52,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  diseaseBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  confidenceBar: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  confidenceLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  confidenceTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  confidenceFill: {
    height: 4,
    borderRadius: 2,
  },

  // Section
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A3A1A',
  },

  // Steps
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E6B2E',
  },
  stepContent: { flex: 1 },
  stepText: {
    fontSize: 13,
    color: '#2A4A2A',
    lineHeight: 20,
  },

  // Treatments
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FAF0',
  },
  treatmentIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treatmentIcon: { fontSize: 18 },
  treatmentInfo: { flex: 1 },
  treatmentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A3A1A',
  },
  treatmentDose: {
    fontSize: 11,
    color: '#4A6741',
    marginTop: 2,
  },
  cartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: { fontSize: 14 },

  // Prevention
  preventItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  preventCheck: {
    fontSize: 14,
    color: '#2E6B2E',
    fontWeight: '700',
    marginTop: 1,
  },
  preventText: {
    flex: 1,
    fontSize: 13,
    color: '#2A4A2A',
    lineHeight: 20,
  },

  // Summary
  summaryText: {
    fontSize: 13,
    color: '#2A4A2A',
    lineHeight: 20,
  },

  // Follow up
  followUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  followUpIcon: { fontSize: 20 },
  followUpText: { fontSize: 13, color: '#4A6741' },
  followUpDays: { fontWeight: '700', color: '#2E6B2E' },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#D0E8CC',
  },
  shareBtnIcon: { fontSize: 16, color: '#2E6B2E', fontWeight: '700' },
  shareBtnText: { fontSize: 14, fontWeight: '600', color: '#2E6B2E' },
  scanAgainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1A3A1A',
    borderRadius: 12,
    paddingVertical: 14,
  },
  scanAgainIcon: { fontSize: 16 },
  scanAgainText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  chatBtn: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  chatBtnText: { fontSize: 14, fontWeight: '600', color: '#2E6B2E' },
})