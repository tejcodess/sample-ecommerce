'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  ChevronDown,
  MapPin,
  LogOut,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { categories } from '@/data/products';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { getTotalItems } = useCartStore();
  const { getTotalItems: getWishlistCount } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const cartCount = getTotalItems();
  const wishlistCount = getWishlistCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Rajamahendravaram, AP</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>📞 0883 295 6642</span>
            <span>Free Shipping on orders above ₹999</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">F6</span>
              <span className="text-[10px] text-gray-500 -mt-1">The Fashion Store</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border-gray-200 rounded-l-lg focus:ring-2 focus:ring-gray-900"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none bg-gray-900 hover:bg-gray-800"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/products?category=${category.id}`} className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-md">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gray-900">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md">
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gray-900">
                  {cartCount}
                </Badge>
              )}
            </Link>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-10"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>

                  {/* User Section */}
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Login / Signup</Button>
                    </Link>
                  )}

                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-700">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="/orders" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link 
                      href="/wishlist" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <Badge className="ml-auto">{wishlistCount}</Badge>
                      )}
                    </Link>
                    {isAuthenticated && (
                      <button
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-red-500 text-left"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search - Below */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}
