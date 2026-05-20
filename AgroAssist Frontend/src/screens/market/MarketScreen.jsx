import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Image,
  Dimensions,
  Alert,
  Modal,
  SafeAreaView
} from 'react-native'

const { width, height } = Dimensions.get('window')

const CATEGORIES = [
  { id: 'Seeds', image: 'https://images.unsplash.com/photo-1532467414647-9e38ec47db1a?w=100&auto=format&fit=crop&q=60', label: 'Seeds', bgColor: '#E8F5E9' },
  { id: 'Fertilizer', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=100&auto=format&fit=crop&q=60', label: 'Fertilizer', bgColor: '#FCE4EC' },
  { id: 'Tractors', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=100&auto=format&fit=crop&q=60', label: 'Tractors', bgColor: '#ECEFF1' },
  { id: 'Irrigation', image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=100&auto=format&fit=crop&q=60', label: 'Irrigation', bgColor: '#E0F2F1' },
]

const MASTER_PRODUCTS = [
  {
    id: 'prod_1',
    category: 'Seeds',
    name: 'Premium Sharbati Wheat Seeds (5kg)',
    price: 850,
    originalPrice: 1000,
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
    badge: '-15% OFF',
    badgeType: 'discount'
  },
  {
    id: 'prod_2',
    category: 'Fertilizer',
    name: 'EcoGro Liquid Nitrogen (1L)',
    price: 320,
    originalPrice: null,
    rating: 4.5,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&auto=format&fit=crop&q=80',
    badge: 'Govt Subsidy',
    badgeType: 'subsidy'
  }
]

export default function MarketScreen({ navigation }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // Interactive Cart Array State
  const [cartItems, setCartItems] = useState([
    { ...MASTER_PRODUCTS[0], quantity: 1 },
    { ...MASTER_PRODUCTS[1], quantity: 1 }
  ])
  const [isCartVisible, setIsCartVisible] = useState(false)

  // Dynamic Cart Counter & Financial Summary Calculations
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === product.id)
      if (existingIndex > -1) {
        const newItems = [...prevItems]
        newItems[existingIndex].quantity += 1
        return newItems
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
    Alert.alert('Added to Cart', `${product.name} added to your cart.`)
  }

  const updateQuantity = (id, amount) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const nextQuant = item.quantity + amount
          return nextQuant > 0 ? { ...item, quantity: nextQuant } : null
        }
        return item
      }).filter(Boolean)
    )
  }

  // Simple category and search filtering (No heavy extra modal tracking)
  const filteredProducts = MASTER_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCheckout = () => {
    setIsCartVisible(false)
    Alert.alert('Order Placed', `Order confirmed for ₹${totalCartPrice}!`)
    setCartItems([])
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#EFF6EE" barStyle="dark-content" />

      {/* Top Header Appbar */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.backArrowIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AgroAssist</Text>
        <TouchableOpacity onPress={() => Alert.alert('Notifications', 'No new updates.')} style={styles.iconButton}>
          <Text style={styles.topBellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Marketplace Identity & Cart Button */}
        <View style={styles.marketTitleRow}>
          <Text style={styles.marketMainTitle}>Agro Market</Text>
          <View style={styles.topRightControls}>
            <TouchableOpacity onPress={() => setIsCartVisible(true)} style={styles.cartFloatingBadgePill}>
              <Text style={styles.cartPillEmoji}>🛒</Text>
              <View style={styles.cartCountNotificationBadge}>
                <Text style={styles.cartCountBadgeText}>{totalCartCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Field Box */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchLeftIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search seeds, fertilizers, AI tools..."
            placeholderTextColor="#7A8B75"
            style={styles.searchInputInputField}
          />
          <TouchableOpacity onPress={() => Alert.alert('Voice Assistant', 'Listening...')} style={styles.micVoiceInputBtn}>
            <Text style={styles.micEmojiIcon}>🎙️</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Banner Card */}
        <View style={styles.promoBannerCard}>
          <View style={styles.bannerLeftInfoSegment}>
            <View style={styles.aiInsightTagPill}>
              <Text style={styles.aiInsightPillText}>✨ AI INSIGHT</Text>
            </View>
            <Text style={styles.bannerMainHeadingText}>Monsoon Prep{"\n"}Kit</Text>
            <Text style={styles.bannerContentDescription}>
              Curated seeds & protectants for upcoming heavy rains.
            </Text>
            <TouchableOpacity onPress={() => Alert.alert('Promo Offer', 'Opening monsoon highlights...')} style={styles.bannerActionBtn} activeOpacity={0.8}>
              <Text style={styles.bannerBtnLabelText}>Shop Now  ➔</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerRightImageWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400&auto=format&fit=crop&q=80' }}
              style={styles.bannerMainImageBackground}
            />
          </View>
        </View>

        {/* Categories Horizontal Grid */}
        <Text style={styles.sectionHeadingTitleText}>Shop by Category</Text>
        <View style={styles.categoriesFlexContainer}>
          {CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryNavigationCard} 
                onPress={() => setSelectedCategory(isCatActive ? null : cat.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.categoryImageContainerCircle, 
                  { backgroundColor: cat.bgColor },
                  isCatActive && styles.categoryImageActiveBorder
                ]}>
                  <Image source={{ uri: cat.image }} style={styles.categoryRoundThumbnail} />
                </View>
                <Text style={[styles.categoryItemLabelText, isCatActive && styles.categoryTextActiveBold]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Trending Areas section label row */}
        <View style={styles.trendsSectionHeaderRow}>
          <Text style={styles.sectionHeadingTitleText}>
            {selectedCategory ? `${selectedCategory} Results` : 'Trending in your Area'}
          </Text>
          {(selectedCategory || search !== '') && (
            <TouchableOpacity onPress={() => { setSelectedCategory(null); setSearch(''); }}>
              <Text style={styles.viewAllRedirectText}>Reset View</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Catalog Responsive Grid mapping system */}
        <View style={styles.productsDisplayGrid}>
          {filteredProducts.map(product => (
            <View key={product.id} style={styles.itemShowcaseCard}>
              <View style={styles.cardImageContainerHeader}>
                <Image source={{ uri: product.image }} style={styles.showcaseItemImage} />
                {product.badge && (
                  <View style={[
                    styles.absolutePromoTagPill,
                    { backgroundColor: product.badgeType === 'discount' ? '#FFCDD2' : '#C8E6C9' }
                  ]}>
                    <Text style={[
                      styles.promoPillText,
                      { color: product.badgeType === 'discount' ? '#C62828' : '#2E6B2E' }
                    ]}>
                      {product.badge}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.cardBottomInformationPayload}>
                <Text numberOfLines={2} style={styles.showcaseItemCommonName}>{product.name}</Text>
                
                <View style={styles.starRatingDisplayContainerRow}>
                  <Text style={styles.starEmojiVector}>⭐</Text>
                  <Text style={styles.numericRatingFieldText}>
                    {product.rating} <Text style={styles.totalReviewsCountLabel}>({product.reviews})</Text>
                  </Text>
                </View>

                <View style={styles.itemPricingContainerRow}>
                  <Text style={styles.activeListingPriceText}>₹{product.price}</Text>
                  {product.originalPrice && (
                    <Text style={styles.slashedOriginalPriceText}>₹{product.originalPrice}</Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.primaryCardActionBtn} 
                  onPress={() => handleAddToCart(product)} 
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnLabelText}>🛒 Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* AMAZON-STYLE SLIDE-UP SHOPPING CART MODAL */}
      <Modal visible={isCartVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.cartModalCard}>
            
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Shopping Cart ({totalCartCount} items)</Text>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsCartVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartItemsScrollView} showsVerticalScrollIndicator={false}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItemRow}>
                    <Image source={{ uri: item.image }} style={styles.cartItemThumb} />
                    <View style={styles.cartItemMetadata}>
                      <Text numberOfLines={2} style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPriceLabel}>₹{item.price} each</Text>
                      
                      <View style={styles.quantityControlRow}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityBtn}>
                          <Text style={styles.quantityBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityDisplayValue}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityBtn}>
                          <Text style={styles.quantityBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.cartItemFinalSumPrice}>₹{item.price * item.quantity}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCartBox}>
                  <Text style={styles.emptyCartEmoji}>🛒</Text>
                  <Text style={styles.emptyCartLabel}>Your cart is empty</Text>
                </View>
              )}
            </ScrollView>

            {cartItems.length > 0 && (
              <View style={styles.cartFooterSummaryPanel}>
                <View style={styles.summaryPriceRow}>
                  <Text style={styles.summaryLabelText}>Subtotal:</Text>
                  <Text style={styles.summaryValueText}>₹{totalCartPrice}</Text>
                </View>
                <View style={styles.summaryPriceRow}>
                  <Text style={styles.summaryLabelText}>Delivery:</Text>
                  <Text style={[styles.summaryValueText, { color: '#2E6B2E' }]}>FREE</Text>
                </View>
                <View style={[styles.summaryPriceRow, styles.totalPriceBorderGap]}>
                  <Text style={styles.grandTotalLabelText}>Grand Total:</Text>
                  <Text style={styles.grandTotalPriceValueText}>₹{totalCartPrice}</Text>
                </View>

                <TouchableOpacity style={styles.proceedCheckoutBtn} onPress={handleCheckout} activeOpacity={0.8}>
                  <Text style={styles.checkoutBtnLabelText}>Proceed to Buy ({totalCartCount} items)</Text>
                </TouchableOpacity>
              </View>
            )}

          </SafeAreaView>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF6EE' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32 },

  // AppBar Headers
  header: {
    backgroundColor: '#EFF6EE',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A3A1A', textAlign: 'center', flex: 1 },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrowIcon: { fontSize: 20, color: '#1A3A1A', fontWeight: '600' },
  topBellIcon: { fontSize: 18, color: '#1A3A1A' },

  // Dashboard Identifiers
  marketTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  marketMainTitle: { fontSize: 22, fontWeight: '800', color: '#1A3A1A' },
  topRightControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartFloatingBadgePill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1A3A1A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartPillEmoji: { fontSize: 18, color: '#fff' },
  cartCountNotificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53935',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EFF6EE',
  },
  cartCountBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  // Search Core Elements
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    elevation: 1,
    marginBottom: 20,
  },
  searchLeftIcon: { fontSize: 14, marginRight: 8, color: '#7A8B75' },
  searchInputInputField: { flex: 1, fontSize: 14, color: '#1A3A1A', paddingVertical: 0 },
  micVoiceInputBtn: { padding: 4 },
  micEmojiIcon: { fontSize: 16, color: '#1A3A1A' },

  // Campaign Banners Layout Block
  promoBannerCard: {
    backgroundColor: '#0E4D20',
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 180,
    marginBottom: 24,
    width: '100%',
  },
  bannerLeftInfoSegment: { flex: 1.2, padding: 16, justifyContent: 'center' },
  aiInsightTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  aiInsightPillText: { fontSize: 9, fontWeight: '700', color: '#FFF', letterSpacing: 0.5 },
  bannerMainHeadingText: { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 24, marginBottom: 6 },
  bannerContentDescription: { fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 15, marginBottom: 10 },
  bannerActionBtn: { backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  bannerBtnLabelText: { fontSize: 11, fontWeight: '700', color: '#0E4D20' },
  bannerRightImageWrapper: { flex: 0.8, height: '100%' },
  bannerMainImageBackground: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Categories Selector Stacks
  sectionHeadingTitleText: { fontSize: 16, fontWeight: '700', color: '#1A3A1A' },
  trendsSectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 14 },
  viewAllRedirectText: { fontSize: 12, fontWeight: '700', color: '#2E6B2E' },
  categoriesFlexContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  categoryNavigationCard: { alignItems: 'center', width: (width - 32) / 4.5 },
  categoryImageContainerCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    elevation: 1,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  categoryImageActiveBorder: { borderColor: '#2E6B2E', elevation: 3 },
  categoryRoundThumbnail: { width: 32, height: 32, resizeMode: 'contain', borderRadius: 8 },
  categoryItemLabelText: { fontSize: 11, fontWeight: '600', color: '#4A6741', textAlign: 'center' },
  categoryTextActiveBold: { color: '#1A3A1A', fontWeight: '800' },

  // Catalog Showcase Display Items Properties 
  productsDisplayGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' },
  itemShowcaseCard: { width: '48.5%', backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 14, elevation: 2 },
  cardImageContainerHeader: { width: '100%', height: 140, backgroundColor: '#F5F5F5', position: 'relative' },
  showcaseItemImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  absolutePromoTagPill: { position: 'absolute', top: 8, left: 8, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  promoPillText: { fontSize: 9, fontWeight: '700' },
  cardBottomInformationPayload: { padding: 12 },
  showcaseItemCommonName: { fontSize: 13, fontWeight: '700', color: '#1A3A1A', lineHeight: 18, minHeight: 36 },
  starRatingDisplayContainerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 6 },
  starEmojiVector: { fontSize: 11 },
  numericRatingFieldText: { fontSize: 11, fontWeight: '700', color: '#1A3A1A' },
  totalReviewsCountLabel: { fontWeight: '400', color: '#7A8B75' },
  itemPricingContainerRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 12 },
  activeListingPriceText: { fontSize: 16, fontWeight: '800', color: '#1A3A1A' },
  slashedOriginalPriceText: { fontSize: 11, color: '#7A8B75', textDecorationLine: 'line-through' },
  primaryCardActionBtn: { backgroundColor: '#98EE99', borderRadius: 12, width: '100%', paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  actionBtnLabelText: { color: '#0E4D20', fontSize: 13, fontWeight: '700' },
  emptyResultsWrapperBox: { width: '100%', padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyResultsTextLabel: { fontSize: 13, color: '#7A8B75', fontWeight: '500' },

  // Amazon-Style Overlay Sheet Styling
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  cartModalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: height * 0.85, minHeight: height * 0.5 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ECEFF1' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#1A3A1A' },
  closeModalBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', borderRadius: 16 },
  closeModalText: { fontSize: 12, color: '#555', fontWeight: '700' },
  cartItemsScrollView: { paddingHorizontal: 20, paddingVertical: 10 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  cartItemThumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F5F5F5', resizeMode: 'cover' },
  cartItemMetadata: { flex: 1, paddingHorizontal: 14 },
  cartItemName: { fontSize: 13, fontWeight: '700', color: '#1A3A1A', lineHeight: 18, marginBottom: 4 },
  cartItemPriceLabel: { fontSize: 12, color: '#7A8B75', marginBottom: 8 },
  quantityControlRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6EE', borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#D0E8CC' },
  quantityBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  quantityBtnText: { fontSize: 15, fontWeight: '700', color: '#1A3A1A' },
  quantityDisplayValue: { fontSize: 13, fontWeight: '700', color: '#1A3A1A', paddingHorizontal: 4 },
  cartItemFinalSumPrice: { fontSize: 15, fontWeight: '800', color: '#1A3A1A' },
  emptyCartBox: { alignItems: 'center', justifyRules: 'center', paddingVertical: 60, alignItems: 'center' },
  emptyCartEmoji: { fontSize: 44, marginBottom: 12 },
  emptyCartLabel: { fontSize: 14, color: '#7A8B75', fontWeight: '500' },
  cartFooterSummaryPanel: { borderTopWidth: 1, borderTopColor: '#ECEFF1', padding: 20, backgroundColor: '#FAFDF9' },
  summaryPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabelText: { fontSize: 13, color: '#4A6741' },
  summaryValueText: { fontSize: 13, fontWeight: '600', color: '#1A3A1A' },
  totalPriceBorderGap: { borderTopWidth: 1, borderTopColor: '#ECEFF1', paddingTop: 10, marginTop: 4, marginBottom: 18 },
  grandTotalLabelText: { fontSize: 15, fontWeight: '700', color: '#1A3A1A' },
  grandTotalPriceValueText: { fontSize: 18, fontWeight: '800', color: '#C62828' },
  proceedCheckoutBtn: { backgroundColor: '#1A3A1A', borderRadius: 14, width: '100%', paddingVertical: 14, alignItems: 'center', justifyContext: 'center' },
  checkoutBtnLabelText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})