'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/product/ProductCard';
import ToastContainer from '@/components/ToastContainer';
import { products, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal, Grid, List } from 'lucide-react';

// FilterContent component moved outside
interface FilterContentProps {
  categories: typeof categories;
  allSizes: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  selectedSizes: string[];
  handleSizeToggle: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  clearAllFilters: () => void;
}

function FilterContent({
  categories,
  allSizes,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedSizes,
  handleSizeToggle,
  minRating,
  setMinRating,
  clearAllFilters,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategory === cat.id}
                onCheckedChange={(checked) => {
                  setSelectedCategory(checked ? cat.id : '');
                }}
              />
              <Label htmlFor={`cat-${cat.id}`} className="flex items-center gap-2 cursor-pointer">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={15000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${
                selectedSizes.includes(size)
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => {
                  setMinRating(checked ? rating : 0);
                }}
              />
              <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                <span className="text-yellow-500">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                <span className="text-gray-500 text-sm">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearAllFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  
  // Get initial filters from URL
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialTag = searchParams.get('tag') || '';
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get all available sizes
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
    return Array.from(sizes).sort();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Popularity - by review count
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedTag, priceRange, selectedSizes, minRating, sortBy]);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setPriceRange([0, 15000]);
    setSelectedSizes([]);
    setMinRating(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || 'Products'
                : 'All Products'}
            </span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name
                  : selectedTag === 'trending'
                  ? 'Trending Products'
                  : selectedTag === 'new'
                  ? 'New Arrivals'
                  : selectedTag === 'bestseller'
                  ? 'Best Sellers'
                  : 'All Products'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent
                      categories={categories}
                      allSizes={allSizes}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      selectedSizes={selectedSizes}
                      handleSizeToggle={handleSizeToggle}
                      minRating={minRating}
                      setMinRating={setMinRating}
                      clearAllFilters={clearAllFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden md:flex items-center border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border p-6 sticky top-24">
                <FilterContent
                  categories={categories}
                  allSizes={allSizes}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedSizes={selectedSizes}
                  handleSizeToggle={handleSizeToggle}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border p-12 text-center">
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearAllFilters} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
