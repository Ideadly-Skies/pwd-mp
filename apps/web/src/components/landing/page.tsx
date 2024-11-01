'use client'
import React from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CarouselSection from './carousel/page';
import CategoriesSection from './categories/page';
import TrendingEvents from './trending-events/page';

function LandingPage() {
  return (
    <>
        <CarouselSection/>
        <CategoriesSection/>
        <hr className="my-8 border-t border-gray-300" />
        <TrendingEvents/>
    </>
  )
}

export default LandingPage