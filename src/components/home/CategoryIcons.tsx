import Link from 'next/link';
import { categories } from '@/data/products';

export default function CategoryIcons() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="flex-shrink-0 flex flex-col items-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <span className="text-3xl md:text-4xl">{category.icon}</span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
              <span className="text-xs text-gray-400">{category.count} items</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
