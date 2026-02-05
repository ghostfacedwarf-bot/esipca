import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Region = 'RO' | 'EU'

// ============ REGION STORE ============
interface RegionStore {
  region: Region
  isLoading: boolean
  setRegion: (region: Region) => void
  setLoading: (loading: boolean) => void
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set) => ({
      region: 'RO',
      isLoading: true,
      setRegion: (region) => set({ region }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'esipca-region',
      onRehydrateStorage: () => (state) => {
        // When store is rehydrated from localStorage, set loading to false
        if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)

// Helper function to get regional price
export function getRegionalPrice(priceRO: number, priceEU: number | null | undefined, region: Region): number {
  if (region === 'EU' && priceEU != null) {
    return priceEU
  }
  // For EU without priceEU, double the RO price
  if (region === 'EU') {
    return priceRO * 2
  }
  return priceRO
}

// ============ CART STORE ============

export interface CartItem {
  id: string
  productId: string
  variantId: string
  productName: string
  sku: string
  imageUrl?: string     // Product image URL
  attributes: Record<string, any>
  price: number         // Current active price (based on region)
  priceRO: number       // Romania price
  priceEU: number | null // EU price (null = use RO price)
  pricePerMeter?: number // Base price per meter (for display)
  doubleSidedSurcharge?: number // Surcharge per piece for double-sided paint
  quantity: number
  priceType: string
  region: Region        // Region when item was added
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  recalculatePrices: (region: Region) => void
}

// ============ COMPARATOR STORE ============

export interface CompareProduct {
  id: string
  slug: string
  name: string
  priceFrom: number
  priceType: string
  specs: Record<string, any> | null
  category?: { name: string }
  media?: { url: string }[]
}

interface ComparatorStore {
  products: CompareProduct[]
  addProduct: (product: CompareProduct) => boolean
  removeProduct: (productId: string) => void
  clearAll: () => void
  isInComparison: (productId: string) => boolean
  canAdd: () => boolean
}

export const useComparator = create<ComparatorStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const state = get()
        if (state.products.length >= 2) return false
        if (state.products.some(p => p.id === product.id)) return false
        set({ products: [...state.products, product] })
        return true
      },
      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter(p => p.id !== productId)
        }))
      },
      clearAll: () => {
        set({ products: [] })
      },
      isInComparison: (productId) => {
        return get().products.some(p => p.id === productId)
      },
      canAdd: () => {
        return get().products.length < 2
      }
    }),
    {
      name: 'product-comparator',
    }
  )
)

// ============ CART STORE ============

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id
          )
          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }))
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      recalculatePrices: (region: Region) => {
        set((state) => ({
          items: state.items.map((item) => ({
            ...item,
            price: region === 'EU' && item.priceEU != null ? item.priceEU : item.priceRO,
            region,
          })),
        }))
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
)
