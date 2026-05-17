import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { COLORS, SIZES, FONTS } from '../constants/theme'

export default function LoadingOverlay({ message }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={COLORS.primaryMid} />
        <Text style={styles.text}>{message || 'Please wait...'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  box: { backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', minWidth: 180 },
  text: { marginTop: 14, fontSize: SIZES.base, fontWeight: FONTS.medium, color: COLORS.textSecondary, textAlign: 'center' },
})
