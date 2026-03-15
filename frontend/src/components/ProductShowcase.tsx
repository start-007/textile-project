import React, { useState, useEffect, useRef } from 'react';
import video from "../assets/video.mp4"; 

export default function ProductShowcase() {
  const products = [
    { id: 1, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200', video: video, shortName: 'AeroShell', price: '$240.00', discountPrice: '$189.00', link: '/product/aeroshell' },
    { id: 2, image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=1200', shortName: 'TechKnit', price: '$110.00', discountPrice: '$85.00', link: '/product/techknit' },
    { id: 3, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200', shortName: 'Core Puffer', price: '$180.00', discountPrice: '$149.00', link: '/product/core-puffer' },
    { id: 4, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1200', video: video, shortName: 'Merino Base', price: '$85.00', discountPrice: '$59.00', link: '/product/merino-base' },
    { id: 5, image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&q=80&w=1200', shortName: 'Utility Cargo', price: '$130.00', discountPrice: '$99.00', link: '/product/utility-cargo' }
  ];

  const [activeIndex, setActiveIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const domRef = useRef(null);
  const dragStartX = useRef(null);
  const isDragging = useRef(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1 < products.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : products.length - 1));
  };

  useEffect(() => {
    if (isDesktop) return; 
    const slideTimer = setInterval(() => { handleNext(); }, 5000); 
    return () => clearInterval(slideTimer);
  }, [activeIndex, isDesktop, products.length]);

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    if (Math.abs(dragStartX.current - e.clientX) > 10) isDragging.current = true;
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (diff > 50) handleNext(); 
    else if (diff < -50) handlePrev(); 
    dragStartX.current = null;
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const handlePointerLeave = () => { dragStartX.current = null; };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.15 });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isDesktop) return; 
    videoRefs.current.forEach((videoEl, index) => {
      if (videoEl && index !== activeIndex) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      setTimeout(() => { activeVideo.play().catch(() => {}); }, 250);
    }
  }, [activeIndex, isDesktop]);

  return (
    <section ref={domRef} className="relative w-full py-16 overflow-hidden flex flex-col items-center font-sans text-white">
      <style>{`
        @keyframes pulse-left {
          0%, 100% { opacity: 0.2; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(-4px); }
        }
        @keyframes pulse-right {
          0%, 100% { opacity: 0.2; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
        .chevron-l-3 { animation: pulse-left 1.5s infinite 0.3s; }
        .chevron-l-2 { animation: pulse-left 1.5s infinite 0.15s; }
        .chevron-l-1 { animation: pulse-left 1.5s infinite 0s; }
        .chevron-r-1 { animation: pulse-right 1.5s infinite 0s; }
        .chevron-r-2 { animation: pulse-right 1.5s infinite 0.15s; }
        .chevron-r-3 { animation: pulse-right 1.5s infinite 0.3s; }
      `}</style>

      {/* Abstract Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[20%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_1px_white] opacity-50" />
        <div className="absolute top-[40%] left-[5%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_15px_3px_#67e8f9] opacity-60 animate-pulse" />
      </div>
      
      {/* Massive "LandingStore" Wrapper */}
      <div className={`relative z-10 w-full max-w-[1280px] mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-[1500ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        
        {/* Header Section */}
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-white/10 pb-6">
          <div>
            <span className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4 inline-block">
              Curated For You
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Trending Now
            </h2>
          </div>
          <button className="hidden md:flex bg-white/5 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white/10 transition-all items-center gap-2">
            View Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>

        {isDesktop ? (
          /* --- DESKTOP GRID VIEW --- */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <a href={product.link} key={product.id} className="group relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 cursor-pointer flex flex-col block">
                <div className="absolute inset-0 z-0">
                    <img src={product.image} alt={product.shortName} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                    
                    {product.video && (
                      <video
                        src={product.video} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500" />
                </div>

                <div className="relative z-10 flex flex-col h-full p-5 justify-between">
                    <div className="flex justify-between items-start">
                        <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            {product.shortName}
                        </span>
                        <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl text-white font-bold tracking-tight">{product.discountPrice}</span>
                            <span className="text-zinc-400 line-through text-xs font-medium">{product.price}</span>
                        </div>
                        <div className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-white text-black text-sm font-bold flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            Quick Add
                        </div>
                    </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* --- MOBILE 3D CAROUSEL VIEW --- */
          <>
            <div 
              className="relative z-10 w-full h-[450px] flex justify-center items-center touch-pan-y select-none cursor-grab active:cursor-grabbing mt-4"
              onPointerDown={handlePointerDown} 
              onPointerMove={handlePointerMove} 
              onPointerUp={handlePointerUp} 
              onPointerLeave={handlePointerLeave}
            >
              {products.map((product, index) => {
                const N = products.length;
                const offset = (index - activeIndex + N) % N;
                let wrapperTransform = '';
                let wrapperZIndex = 0;
                let isClickable = false;
                let overlayOpacity = 0;
                let wrapperOpacity = 1;

                if (offset === 0) {
                  wrapperTransform = 'translateX(0px) translateY(0px) scale(1) rotateZ(0deg)';
                  wrapperZIndex = 50;
                } else if (offset === N - 1) {
                  wrapperTransform = 'translateX(-200%) translateY(-100px) scale(0.6) rotateZ(-40deg)';
                  wrapperZIndex = 60; 
                  wrapperOpacity = 0; 
                } else {
                  wrapperTransform = `translateX(${offset * 35}px) translateY(${offset * 25}px) scale(${1 - offset * 0.08}) rotateZ(${offset * 4}deg)`;
                  wrapperZIndex = 50 - offset;
                  overlayOpacity = 0.4 + (offset * 0.2); 
                  isClickable = offset === 1; 
                }

                const isActive = offset === 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => { if (!isDragging.current && offset === 1) handleNext(); }}
                    className="absolute w-[80%] max-w-[320px] aspect-[4/5] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: wrapperTransform, zIndex: wrapperZIndex, opacity: wrapperOpacity, pointerEvents: isClickable || isActive ? 'auto' : 'none' }}
                  >
                    {/* Floating Title above the card */}
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest transition-colors duration-[800ms] ${isActive ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-zinc-500 font-bold'}`}>
                      {product.shortName}
                    </div>

                    {/* Card Body */}
                    <div className={`relative w-full h-full rounded-[2rem] overflow-hidden transition-all duration-[800ms] ${isActive ? 'border border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] bg-zinc-900' : 'border border-white/10 bg-black/50'}`}>
                      <img src={product.image} alt={product.shortName} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80" />

                      {product.video && (
                        <video
                          ref={(el) => (videoRefs.current[index] = el)}
                          src={product.video} loop muted playsInline
                          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        />
                      )}

                      {/* Dynamic Dark Overlay for inactive cards */}
                      <div className="absolute inset-0 bg-black transition-opacity duration-[800ms] pointer-events-none" style={{ opacity: overlayOpacity }} />

                      {/* Swipe Indicators overlay */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-between px-4 z-40 pointer-events-none">
                          <div className="flex items-center justify-center pl-1 pr-2 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                            <svg className="w-5 h-5 text-white chevron-l-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                            <svg className="w-5 h-5 text-white chevron-l-2 -ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                            <svg className="w-5 h-5 text-white chevron-l-1 -ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                          </div>
                          <div className="flex items-center justify-center pr-1 pl-2 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                            <svg className="w-5 h-5 text-white chevron-r-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                            <svg className="w-5 h-5 text-white chevron-r-2 -ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                            <svg className="w-5 h-5 text-white chevron-r-3 -ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                          </div>
                        </div>
                      )}

                      {/* Content Footer */}
                      <div className={`absolute bottom-0 left-0 w-full pt-16 pb-6 px-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                        <div className="flex items-baseline gap-3 font-medium">
                          <span className="text-2xl text-white font-bold tracking-tight">{product.discountPrice}</span>
                          <span className="text-zinc-400 line-through text-sm">{product.price}</span>
                        </div>
                        <a href={product.link} onClick={(e) => e.stopPropagation()} className="w-full py-3 rounded-full bg-cyan-400 hover:bg-white text-black text-sm font-bold flex justify-center items-center shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors">
                          Quick Add
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Dots */}
            <div className="relative z-10 flex justify-center gap-2 mt-8">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`transition-all duration-500 rounded-full h-1.5 ${idx === activeIndex ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}