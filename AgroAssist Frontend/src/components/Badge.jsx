import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SIZES, FONTS } from '../constants/theme'

export default function Badge({ label, type = 'default' }) {
  const bg = type === 'success' ? COLORS.successLight
    : type === 'warning' ? COLORS.warningLight
    : type === 'error' ? COLORS.errorLight
    : COLORS.surface

  const color = type === 'success' ? COLORS.success
    : type === 'warning' ? COLORS.warning
    : type === 'error' ? COLORS.error
    : COLORS.textSecondary

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round, alignSelf: 'flex-start' },
  text: { fontSize: SIZES.xs, fontWeight: FONTS.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
})
