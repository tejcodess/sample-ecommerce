import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const exists = items.find((i) => i.productId === item.productId);
        
        if (!exists) {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },
      
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
      
      clearWishlist: () => set({ items: [] }),
      
      getTotalItems: () => get().items.length,
    }),
    {
      name: 'f6-wishlist-storage',
    }
  )
);
