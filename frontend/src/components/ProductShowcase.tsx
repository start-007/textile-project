import React, { useState, useEffect, useRef } from 'react';

export default function ProductShowcase() {
  const products = [
    {
      id: 1,
      type: 'video', 
      src: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 
      shortName: 'AeroShell',
      title: 'AeroShell Outerwear',
      description: 'Ultra-lightweight, completely waterproof outerwear designed for unpredictable urban environments. Precision engineered for maximum breathability.',
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=1200',
      shortName: 'TechKnit',
      title: 'TechKnit Joggers',
      description: 'Seamless construction meets thermal regulation. The ultimate everyday performance bottom capable of adapting to micro-climates.',
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
      shortName: 'Core Puffer',
      title: 'Core Puffer Vest',
      description: 'A highly compressible, synthetic-down vest that locks in core heat without restricting arm mobility. Built for layering.',
    },
    {
      id: 4,
      type: 'video', 
      src: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 
      shortName: 'Merino Base',
      title: 'Merino Base Layer',
      description: 'Naturally antimicrobial and moisture-wicking. The absolute foundation of any technical wardrobe, sourced sustainably.',
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1200',
      shortName: 'Utility Cargo',
      title: 'Utility Cargo Pants',
      description: 'Reinforced knees, articulated seams, and hidden waterproof zip pockets for uncompromising utility and clean silhouettes.',
    }
  ];

  const [activeIndex, setActiveIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  // Swipe & Drag Tracking Refs
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1 < products.length ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  // --- Pointer Event Handlers for Swipe/Drag ---
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 10) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    
    const diff = dragStartX.current - e.clientX;
    const SWIPE_THRESHOLD = 50; 

    if (diff > SWIPE_THRESHOLD) {
      handleNext(); 
    } else if (diff < -SWIPE_THRESHOLD) {
      handlePrev(); 
    }

    dragStartX.current = null;
    
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handlePointerLeave = () => {
    dragStartX.current = null;
  };

  // Intersection Observer for scroll animations
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

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={domRef} 
      className="w-full bg-[#FAFAFA] pt-20 pb-24 overflow-hidden flex flex-col items-center font-sans"
    >
      
      {/* Top Heading */}
      <div 
        className={`text-center mb-12 px-4 transition-all duration-[1200ms] ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
        `}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-black leading-tight">
          Advancing apparel design,<br/> in service of movement
        </h2>
      </div>

      {/* The Perspective Container */}
      <div 
        /* UPDATED: Increased base height on mobile (h-[400px]) to accommodate taller cards */
        className={`relative w-full h-[400px] sm:h-[350px] md:h-[450px] flex justify-center items-center perspective-[1500px] transition-all duration-[1200ms] ease-out delay-200
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}
          touch-pan-y select-none cursor-grab active:cursor-grabbing
        `}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        {products.map((product, index) => {
          const offset = index - activeIndex;
          
          let wrapperTransform = '';
          let wrapperZIndex = 0;
          let isClickable = false;
          let cardRotate = '';
          let overlayOpacity = '';

          if (offset === 0) {
            wrapperTransform = 'translateX(0%) scale(1)';
            wrapperZIndex = 30;
            cardRotate = 'rotateY(0deg)';
            overlayOpacity = 'opacity-0';
          } else if (offset === -1) {
            wrapperTransform = 'translateX(-65%) scale(0.85)';
            wrapperZIndex = 20;
            cardRotate = 'rotateY(30deg)';
            overlayOpacity = 'opacity-50';
            isClickable = true;
          } else if (offset === 1) {
            wrapperTransform = 'translateX(65%) scale(0.85)';
            wrapperZIndex = 20;
            cardRotate = 'rotateY(-30deg)';
            overlayOpacity = 'opacity-50';
            isClickable = true;
          } else if (offset === -2) {
            wrapperTransform = 'translateX(-120%) scale(0.70)';
            wrapperZIndex = 10;
            cardRotate = 'rotateY(40deg)';
            overlayOpacity = 'opacity-80';
          } else if (offset === 2) {
            wrapperTransform = 'translateX(120%) scale(0.70)';
            wrapperZIndex = 10;
            cardRotate = 'rotateY(-40deg)';
            overlayOpacity = 'opacity-80';
          } else {
            wrapperTransform = `translateX(${offset < 0 ? '-150%' : '150%'}) scale(0.5)`;
            wrapperZIndex = 0;
            cardRotate = 'rotateY(0deg)';
            overlayOpacity = 'opacity-100';
          }

          return (
            <div
              key={product.id}
              onClick={() => {
                if (isDragging.current) return;
                if (offset === -1) handlePrev();
                if (offset === 1) handleNext();
              }}
              /* UPDATED: aspect-[4/5] makes it a tall card on mobile, sm:aspect-[16/9] returns it to widescreen on tablets/desktops */
              className="absolute w-[75%] max-w-[600px] aspect-[4/5] sm:aspect-[16/9] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ 
                transform: wrapperTransform, 
                zIndex: wrapperZIndex,
                pointerEvents: isClickable || offset === 0 ? 'auto' : 'none' 
              }}
            >
              <div 
                className={`absolute -top-10 left-1/2 -translate-x-1/2 text-[13px] md:text-sm whitespace-nowrap transition-colors duration-[800ms]
                  ${offset === 0 ? 'text-black font-medium' : 'text-gray-400 font-light'}
                `}
              >
                {product.shortName}
              </div>

              <div 
                className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group"
                style={{ transform: cardRotate }}
              >
                {product.type === 'video' ? (
                  <video
                    src={product.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <img 
                    src={product.src} 
                    alt={product.title} 
                    loading="lazy"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}

                {offset === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-xl md:rounded-2xl text-xl md:text-2xl font-bold tracking-tight shadow-xl">
                      {product.shortName}
                    </span>
                  </div>
                )}

                <div 
                  className={`absolute inset-0 bg-[#FAFAFA] transition-opacity duration-[800ms] pointer-events-none ${overlayOpacity}`}
                ></div>

                {isClickable && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 pointer-events-none">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-sm border border-white/40">
                      {offset === -1 ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7 7H3" /></svg>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Description */}
      <div 
        className={`w-full max-w-[600px] mt-8 md:mt-10 px-6 transition-all duration-[1200ms] ease-out delay-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
        `}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight">
            {products[activeIndex].title}
          </h3>
          <a href="#details" className="text-black hover:text-gray-500 transition-colors mt-1">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19L20 5m0 0v12m0-12H8" />
            </svg>
          </a>
        </div>
        <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
          {products[activeIndex].description}
        </p>
      </div>

      
    </section>
  );
}