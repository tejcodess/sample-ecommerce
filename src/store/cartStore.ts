import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        );
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        });
      },
      
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getSubtotal: () => get().items.reduce((total, item) => total + item.originalPrice * item.quantity, 0),
      
      getDiscount: () => get().items.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0),
      
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'f6-cart-storage',
    }
  )
);
