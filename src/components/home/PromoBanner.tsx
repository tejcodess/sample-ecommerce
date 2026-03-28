import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Banner */}
          <Link href="/products?category=tshirts" className="group block relative h-48 md:h-64 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800"
              alt="T-Shirt Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6">
              <span className="text-white/80 text-sm">Limited Edition</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mt-1">
                T-Shirt Collection
              </h3>
              <p className="text-white/90 mt-2">Starting from ₹499</p>
              <span className="w-fit mt-4 px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Right Banner */}
          <Link href="/products?category=shoes" className="group block relative h-48 md:h-64 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800"
              alt="Footwear Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6">
              <span className="text-white/80 text-sm">New Arrivals</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mt-1">
                Premium Footwear
              </h3>
              <p className="text-white/90 mt-2">Up to 50% OFF</p>
              <span className="w-fit mt-4 px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                Explore
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
