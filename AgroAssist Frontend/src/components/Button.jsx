import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native'
import { COLORS, RADIUS, FONTS, SIZES, SHADOWS } from '../constants/theme'

export default function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style, textStyle }) {
  const isOutline = variant === 'outline'
  const isDanger = variant === 'danger'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isOutline ? styles.outline : isDanger ? styles.danger : styles.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : '#fff'} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[
            styles.text,
            isOutline ? styles.textOutline : styles.textSolid,
            textStyle,
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: COLORS.primaryMid },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primaryMid },
  danger: { backgroundColor: COLORS.error },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: 8 },
  text: { fontSize: SIZES.base, fontWeight: FONTS.semiBold },
  textSolid: { color: '#fff' },
  textOutline: { color: COLORS.primaryMid },
})
