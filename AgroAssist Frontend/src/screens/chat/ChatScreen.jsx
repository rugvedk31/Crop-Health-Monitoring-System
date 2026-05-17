import React, { useState, useRef, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, StatusBar, Image
} from 'react-native'
import { sendChatMessage } from '../../services/api'

const QUICK_QUESTIONS = [
  'Why leaves turning yellow?',
  'Best fertilizer?',
  'How to treat red rot?',
  'Pest control tips?',
]

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const formatDate = (date) => {
  const today = new Date()
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  return date.toLocaleDateString()
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: "Hello! I'm your AgroAssist Advisor. The weather today is partly cloudy with a 20% chance of rain later this evening. How can I help you with your crops today?",
      time: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const flatListRef = useRef(null)

  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [messages])

  const handleSend = async (text) => {
    const msgText = text || input.trim()
    if (!msgText) return
    setInput('')
    const userMsg = { id: Date.now().toString(), role: 'user', text: msgText, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await sendChatMessage(msgText, null, 'english', sessionId)
      if (res.session_id) setSessionId(res.session_id)
      const botText = res.message || res.summary || res.follow_up_question || 'I could not process that. Please try again.'
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: botText,
        treatment: res.treatment_plan,
        time: new Date(),
      }])
    } catch (e) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Network error. Please check your connection.',
        time: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === 'user'
    const showDate = index === 0
    return (
      <>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.time)}</Text>
          </View>
        )}
        <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
          {!isUser && (
            <View style={styles.botAvatar}>
              <Text style={styles.botAvatarEmoji}>🌿</Text>
            </View>
          )}
          <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
            <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
              {item.text}
            </Text>
            <Text style={[styles.timeText, isUser && styles.timeTextUser]}>
              {formatTime(item.time)}
            </Text>
          </View>
        </View>
      </>
    )
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#1A3A1A" barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AgroAssist</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Advisor Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingRow}>
                <View style={styles.botAvatar}>
                  <Text style={styles.botAvatarEmoji}>🌿</Text>
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color="#2E6B2E" />
                  <Text style={styles.typingText}>AgroAssist is typing...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Questions */}
        <View style={styles.quickRow}>
          <FlatList
            data={QUICK_QUESTIONS}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSend(item)} style={styles.quickChip}>
                <Text style={styles.quickChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask AgroAssist..."
            placeholderTextColor="#A5C8A5"
            style={styles.textInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.attachBtn}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          >
            <Text style={styles.sendIcon}>▶</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F0' },
  flex: { flex: 1 },

  // Header
  header: {
    backgroundColor: '#1A3A1A',
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: '#fff', fontWeight: '600' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#76C442',
  },
  onlineText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  notifBtn: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  notifIcon: { fontSize: 18 },

  // Messages
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    gap: 8,
  },
  msgRowUser: { flexDirection: 'row-reverse' },
  botAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#C8E6C9',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  botAvatarEmoji: { fontSize: 16 },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    padding: 12,
    paddingBottom: 8,
  },
  bubbleBot: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  bubbleUser: {
    backgroundColor: '#2E6B2E',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 21,
  },
  bubbleTextUser: { color: '#fff' },
  timeText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  timeTextUser: { color: 'rgba(255,255,255,0.7)' },

  // Typing
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  typingText: { fontSize: 12, color: '#888' },

  // Quick Questions
  quickRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  quickList: {
    paddingHorizontal: 14,
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  quickChipText: {
    fontSize: 12,
    color: '#2E6B2E',
    fontWeight: '500',
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3A1A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#2A4A2A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
  },
  attachBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  attachIcon: { fontSize: 18 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#76C442',
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#3A5A3A' },
  sendIcon: { color: '#fff', fontSize: 16, fontWeight: '700' },
})