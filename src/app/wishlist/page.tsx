'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import { useWishlistStore, useCartStore, useToastStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { addToast } = useToastStore();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      size: 'M', // Default size
      color: 'Default', // Default color
      quantity: 1,
    });
    removeItem(item.productId);
    addToast('Item moved to cart', 'success');
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
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
              <Link href="/products">
                <Button size="lg">Explore Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border overflow-hidden shadow-sm"
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.productId}`}>
                    <div className="relative aspect-[3/4] bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {item.discount}% OFF
                      </Badge>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-gray-600">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                      <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Move to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          removeItem(item.productId);
                          addToast('Removed from wishlist', 'info');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
