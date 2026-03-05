import React, { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  // Scroll to Top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
      { threshold: 0.1 } // Triggers when 10% of the footer is visible
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer 
      ref={domRef} 
      // The background matches the soft mint/cyan gradient fade at the bottom of the screenshot
      className="relative w-full bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA] to-[#cbf0e8] pb-8 px-6 md:px-12 lg:px-24 overflow-hidden font-sans"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: Links Grid */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          
          {/* Column 1: Logo */}
          <div 
            className={`lg:w-1/4 transition-all duration-[1200ms] ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}
          >
            <div className="flex items-center text-black">
              {/* Replicated bar chart logo */}
              <div className="flex items-end gap-[2px] mr-2 h-5">
                <div className="w-1 h-3 bg-current"></div>
                <div className="w-1 h-5 bg-current"></div>
                <div className="w-1 h-4 bg-current"></div>
              </div>
              <span className="text-[18px] font-semibold tracking-tight">Sarwantrika</span>
              <span className="mx-3 text-[18px] font-light opacity-40">|</span>
              <span className="text-[18px] font-normal tracking-wide">Store</span>
            </div>
          </div>

          {/* Center Columns: Links */}
          <div className="lg:w-1/2 flex flex-wrap sm:flex-nowrap gap-12 sm:gap-16 lg:justify-center">
            
            {/* Column 2: Collections */}
            <div 
              className={`flex flex-col gap-4 transition-all duration-[1200ms] ease-out delay-100
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
              `}
            >
              <h4 className="font-semibold text-black text-sm tracking-wide mb-1">Collections</h4>
              <a href="#outerwear" className="text-[13px] text-gray-500 hover:text-black transition-colors">AeroShell Series</a>
              <a href="#techknit" className="text-[13px] text-gray-500 hover:text-black transition-colors">TechKnit Core</a>
              <a href="#baselayer" className="text-[13px] text-gray-500 hover:text-black transition-colors">Merino Base</a>
              <a href="#accessories" className="text-[13px] text-gray-500 hover:text-black transition-colors">Utility Accessories</a>
              <a href="#footwear" className="text-[13px] text-gray-500 hover:text-black transition-colors">Footwear</a>
            </div>

            {/* Column 3: Innovations */}
            <div 
              className={`flex flex-col gap-4 transition-all duration-[1200ms] ease-out delay-200
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
              `}
            >
              <h4 className="font-semibold text-black text-sm tracking-wide mb-1">Innovations</h4>
              <a href="#materials" className="text-[13px] text-gray-500 hover:text-black transition-colors">Material Science</a>
              <a href="#climate" className="text-[13px] text-gray-500 hover:text-black transition-colors">Climate Control</a>
              <a href="#sustainability" className="text-[13px] text-gray-500 hover:text-black transition-colors">Sustainability</a>
              <a href="#manufacturing" className="text-[13px] text-gray-500 hover:text-black transition-colors">Closed-Loop</a>
              <a href="#ethics" className="text-[13px] text-gray-500 hover:text-black transition-colors">Ethical Sourcing</a>
            </div>

            {/* Column 4: Learn More */}
            <div 
              className={`flex flex-col gap-4 transition-all duration-[1200ms] ease-out delay-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
              `}
            >
              <h4 className="font-semibold text-black text-sm tracking-wide mb-1">Learn More</h4>
              <a href="#journal" className="text-[13px] text-gray-500 hover:text-black transition-colors">Journal</a>
              <a href="#news" className="text-[13px] text-gray-500 hover:text-black transition-colors">News</a>
              <a href="#stores" className="text-[13px] text-gray-500 hover:text-black transition-colors">Retail Stores</a>
              <a href="#support" className="text-[13px] text-gray-500 hover:text-black transition-colors">Support / FAQ</a>
              <a href="#contact" className="text-[13px] text-gray-500 hover:text-black transition-colors">Contact Us</a>
            </div>
          </div>

          {/* Column 5: Right Aligned Branding & QR */}
          <div 
            className={`lg:w-1/4 flex flex-col items-start lg:items-end transition-all duration-[1200ms] ease-out delay-500
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
            `}
          >
            <p className="text-black font-medium text-[15px] lg:text-right mb-8">
              Redefining the architecture of clothing,<br className="hidden lg:block"/> in service of movement
            </p>
            
            {/* Placeholder for QR Code */}
            <div className="w-24 h-24 bg-white p-1 rounded-sm shadow-sm border border-black/5 mb-3 flex items-center justify-center">
               {/* You can replace this with an actual <img src="qr.png" /> */}
               <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">QR Code</div>
            </div>
            
            <p className="text-[13px] text-gray-600">Join YourBrand App</p>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Legal */}
        <div 
          className={`mt-24 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-gray-600 transition-all duration-[1200ms] ease-out delay-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <div>Copyright © 2026 YourBrand Store</div>
          <div className="flex gap-6">
            <a href="#disclaimer" className="hover:text-black transition-colors">Disclaimer</a>
            <a href="#privacy" className="hover:text-black transition-colors">Privacy</a>
          </div>
          <div>Contact us : support@yourbrand.com</div>
        </div>
      </div>

      {/* Floating Scroll to Top Button (Blue Circle) */}
      <button 
        onClick={scrollToTop}
        className={`absolute bottom-6 right-6 md:bottom-8 md:right-8 w-10 h-10 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shadow-lg hover:bg-[#4338ca] hover:-translate-y-1 transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        `}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

    </footer>
  );
}