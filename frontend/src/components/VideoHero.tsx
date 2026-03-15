import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import video from '../assets/Video_Generation_Complete.mp4';

export default function MultiMediaHero() {
  const slides = [
    { 
      type: 'video', 
      src: video, 
      title: 'VISIONARY APPAREL.', 
      buttonText: 'Shop the Collection' 
    },
    { 
      type: 'image', 
      src: 'https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg?w=740', 
      title: 'THE FW26 LINEUP.', 
      buttonText: 'Explore Lookbook' 
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(1);
  
  // Dragging states
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 1. SCROLL ANIMATION
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fastScrollLimit = 300; 
      let progress = Math.min(scrollY / fastScrollLimit, 1);

      setScale(1 - (0.15 * progress));
      setBorderRadius(48 * progress);
      setContentOpacity(Math.max(1 - (progress * 2), 0));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. AUTO-PLAY
  useEffect(() => {
    if (isDragging) return; 

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isDragging, slides.length]);

  // 3. UNIFIED DRAG LOGIC (Works for both Mouse & Touch)
  const handleDragStart = (clientX) => {
    setHasInteracted(true); // Hide the "Swipe >>>" word
    setIsDragging(true);
    setDragStart(clientX);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const distance = clientX - dragStart;
    setDragOffset(distance);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (!dragStart) return;

    const swipeThreshold = 75; // px distance to trigger slide change

    if (dragOffset > swipeThreshold) {
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    } else if (dragOffset < -swipeThreshold) {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
    
    setDragOffset(0);
    setDragStart(null);
  };

  return (
    <section className="relative h-[95vh] md:h-[110vh] w-full bg-[#050614] select-none">
      <div className="sticky top-0 h-[95vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
        
        <div 
          className={`relative w-full h-full overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] origin-center bg-black ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out' 
          }}
          // Mobile Touch Events
          onTouchStart={(e) => handleDragStart(e.targetTouches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.targetTouches[0].clientX)}
          onTouchEnd={handleDragEnd}
          // Desktop Mouse Events
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd} // Stops drag if cursor leaves the box
        >
          {/* THE SLIDING TRACK */}
          <div 
            className={`flex h-full w-full ${isDragging ? '' : 'transition-transform duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]'}`}
            style={{ 
              transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` 
            }}
          >
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              const slideScale = isActive ? 1 : 0.85; 
              const slideOpacity = isActive ? 1 : 0.5;

              return (
                <div key={index} className="relative w-full h-full flex-shrink-0 overflow-hidden bg-black pointer-events-none">
                  <div 
                    className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]"
                    style={{ transform: `scale(${slideScale})`, opacity: slideOpacity }}
                  >
                    {slide.type === 'video' ? (
                      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={slide.src} type="video/mp4" />
                      </video>
                    ) : (
                      // Added draggable="false" to prevent desktop ghost-image dragging
                      <img src={slide.src} alt="" draggable="false" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/40 to-transparent z-10" />
                  </div>

                  <div 
                    className={`relative z-20 flex flex-col items-center justify-center h-full text-center px-6 transition-all duration-500 delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                    style={{ opacity: contentOpacity }}
                  >
                    <h1 className="text-4xl md:text-8xl font-bold tracking-tighter text-white mb-6 max-w-[90%] break-words leading-none">
                      {slide.title}
                    </h1>
                    {/* Re-enable pointer events just for the button so it can be clicked */}
                    <button className="px-8 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-2 active:scale-95 transition-transform hover:bg-gray-200 pointer-events-auto">
                      {slide.buttonText} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INDICATORS */}
          <div className="absolute bottom-10 left-0 w-full z-30 flex flex-col items-center gap-6 pointer-events-none">
            
            <div 
              className={`flex items-center gap-3 text-white/40 animate-pulse text-[10px] font-bold tracking-[0.3em] uppercase transition-opacity duration-500 ${hasInteracted ? 'opacity-0' : 'opacity-100'}`}
            >
               Swipe <span className="text-white">{'>>>'}</span>
            </div>
            
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 transition-all duration-500 rounded-full ${currentIndex === i ? 'w-10 bg-white' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}