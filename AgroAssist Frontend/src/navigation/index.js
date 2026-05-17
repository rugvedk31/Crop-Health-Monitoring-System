import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, View, Platform } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useAuth } from '../context/AuthContext'

import PhoneScreen from '../screens/auth/PhoneScreen'
import OTPScreen from '../screens/auth/OTPScreen'
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen'
import HomeScreen from '../screens/HomeScreen'
import PredictScreen from '../screens/predict/PredictScreen'
import ResultScreen from '../screens/predict/ResultScreen'
import ChatScreen from '../screens/chat/ChatScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import 'react-native-gesture-handler'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Predict"
        component={PredictScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔬" focused={focused} />,
          tabBarLabel: 'Detect',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} />,
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
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
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { farmer, loading } = useAuth()

  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Phone" component={PhoneScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      {farmer ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}