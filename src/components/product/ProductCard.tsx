'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useWishlistStore, useToastStore } from '@/store';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  
  const inWishlist = isInWishlist(product.id);
  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: product.sizes[0],
      color: product.colors[0].name,
      quantity: 1,
    });
    
    addToast('Item added to cart!', 'success');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.images[0],
        rating: product.rating,
      });
      addToast('Added to wishlist!', 'success');
    }
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Product Image */}
        <img
          src={currentImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount >= 40 && (
            <Badge className="bg-red-500 hover:bg-red-600">
              {product.discount}% OFF
            </Badge>
          )}
          {product.tags.includes('new') && (
            <Badge className="bg-green-500 hover:bg-green-600">NEW</Badge>
          )}
          {product.tags.includes('bestseller') && (
            <Badge className="bg-orange-500 hover:bg-orange-600">BESTSELLER</Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-all flex items-center justify-center shadow-sm ${
            inWishlist ? 'text-red-500' : 'text-gray-500'
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Quick Actions - Show on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-white/90 border-0"
              onClick={handleViewProduct}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        
        {/* Name */}
        <h3 className="font-medium text-gray-900 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
            <span>{product.rating}</span>
            <Star className="w-3 h-3 ml-0.5 fill-current" />
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          <span className="text-sm text-green-600 font-medium">{product.discount}% off</span>
        </div>
        
        {/* Sizes */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="text-xs px-2 py-0.5 border border-gray-200 rounded text-gray-600"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}
