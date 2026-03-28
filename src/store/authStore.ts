import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
  }[];
  address: Address;
  paymentMethod: string;
  deliveryOption: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, phone?: string) => boolean;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

// Mock users database
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'demo@f6fashion.com',
    password: 'demo123',
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@f6fashion.com',
      phone: '9876543210',
      addresses: [
        {
          id: '1',
          name: 'Demo User',
          phone: '9876543210',
          addressLine1: '123, Main Street',
          addressLine2: 'Near City Center',
          city: 'Rajamahendravaram',
          state: 'Andhra Pradesh',
          pincode: '533103',
          isDefault: true,
        },
      ],
    },
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      isAuthenticated: false,
      
      login: (email, password) => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          set({ user: foundUser.user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      signup: (name, email, password, phone) => {
        const exists = mockUsers.find((u) => u.email === email);
        if (exists) return false;
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          phone,
          addresses: [],
        };
        
        mockUsers.push({ email, password, user: newUser });
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      addAddress: (address) => {
        const user = get().user;
        if (!user) return;
        
        const newAddress: Address = {
          ...address,
          id: Date.now().toString(),
        };
        
        if (address.isDefault) {
          user.addresses.forEach((a) => (a.isDefault = false));
        }
        
        set({
          user: {
            ...user,
            addresses: [...user.addresses, newAddress],
          },
        });
      },
      
      updateAddress: (id, addressUpdate) => {
        const user = get().user;
        if (!user) return;
        
        if (addressUpdate.isDefault) {
          user.addresses.forEach((a) => (a.isDefault = false));
        }
        
        set({
          user: {
            ...user,
            addresses: user.addresses.map((a) =>
              a.id === id ? { ...a, ...addressUpdate } : a
            ),
          },
        });
      },
      
      removeAddress: (id) => {
        const user = get().user;
        if (!user) return;
        
        set({
          user: {
            ...user,
            addresses: user.addresses.filter((a) => a.id !== id),
          },
        });
      },
      
      setDefaultAddress: (id) => {
        const user = get().user;
        if (!user) return;
        
        set({
          user: {
            ...user,
            addresses: user.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
          },
        });
      },
      
      addOrder: (order) => {
        set({ orders: [...get().orders, order] });
      },
      
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        });
      },
    }),
    {
      name: 'f6-auth-storage',
    }
  )
);
