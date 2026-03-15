import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
      { threshold: 0.1 } 
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full px-4 md:px-6 lg:px-8 pb-8 z-10 font-sans">
      <footer 
        ref={domRef} 
        className={`max-w-[1280px] mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-95'}
        `}
      >
        {/* Subtle Background Glow inside the glass box */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-16">
          
          {/* TOP SECTION: Branding & Quick CTA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center text-white mb-4">
                {/* Sleek Cyan animated bar chart logo */}
                <div className="flex items-end gap-[3px] mr-3 h-6">
                  <div className="w-1.5 h-3 bg-cyan-600 rounded-sm"></div>
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="w-1.5 h-4 bg-cyan-400 rounded-sm"></div>
                </div>
                <span className="text-2xl font-bold tracking-tight">Sarwantrika</span>
                <span className="mx-3 text-xl font-light text-white/20">|</span>
                <span className="text-xl font-medium tracking-wide text-white/60">Store</span>
              </div>
              <p className="text-zinc-400 font-medium text-sm max-w-xs leading-relaxed">
                Redefining the architecture of clothing, in service of movement and ultimate comfort.
              </p>
            </div>

            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Join the List</p>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-1.5 shadow-inner">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-none outline-none text-white text-sm px-4 w-full md:w-56 placeholder-zinc-600"
                />
                <button className="bg-cyan-400 text-black px-6 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: Minimalist Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
            <div className={`flex flex-col gap-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h4 className="font-bold text-white text-xs tracking-widest uppercase mb-2">Collections</h4>
              <a href="#outerwear" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">AeroShell Series</a>
              <a href="#techknit" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">TechKnit Core</a>
              <a href="#accessories" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Accessories</a>
            </div>

            <div className={`flex flex-col gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h4 className="font-bold text-white text-xs tracking-widest uppercase mb-2">Innovations</h4>
              <a href="#materials" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Material Science</a>
              <a href="#climate" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Climate Control</a>
              <a href="#sustainability" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Sustainability</a>
            </div>

            <div className={`flex flex-col gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h4 className="font-bold text-white text-xs tracking-widest uppercase mb-2">Support</h4>
              <a href="#faq" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">FAQ & Shipping</a>
              <a href="#returns" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Returns</a>
              <a href="#contact" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Contact Us</a>
            </div>

            <div className={`flex flex-col gap-4 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h4 className="font-bold text-white text-xs tracking-widest uppercase mb-2">Social</h4>
              <a href="#instagram" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">Instagram</a>
              <a href="#twitter" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">X / Twitter</a>
              <a href="#tiktok" className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors w-max">TikTok</a>
            </div>
          </div>

          {/* BOTTOM SECTION: Copyright & Legal */}
          <div className={`flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-600 transition-all duration-1000 delay-700
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}>
            <div>&copy; {new Date().getFullYear()} Sarwantrika Store. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#terms" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
              <a href="#privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Floating Scroll to Top Button (Internal to the glass box) */}
        <button 
          onClick={scrollToTop}
          className={`absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-cyan-400 hover:text-black hover:border-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300 z-20
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7-7m-7-7v18" />
          </svg>
        </button>

      </footer>
    </div>
  );
}