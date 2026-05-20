import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar
} from 'react-native'

export default function SplashScreen({ onAnimationComplete }) {
  const fadeAnim = useRef(new Animated.Value(1)).current // Initial opacity is 1

  useEffect(() => {
    // Hold splash screen visible for 2 seconds, then fade out over 500ms
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete() // Pass control back to the App Navigator router
        }
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [fadeAnim])

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />
      
      {/* Central Content Container */}
      <View style={styles.centerContainer}>
        <View style={styles.logoShadowWrapper}>
          <Image 
            source={require('../assets/icons/Logo.png')} 
            style={styles.logoImage} 
          />
        </View>
        <Text style={styles.brandTitleText}>AgroAssist</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject, // Covers the entire viewport absolute grid layer
    backgroundColor: '#EFF6EE',       // Matches your light sage green app theme background exactly
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,                     // Forces splash screen to sit completely on top of navigation bars during load
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,                     // Gives that soft clean circular lift off the background on Android
    borderRadius: 60,
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  brandTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0E4D20',                 // Your signature rich deep forest green brand color
    letterSpacing: 0.5,
  },
})