import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Platform, TextInput
} from 'react-native'

const CATEGORIES = [
  { icon: '🌱', label: 'Seeds' },
  { icon: '💊', label: 'Pesticides' },
  { icon: '🌿', label: 'Fertilizers' },
  { icon: '🚜', label: 'Equipment' },
  { icon: '💧', label: 'Irrigation' },
  { icon: '📦', label: 'All' },
]

const PRODUCTS = [
  { id: '1', name: 'Carbendazim 50% WP', category: 'Pesticides', price: '₹320', unit: '250g', rating: 4.5, icon: '🧪', badge: 'Best Seller' },
  { id: '2', name: 'DAP Fertilizer', category: 'Fertilizers', price: '₹1,200', unit: '50kg', rating: 4.8, icon: '🌿', badge: 'Popular' },
  { id: '3', name: 'Sugarcane Seeds', category: 'Seeds', price: '₹850', unit: '1kg', rating: 4.3, icon: '🎋', badge: null },
  { id: '4', name: 'Drip Irrigation Kit', category: 'Irrigation', price: '₹4,500', unit: 'set', rating: 4.6, icon: '💧', badge: 'New' },
  { id: '5', name: 'Neem Oil Extract', category: 'Pesticides', price: '₹280', unit: '1L', rating: 4.4, icon: '🌾', badge: 'Organic' },
  { id: '6', name: 'Potassium Sulfate', category: 'Fertilizers', price: '₹650', unit: '25kg', rating: 4.2, icon: '🌿', badge: null },
]

export default function MarketScreen({ navigation }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState([])

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    return matchSearch && matchCat
  })

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#1A3A1A" barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <View>
          <Text style={styles.headerTitle}>AgroMarket</Text>
          <Text style={styles.headerSub}>Quality farm inputs delivered</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search seeds, fertilizers..."
            placeholderTextColor="#A5C8A5"
            style={styles.searchInput}
          />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTag}>Special Offer</Text>
            <Text style={styles.bannerTitle}>Get 20% off on{'\n'}all Pesticides</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Shop Now →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>🌾</Text>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveCategory(cat.label)}
              style={[styles.catBtn, activeCategory === cat.label && styles.catBtnActive]}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catLabel, activeCategory === cat.label && styles.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <Text style={styles.sectionTitle}>
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </Text>
        <View style={styles.productsGrid}>
          {filtered.map(product => (
            <View key={product.id} style={styles.productCard}>
              {product.badge && (
                <View style={styles.productBadge}>
                  <Text style={styles.productBadgeText}>{product.badge}</Text>
                </View>
              )}
              <View style={styles.productIconCircle}>
                <Text style={styles.productIcon}>{product.icon}</Text>
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productUnit}>{product.unit}</Text>
              <View style={styles.productRating}>
                <Text style={styles.productRatingStar}>⭐</Text>
                <Text style={styles.productRatingText}>{product.rating}</Text>
              </View>
              <View style={styles.productBottom}>
                <Text style={styles.productPrice}>{product.price}</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF6EE' },
  header: {
    backgroundColor: '#1A3A1A',
    paddingHorizontal: 18, paddingBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  cartBtn: { position: 'relative', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  cartIcon: { fontSize: 24 },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#76C442', alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: 18, paddingBottom: 40 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#D0E8CC',
    gap: 8, marginBottom: 16,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A3A1A' },
  banner: {
    backgroundColor: '#2E6B2E', borderRadius: 20,
    padding: 20, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  bannerLeft: { flex: 1 },
  bannerTag: {
    backgroundColor: '#76C442', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 8,
    fontSize: 11, color: '#fff', fontWeight: '700',
  },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 24, marginBottom: 14 },
  bannerBtn: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start',
  },
  bannerBtnText: { fontSize: 13, fontWeight: '700', color: '#2E6B2E' },
  bannerEmoji: { fontSize: 60 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A3A1A', marginBottom: 12 },
  catScroll: { gap: 10, paddingRight: 4, marginBottom: 20 },
  catBtn: {
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#D0E8CC', gap: 4,
  },
  catBtnActive: { backgroundColor: '#1A3A1A', borderColor: '#1A3A1A' },
  catIcon: { fontSize: 20 },
  catLabel: { fontSize: 11, fontWeight: '600', color: '#4A6741' },
  catLabelActive: { color: '#fff' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: {
    width: '47%', backgroundColor: '#fff',
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#E8F5E9',
    position: 'relative',
  },
  productBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: '#76C442', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  productBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  productIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  productIcon: { fontSize: 24 },
  productName: { fontSize: 13, fontWeight: '600', color: '#1A3A1A', marginBottom: 2, lineHeight: 18 },
  productUnit: { fontSize: 11, color: '#4A6741', marginBottom: 6 },
  productRating: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  productRatingStar: { fontSize: 11 },
  productRatingText: { fontSize: 11, color: '#4A6741', fontWeight: '500' },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#1A3A1A' },
  addBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#2E6B2E',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 18, color: '#fff', fontWeight: '700', lineHeight: 22 },
})