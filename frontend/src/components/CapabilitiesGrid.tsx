import React, { useEffect, useRef, useState } from 'react';
import video from "../assets/video.mp4";
import {MEDIA_TYPE} from '../utils/constants.js'

// A reusable sub-component for each feature row
const FeatureBlock = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    // The Intersection Observer detects when the element enters the screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.2 } 
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div 
      ref={domRef} 
      className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center mb-32 lg:mb-48
        ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}
      `}
    >
      {/* Media Side - Conditionally renders Image or Video */}
      <div 
        className={`w-full md:w-1/2 transition-all duration-[1200ms] ease-out 
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        `}
      >
        <div className="overflow-hidden rounded-2xl bg-gray-200">
          {feature.type === 'video' ? (
            <video
              src={feature.src}
              autoPlay
              loop
              muted
              playsInline
              // Videos don't support native loading="lazy", but modern browsers 
              // handle their buffering intelligently when out of viewport.
              className="w-full h-[50vh] md:h-[70vh] object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out"
            />
          ) : (
            <img
              src={feature.src}
              alt={feature.title}
              loading="lazy" 
              className="w-full h-[50vh] md:h-[70vh] object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out"
            />
          )}
        </div>
      </div>

      {/* Text Side */}
      <div 
        className={`w-full md:w-1/2 flex flex-col justify-center transition-all duration-[1200ms] ease-out delay-200
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        `}
      >
        <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">
          {feature.category}
        </h3>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-black mb-6 leading-tight">
          {feature.title}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-8">
          {feature.description}
        </p>
        
        {/* Subtle animated underline link */}
        <div className="inline-block self-start">
          <a href="#learn-more" className="text-black font-semibold text-lg group flex items-center gap-2">
            Explore Technology
            <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
          <div className="h-0.5 w-full bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default function CapabilitiesGrid() {
  // Upgraded data structure to support 'type' and 'src' instead of just 'image'
  const features = [
    {
      type: MEDIA_TYPE.IMAGE,
      category: 'Material Science',
      title: 'Engineered for Zero Restriction.',
      description: 'Using advanced micro-woven synthetic blends, our garments adapt to your body’s natural mechanics. Experience complete freedom of movement without sacrificing structure or silhouette.',
      src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000',
    },
    {
      type: MEDIA_TYPE.VIDEO, // New video block
      category: 'Climate Control',
      title: 'Thermal Regulation Technology.',
      description: 'Phase-change materials woven directly into the inner lining absorb, store, and release heat for optimal thermal comfort. Stay perfectly insulated in the cold and actively cooled in the heat.',
      // I've put a sample placeholder video URL here so you can test it immediately
      src: video, 
    },
    {
      type: MEDIA_TYPE.IMAGE,
      category: 'Sustainability',
      title: 'Closed-Loop Manufacturing.',
      description: 'We believe the future of fashion is circular. 100% of our polyester is sourced from reclaimed ocean plastics, dramatically reducing our carbon footprint while cleaning global waterways.',
      src: 'https://www.tractorsupply.com/content/dam/tsc-aem-cms/category/shop-the-look-/clothing/outerwear---cold-weather/assets/Shop-The-Look-Tile-3.png',
    }
  ];

  return (
    <section className="w-full bg-zinc-50 pt-24 pb-32 px-6 md:px-12 lg:px-24">
      {/* Section Intro */}
      <div className="max-w-4xl mx-auto text-center mb-32">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black mb-6">
          The Architecture of Apparel.
        </h2>
        <p className="text-xl text-gray-600 font-light">
          Redefining the boundaries of modern clothing through relentless innovation, precision engineering, and uncompromising aesthetics.
        </p>
      </div>

      {/* The Alternating Grid */}
      <div className="max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <FeatureBlock key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}