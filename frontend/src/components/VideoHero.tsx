import React, { useState, useEffect } from 'react';
import video from "../assets/video.mp4";
import {MEDIA_TYPE} from '../utils/constants.js'
export default function MultiMediaHero() {
  const slides = [
    {
      type: MEDIA_TYPE.VIDEO,
      src: video, 
      title: 'VISIONARY APPAREL.',
      subtitle: 'Engineered for the future. Experience the next generation of streetwear.',
      buttonText: 'Shop the Collection'
    },
    {
      type: MEDIA_TYPE.IMAGE,
      src: 'https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg?semt=ais_rp_progressive&w=740&q=80',
      title: 'THE FW26 LINEUP.',
      subtitle: 'High-performance fabrics meet modern, minimalist design.',
      buttonText: 'Explore Lookbook'
    },
    {
      type:MEDIA_TYPE.IMAGE,
      src: 'https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg',
      title: 'BUILT TO MOVE.',
      subtitle: 'Breathable, sustainable, and crafted for maximum mobility.',
      buttonText: 'Discover Tech'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0);

  // Auto-play timer
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 6000); 
      // Added currentIndex to the dependency array below. 
      // This resets the 6-second countdown whenever the user manually clicks "Next"!
      return () => clearInterval(timer);
    }
  }, [slides.length, currentIndex]); 

  // Scroll-to-shrink animation (Zero-scroll effect)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const minScale = 0.8; 
      const maxRadius = 40; 

      let progress = scrollY / windowHeight;
      if (progress > 1) progress = 1;
      if (progress < 0) progress = 0;

      const currentScale = 1 - ((1 - minScale) * progress);
      const currentRadius = maxRadius * progress;

      setScale(currentScale);
      setBorderRadius(currentRadius);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[150vh] w-full bg-zinc-50">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* The Animated Window */}
        <div 
          className="relative w-full h-full overflow-hidden shadow-2xl origin-center bg-black"
          style={{ 
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out' 
          }}
        >
          
          {/* Mapping through Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
                ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
              `}
            >
              
              {/* Conditional Media Rendering */}
              {slide.type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={slide.src} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-black/40 z-10"></div>

              {/* Specific Text for this Slide */}
              <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter mb-6 drop-shadow-md">
                  {slide.title}
                </h1>
                
                <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-200 mb-10 font-light drop-shadow-md">
                  {slide.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-black text-sm md:text-base font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300 pointer-events-auto">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots (Bottom center) */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full 
                  ${index === currentIndex 
                    ? 'w-8 h-1.5 bg-white' 
                    : 'w-2 h-1.5 bg-white/50 hover:bg-white/80' 
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* NEW: Next Slide Button (Bottom Right) */}
          <button 
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)}
            className="absolute bottom-10 right-6 md:right-12 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 pointer-events-auto"
            aria-label="Next Slide"
          >
            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
        </div>
      </div>
    </section>
  );
}