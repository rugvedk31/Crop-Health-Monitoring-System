import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Image, StyleSheet, Platform } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useAuth } from '../context/AuthContext'

// Import the animated splash screen wrapper setup
import SplashScreen from '../screens/SplashScreen'

import PhoneScreen from '../screens/auth/PhoneScreen'
import OTPScreen from '../screens/auth/OTPScreen'
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen'
import HomeScreen from '../screens/HomeScreen'
import PredictScreen from '../screens/predict/PredictScreen'
import ResultScreen from '../screens/predict/ResultScreen'
import ChatScreen from '../screens/chat/ChatScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import CommunityScreen from '../screens/community/CommunityScreen'
import MarketScreen from '../screens/market/MarketScreen'

import 'react-native-gesture-handler'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Static asset mapping referencing local relative directories
const TAB_ICONS = {
  Home: {
    active: require('../assets/icons/Home.png'),
    inactive: require('../assets/icons/Home.png'),
  },
  Community: {
    active: require('../assets/icons/Community.png'),
    inactive: require('../assets/icons/Community.png'),
  },
  Market: {
    active: require('../assets/icons/Market.png'),
    inactive: require('../assets/icons/Market.png'),
  },
  Profile: {
    active: require('../assets/icons/Profile.png'),
    inactive: require('../assets/icons/Profile.png'),
  },
}

// Icon rendering layout wrapper component
function TabIcon({ name, focused }) {
  const iconSource = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive
  return (
    <Image 
      source={iconSource} 
      style={[
        styles.tabIconImage, 
        { tintColor: focused ? COLORS.primary : COLORS.textMuted }
      ]} 
    />
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // RESTORED: Standard flat layout footer design configuration
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: SIZES.xs,
          fontWeight: FONTS.semiBold,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Community" focused={focused} />,
          tabBarLabel: 'Community',
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Market" focused={focused} />,
          tabBarLabel: 'Market',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: 'Analysis Result',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: FONTS.bold },
        }}
      />
      <Stack.Screen
        name="Predict"
        component={PredictScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { farmer, loading } = useAuth()
  
  // Local toggle handling the transition away from the initial splash loop execution
  const [isSplashLoading, setIsSplashLoading] = useState(true)

  // 1. Prioritize displaying the full-screen branding splash block first
  if (isSplashLoading) {
    return <SplashScreen onAnimationComplete={() => setIsSplashLoading(false)} />
  }

  // 2. Fall back onto auth initialization loader state once splash fades out
  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Phone" component={PhoneScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  // 3. Mount standard verified application navigation workspace stacks
  return (
    <NavigationContainer>
      {farmer ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  }
})