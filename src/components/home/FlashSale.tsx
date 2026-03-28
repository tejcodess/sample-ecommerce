'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flashlight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products, flashSaleEndTime } from '@/data/products';

// TimeBlock component moved outside render
function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 rounded-lg flex items-center justify-center">
        <span className="text-xl md:text-2xl font-bold text-white">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = flashSaleEndTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.discount >= 45).slice(0, 6);

  return (
    <section className="py-8 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Flashlight className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Flash Sale</h2>
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded animate-pulse">
              LIVE
            </span>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ends in:</span>
            <div className="flex gap-2">
              <TimeBlock value={timeLeft.hours} label="HRS" />
              <span className="text-2xl font-bold text-gray-900 self-start mt-3">:</span>
              <TimeBlock value={timeLeft.minutes} label="MIN" />
              <span className="text-2xl font-bold text-gray-900 self-start mt-3">:</span>
              <TimeBlock value={timeLeft.seconds} label="SEC" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-6">
          <Link href="/products?sale=true">
            <Button variant="outline" className="gap-2">
              View All Deals
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
