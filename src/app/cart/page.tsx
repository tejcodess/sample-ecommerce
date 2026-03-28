'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import { useCartStore, useToastStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, getDiscount, getTotal, clearCart } = useCartStore();
  const { addToast } = useToastStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getTotal() >= 999 ? 0 : 99;
  const total = getTotal() + deliveryCharge - couponDiscount;

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    updateQuantity(productId, size, color, newQuantity);
    if (newQuantity > 0) {
      addToast('Cart updated', 'success');
    }
  };

  const handleRemove = (productId: string, size: string, color: string, name: string) => {
    removeItem(productId, size, color);
    addToast(`${name} removed from cart`, 'info');
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'F6FIRST') {
      const discountAmount = Math.min(getTotal() * 0.1, 500);
      setCouponDiscount(discountAmount);
      setAppliedCoupon(couponCode.toUpperCase());
      addToast('Coupon applied successfully!', 'success');
    } else if (couponCode.toUpperCase() === 'FASHION20') {
      const discountAmount = Math.min(getTotal() * 0.2, 1000);
      setCouponDiscount(discountAmount);
      setAppliedCoupon(couponCode.toUpperCase());
      addToast('Coupon applied successfully!', 'success');
    } else {
      addToast('Invalid coupon code', 'error');
    }
    setCouponCode('');
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      addToast('Your cart is empty', 'warning');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
              <Link href="/products">
                <Button size="lg">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      clearCart();
                      addToast('Cart cleared', 'info');
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Cart
                  </Button>
                </div>

                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="bg-white rounded-xl border p-4"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/product/${item.productId}`}>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-medium text-gray-900 hover:text-gray-600 line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                          <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                          </Badge>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemove(item.productId, item.size, item.color, item.name)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <Link 
                  href="/products" 
                  className="block w-full text-center py-2 px-4 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                  {/* Coupon Code */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                      <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponCode}>
                        Apply
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center justify-between mt-2 text-sm text-green-600">
                        <span>Coupon &quot;{appliedCoupon}&quot; applied</span>
                        <button
                          onClick={() => {
                            setCouponDiscount(0);
                            setAppliedCoupon(null);
                            addToast('Coupon removed', 'info');
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Try: F6FIRST (10% off) or FASHION20 (20% off)
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Price Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>-₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    {deliveryCharge > 0 && (
                      <p className="text-xs text-gray-500">
                        Add ₹{(999 - getTotal()).toLocaleString()} more for free delivery
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Inclusive of all taxes
                  </p>

                  <Button
                    size="lg"
                    className="w-full mt-6 bg-gray-900 hover:bg-gray-800"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Free Delivery Badge */}
                  {deliveryCharge === 0 && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-green-600">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">Free Delivery Applied</span>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <Truck className="w-4 h-4 text-gray-600" />
                      </div>
                      <p className="text-xs text-gray-500">Fast Delivery</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500">Secure Pay</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-1">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500">Easy Return</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
