import React, { useState } from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, RADIUS, SIZES, FONTS, SHADOWS } from '../constants/theme'

export default function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, error, icon, style, inputStyle }) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.container,
        focused && styles.focused,
        error && styles.errorBorder,
        SHADOWS.small,
      ]}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, inputStyle]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: SIZES.sm, fontWeight: FONTS.semiBold, color: COLORS.textSecondary, marginBottom: 6 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  focused: { borderColor: COLORS.primaryMid, backgroundColor: '#FAFFFE' },
  errorBorder: { borderColor: COLORS.error },
  iconWrap: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: SIZES.base, color: COLORS.textPrimary },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 18 },
  errorText: { color: COLORS.error, fontSize: SIZES.sm, marginTop: 4 },
})
