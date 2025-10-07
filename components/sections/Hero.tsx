'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, MapPin, Star } from 'lucide-react';

const heroImages = [
  '/images/optimized/view/image00010-hero.webp',
  '/images/optimized/view/image00030-hero.webp',
  '/images/optimized/view/image00035-hero.webp',
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full overflow-hidden" style={{ height: '75vh' }}>
      {/* Background Images with Carousel */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Cielo Dorado - View ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient Overlay - Darker for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md px-6 py-3 rounded-full mb-8 animate-fade-in shadow-2xl border border-white/20">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
            <span className="text-base md:text-lg font-semibold text-white drop-shadow-lg">Premium Apartmán na Tenerife</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 animate-slide-up drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            Cielo Dorado
          </h1>

          {/* Subheading */}
          <p className="text-2xl md:text-4xl mb-8 animate-slide-up animation-delay-100 font-bold drop-shadow-2xl" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
            Váš dokonalý únik na Tenerife
          </p>



          {/* Address */}
          <div className="flex items-center justify-center space-x-3 mb-10 animate-slide-up animation-delay-300 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full inline-flex shadow-xl border border-white/20">
            <MapPin className="w-6 h-6 drop-shadow-lg" />
            <span className="text-lg font-semibold drop-shadow-lg">Los Gigantes, Puerto de Santiago, Tenerife</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up animation-delay-400">
            <button
              onClick={scrollToBooking}
              className="px-10 py-5 bg-gradient-to-r from-primary-blue to-primary-cyan text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-2 shadow-xl"
            >
              Rezervovat nyní
            </button>
            <button
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white/30 backdrop-blur-md text-white font-bold text-lg rounded-xl hover:bg-white/40 transition-all border-2 border-white/40 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Shlédnout galerii
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex items-center justify-center space-x-2 mt-12">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </section>
  );
}

