import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  tag?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export default function FeaturedProducts({
  title,
  subtitle,
  tag,
  showViewAll = true,
  viewAllLink = '/products',
}: FeaturedProductsProps) {
  let filteredProducts = products;
  
  if (tag === 'trending') {
    filteredProducts = products.filter((p) => p.tags.includes('trending'));
  } else if (tag === 'new') {
    filteredProducts = products.filter((p) => p.tags.includes('new'));
  } else if (tag === 'bestseller') {
    filteredProducts = products.filter((p) => p.tags.includes('bestseller'));
  } else {
    // Default: show a mix
    filteredProducts = products.slice(0, 8);
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link 
              href={viewAllLink}
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
