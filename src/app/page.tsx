'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryIcons from '@/components/home/CategoryIcons';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';
import BestSellingStores from '@/components/home/BestSellers';
import ToastContainer from '@/components/ToastContainer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <HeroBanner />
        <CategoryIcons />
        <FlashSale />
        <FeaturedProducts
          title="Today's Picks"
          subtitle="Handpicked styles just for you"
        />
        <PromoBanner />
        <FeaturedProducts
          title="Trending Now"
          subtitle="What everyone is wearing"
          tag="trending"
          viewAllLink="/products?tag=trending"
        />
        <BestSellingStores />
        <FeaturedProducts
          title="Best Sellers"
          subtitle="Our most loved pieces"
          tag="bestseller"
          viewAllLink="/products?tag=bestseller"
        />
      </main>
      
      <Footer />
      <ToastContainer />
    </div>
  );
}
