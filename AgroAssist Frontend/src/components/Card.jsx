import React from 'react'
import { View, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SHADOWS } from '../constants/theme'

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, SHADOWS.medium, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
})
