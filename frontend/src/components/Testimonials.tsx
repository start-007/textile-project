import React, { useState, useEffect, useRef } from 'react';

export default function TestimonialSlider() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Montgomery",
      tag: "Verified Buyer",
      icon: "✨",
      quote: "The architecture of these garments is next level. Perfect fit, insanely comfortable, and the thermal regulation is exactly as advertised. 10/10.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Marcus Chen",
      tag: "Loyal Customer",
      icon: "⚡",
      quote: "I've replaced my entire winter lineup with the AeroShell and Core Puffer. It's ridiculous how lightweight yet incredibly warm this gear is.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Elena Rostova",
      tag: "Early Adopter",
      icon: "💎",
      quote: "Thank you so much guys, got this delivered just 48 hours after ordering it! The premium organic fabric feels phenomenal to the touch.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 4,
      name: "David Park",
      tag: "Tech Wear Fanatic",
      icon: "🛡️",
      quote: "The water resistance on the cargo pants is unbelievable. I got caught in a downpour and the water just beaded right off. Absolute magic.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 5,
      name: "Aisha Jenkins",
      tag: "Verified Buyer",
      icon: "🔥",
      quote: "Finally, a brand that understands mobility. The stretch in these fabrics allows for full range of motion without losing its structured silhouette.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  // Swipe Tracking
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1 < testimonials.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : testimonials.length - 1));
  };

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // Changes slide every 5 seconds
    return () => clearInterval(timer);
  }, [activeIndex]); // Reset timer on manual swipe

  // Touch Handlers for Mobile Swiping
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    if (Math.abs(dragStartX.current - e.clientX) > 10) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    const SWIPE_THRESHOLD = 50; 

    if (diff > SWIPE_THRESHOLD) handleNext(); 
    else if (diff < -SWIPE_THRESHOLD) handlePrev(); 

    dragStartX.current = null;
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const handlePointerLeave = () => { dragStartX.current = null; };

  // Scroll visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={domRef} className="relative w-full bg-black py-20 overflow-hidden font-sans">
      
      {/* Background Starry/Glow Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] left-[20%] w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_12px_2px_#67e8f9] opacity-60 animate-pulse" />
        <div className="absolute bottom-[30%] right-[25%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_15px_3px_#c084fc] opacity-70 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center">
        
        {/* Massive Glass Wrapper */}
        <div className={`w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl transition-all duration-[1200ms] ease-out flex flex-col items-center
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-95'}
        `}>
            
            {/* Section Heading */}
            <div className="text-center mb-16">
              <span className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4 inline-block">
                  Verified Reviews
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Customer Intel
              </h2>
              <p className="text-zinc-400 font-medium max-w-xl mx-auto text-sm md:text-base">
                Real performance data and reviews from those who wear our gear in the field. Swipe to view reports.
              </p>
            </div>

            {/* 3D Perspective Slider Container */}
            <div 
              className="relative w-full h-[400px] flex justify-center items-center perspective-[1500px] touch-pan-y select-none cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerLeave}
            >
              {testimonials.map((testimonial, index) => {
                const offset = index - activeIndex;
                
                // Calculate Mobile & Desktop 3D transforms
                let wrapperTransform = '';
                let wrapperZIndex = 0;
                let overlayOpacity = '';

                if (offset === 0) {
                  wrapperTransform = 'translateX(0%) scale(1) rotateY(0deg)';
                  wrapperZIndex = 30;
                  overlayOpacity = 'opacity-0';
                } else if (offset === -1) {
                  wrapperTransform = 'translateX(-85%) scale(0.85) rotateY(20deg)';
                  wrapperZIndex = 20;
                  overlayOpacity = 'opacity-60'; 
                } else if (offset === 1) {
                  wrapperTransform = 'translateX(85%) scale(0.85) rotateY(-20deg)';
                  wrapperZIndex = 20;
                  overlayOpacity = 'opacity-60'; 
                } else if (offset === -2) {
                  wrapperTransform = 'translateX(-150%) scale(0.65) rotateY(35deg)';
                  wrapperZIndex = 10;
                  overlayOpacity = 'opacity-85';
                } else if (offset === 2) {
                  wrapperTransform = 'translateX(150%) scale(0.65) rotateY(-35deg)';
                  wrapperZIndex = 10;
                  overlayOpacity = 'opacity-85';
                } else {
                  wrapperTransform = `translateX(${offset < 0 ? '-200%' : '200%'}) scale(0.5) rotateY(0deg)`;
                  wrapperZIndex = 0;
                  overlayOpacity = 'opacity-100';
                }

                const isActive = offset === 0;

                return (
                  <div
                    key={testimonial.id}
                    onClick={() => {
                      if (isDragging.current) return;
                      if (offset === -1) handlePrev();
                      if (offset === 1) handleNext();
                    }}
                    className="absolute w-[90%] sm:w-[65%] md:w-[420px] h-[350px] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ 
                      transform: wrapperTransform, 
                      zIndex: wrapperZIndex,
                      pointerEvents: Math.abs(offset) <= 1 ? 'auto' : 'none' 
                    }}
                  >
                    {/* The Card Itself */}
                    <div 
                      className={`relative w-full h-full flex flex-col p-8 rounded-[2.5rem] overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group
                        ${isActive 
                          ? 'border border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.2),inset_0_0_20px_rgba(6,182,212,0.1)] bg-zinc-900 backdrop-blur-xl' 
                          : 'border border-white/10 shadow-2xl bg-black/80 backdrop-blur-sm'
                        }
                      `}
                    >
                      {/* Subtle Background Grid */}
                      <div 
                        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-20' : 'opacity-5'}`}
                        style={{
                          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                          backgroundSize: '24px 24px'
                        }}
                      />

                      {/* Top Circuit Node Area */}
                      <div className="relative w-full h-20 flex items-center justify-center mb-6">
                        <div className={`absolute left-0 w-[40%] h-[1px] transition-colors duration-700 ${isActive ? 'bg-gradient-to-r from-transparent via-white/20 to-cyan-400/80' : 'bg-gradient-to-r from-transparent to-white/20'}`} />
                        <div className={`absolute right-0 w-[40%] h-[1px] transition-colors duration-700 ${isActive ? 'bg-gradient-to-l from-transparent via-white/20 to-cyan-400/80' : 'bg-gradient-to-l from-transparent to-white/20'}`} />
                        
                        <div className={`absolute left-[15%] w-1 h-1 rounded-full transition-all ${isActive ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`} />
                        <div className={`absolute right-[15%] w-1 h-1 rounded-full transition-all ${isActive ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`} />

                        <div className={`relative z-10 w-16 h-16 rounded-2xl bg-black border p-1.5 flex items-center justify-center transition-all duration-700 ${isActive ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.8)]'}`}>
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover opacity-90" />
                          </div>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col items-center text-center relative z-10 flex-grow">
                        <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                          <span className="text-sm">{testimonial.icon}</span> {testimonial.tag}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                          {testimonial.name}
                        </h3>
                        <p className={`text-sm font-medium leading-relaxed flex-grow transition-colors duration-500 ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          "{testimonial.quote}"
                        </p>

                        {/* Stars */}
                        <div className="flex gap-1 mt-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 transition-colors duration-500 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Dark Overlay for inactive cards */}
                      <div className={`absolute inset-0 bg-black transition-opacity duration-[800ms] pointer-events-none ${overlayOpacity}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot Pagination */}
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`transition-all duration-500 rounded-full h-1.5 
                    ${idx === activeIndex ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40'}
                  `}
                />
              ))}
            </div>

        </div>
      </div>
    </section>
  );
}