import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Region = 'RO' | 'EU'

export interface CartItem {
  id: string
  productId: string
  variantId: string
  productName: string
  sku: string
  attributes: Record<string, any>
  price: number         // Current active price (based on region)
  priceRO: number       // Romania price
  priceEU: number | null // EU price (null = use RO price)
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
