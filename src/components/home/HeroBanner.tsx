'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 50% OFF',
    description: 'On all trending styles',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    cta: 'Shop Now',
    link: '/products',
    gradient: 'from-gray-900/70 to-transparent',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh Styles',
    description: 'Just landed in store',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920',
    cta: 'Explore',
    link: '/products?tag=new',
    gradient: 'from-purple-900/70 to-transparent',
  },
  {
    id: 3,
    title: 'Limited Time Offer',
    subtitle: 'Flash Sale',
    description: 'Ends in 24 hours',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920',
    cta: 'Grab Now',
    link: '/products',
    gradient: 'from-red-900/70 to-transparent',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-lg text-white">
              <p className="text-lg md:text-xl font-medium mb-2 animate-fade-in">
                {banner.subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                {banner.title}
              </h1>
              <p className="text-lg md:text-xl mb-6 opacity-90 animate-fade-in">
                {banner.description}
              </p>
              <Link 
                href={banner.link}
                className="inline-block px-6 py-3 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                {banner.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
