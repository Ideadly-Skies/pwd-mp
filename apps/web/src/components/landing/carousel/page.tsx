'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaMapMarkerAlt } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';

function CarouselSection() {
  return (
    <div className="w-full py-4"> {/* Reduced padding */}
      <div className="container mx-auto px-2"> {/* Adjusted spacing */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={10} // Reduced spacing between slides
          slidesPerView={1}
        >
          {/* Slide 1: Things to Do in Indonesia */}
          <SwiperSlide>
            <div className="flex flex-col lg:flex-row items-center justify-between bg-[#1e0a3c] p-4 rounded-lg shadow-lg">
              <div className="text-left lg:w-1/2 lg:pl-6">
                <h1 className="text-5xl font-bold mb-2 text-[#fc86bc]">
                  THINGS TO DO
                  <span className="block text-4xl text-[#fff58c]">IN INDONESIA</span>
                </h1>
                <p className="text-lg text-[#fff]">
                  Welcome to Indonesia! Check out the latest events in town. Explore by location, trending searches, and more.
                </p>
              </div>
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <img
                  src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F36588159%2F108919755319%2F1%2Foriginal.jpg?auto=format%2Ccompress&q=75&sharp=10&s=c1c0edda02387a1e68d183a393ac63d4"
                  alt="Things to do in Indonesia"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2: Best Events in Jakarta */}
          <SwiperSlide>
            <div
              className="relative h-[400px] lg:h-[500px] rounded-lg bg-cover bg-center flex items-center"
              style={{
                backgroundImage:
                  "url('https://cdn.evbstatic.com/s3-build/fe/build/images/39ac4703250a1d0fb15911c2c5f10174-generic_1_desktop.webp')",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative z-10 p-8 text-white max-w-lg">
                <h1 className="text-4xl font-bold">Best events in</h1>
                <h2 className="text-5xl font-bold mb-4">Jakarta</h2>
                <p className="text-lg mb-6">
                  Looking for something to do in Jakarta? Explore by location, popular picks, and more.
                </p>
                <button className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-full text-white">
                  <FaMapMarkerAlt />
                  <span>Jakarta</span>
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3: Halloween Events */}
          <SwiperSlide>
            <div className="flex items-center justify-between bg-[#F05537] p-6 rounded-lg shadow-lg">
              <div className="text-center text-cream-200 max-w-md">
                <h1 className="text-6xl font-bold mb-2 text-[#FFE6BE]">Halloween Events</h1>
                <p className="text-lg text-[#1E0A3C]">in Jakarta Pusat</p>
              </div>
              <div className="w-1/2">
                <img
                  src="https://cdn.evbstatic.com/s3-build/fe/build/images/6cbef9471eb03be56f933efdbf6e8841-halloween_new.webp"
                  alt="Halloween Event Image"
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default CarouselSection;
