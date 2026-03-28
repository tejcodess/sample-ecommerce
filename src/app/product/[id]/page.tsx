'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/product/ProductCard';
import ToastContainer from '@/components/ToastContainer';
import { products, reviews } from '@/data/products';
import { useCartStore, useWishlistStore, useToastStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const product = products.find((p) => p.id === productId);
  
  // Initialize state with product defaults using useMemo
  const defaultSize = product?.sizes[0] || '';
  const defaultColor = product?.colors[0]?.name || '';
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  
  const inWishlist = product ? isInWishlist(product.id) : false;
  
  // Get product reviews
  const productReviews = reviews.filter((r) => r.productId === productId);
  
  // Get related products
  const relatedProducts = product
    ? products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <Link href="/products">
              <Button className="mt-4">Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      addToast('Please select size and color', 'warning');
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    
    addToast('Item added to cart!', 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
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

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900">Products</Link>
            <span>/</span>
            <Link 
              href={`/products?category=${product.category}`} 
              className="hover:text-gray-900 capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-300 ${
                      isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.discount >= 40 && (
                      <Badge className="bg-red-500">{product.discount}% OFF</Badge>
                    )}
                    {product.tags.includes('new') && (
                      <Badge className="bg-green-500">NEW</Badge>
                    )}
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? 'border-gray-900' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                {/* Brand */}
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </p>
                
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-green-600 text-white text-sm px-2 py-1 rounded">
                    <span>{product.rating}</span>
                    <Star className="w-4 h-4 ml-1 fill-current" />
                  </div>
                  <span className="text-gray-500">{product.reviewCount} Reviews</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-green-600">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-lg text-green-600 font-medium">{product.discount}% off</span>
                </div>
                
                {/* Tax info */}
                <p className="text-sm text-gray-500">inclusive of all taxes</p>
                
                <Separator />
                
                {/* Color Selection */}
                <div>
                  <p className="font-medium text-gray-900 mb-2">Color: <span className="text-gray-600">{selectedColor}</span></p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor === color.name
                            ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className={`w-5 h-5 ${color.hex === '#FFFFFF' ? 'text-gray-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">Size</p>
                    <button className="text-sm text-gray-500 underline">Size Guide</button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity */}
                <div>
                  <p className="font-medium text-gray-900 mb-2">Quantity</p>
                  <div className="flex items-center border rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-gray-900 hover:bg-gray-800"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-gray-900 text-gray-900 hover:bg-gray-100"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>
                
                {/* Wishlist & Share */}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className={`flex-1 gap-2 ${inWishlist ? 'text-red-500' : ''}`}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                  <Button variant="ghost" className="gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </Button>
                </div>
                
                {/* Delivery Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Free Delivery</p>
                      <p className="text-sm text-gray-500">On orders above ₹999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-500">7 days return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-500">100% secure checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-t">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start border-b bg-transparent rounded-none p-0">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
                  >
                    Reviews ({productReviews.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="specifications"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
                  >
                    Specifications
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="p-6">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </TabsContent>
                
                <TabsContent value="reviews" className="p-6">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900">{product.rating}</p>
                      <div className="flex text-yellow-400 my-1">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <p className="text-sm text-gray-500">{product.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-6">{star}★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{
                                width: `${
                                  (productReviews.filter((r) => r.rating === star).length /
                                    productReviews.length) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {productReviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex text-yellow-400 text-sm">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                              </div>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="specifications" className="p-6">
                  <table className="w-full">
                    <tbody>
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="py-3 px-4 font-medium text-gray-900 w-1/3">
                            {spec.label}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
