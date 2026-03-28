import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const stores = [
  {
    id: 1,
    name: 'F6 Originals',
    description: 'Premium quality basics',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    rating: 4.8,
    products: 156,
  },
  {
    id: 2,
    name: 'Street Style',
    description: 'Urban fashion essentials',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    rating: 4.6,
    products: 89,
  },
  {
    id: 3,
    name: 'Classic Wear',
    description: 'Timeless formal collection',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    rating: 4.7,
    products: 124,
  },
  {
    id: 4,
    name: 'Urban Steps',
    description: 'Trendy footwear',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400',
    rating: 4.5,
    products: 67,
  },
];

export default function BestSellingStores() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Best Selling Stores</h2>
            <p className="text-gray-500 text-sm mt-1">Shop from top rated sellers</p>
          </div>
          <Link 
            href="/products"
            className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/products?brand=${encodeURIComponent(store.name)}`}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Store Image */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <h3 className="text-white font-semibold">{store.name}</h3>
                  </div>
                </div>
                
                {/* Store Info */}
                <div className="p-3">
                  <p className="text-sm text-gray-500">{store.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-600">
                      ⭐ {store.rating} Rating
                    </span>
                    <span className="text-gray-500">
                      {store.products} Products
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
