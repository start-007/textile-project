import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCartStore } from "../utils/useCartStore.js";
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const shouldBeSolid = !isHome || isScrolled || isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Store", href: "/store/home" },

    { name: "Men", href: "/store/men" },

    { name: "Women", href: "/store/women" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact-us" },
    
  ];
  
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between transition-all duration-500 px-6 md:px-12 py-5
          ${shouldBeSolid 
            ? 'bg-[#050614]/90 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-b border-white/10 md:border-transparent' 
            : 'pt-8 bg-transparent'
          } 
        `}
      >
        {/* 1. Logo Section */}
        <div className="relative z-20 flex items-center text-white">
          <div className="flex items-end gap-[3px] mr-3 h-5">
            <div className="w-1.5 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
            <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          </div>
          
          <Link to='/' className="flex items-center">
            <span className="text-xl font-bold tracking-wide">Sarwantrika</span>
          </Link>

          
          
        </div>

        {/* 2. Desktop Center Links - THIS IS THE ONLY PART THAT TURNS SOLID ON DESKTOP */}
        <div 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6 transition-all duration-500 px-8 py-3 rounded-full
            ${shouldBeSolid 
              ? 'bg-[#050614]/80 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20' 
              : 'bg-transparent border border-transparent shadow-none'
            }
          `}
        >
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* 3. Right Actions & Mobile Toggle */}
        <div className="relative z-20 flex items-center gap-4 text-white">
          <button 
            onClick={() => navigate('/cart')}
            className="relative flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all group"
            aria-label="View Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14l-1 12H6L5 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 8a3 3 0 016 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`transition-transform duration-500 transform ${isMobileMenuOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'}`}>
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* 4. Mobile Menu Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all duration-500 md:hidden
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible delay-100'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* 5. Mobile Menu Floating Spring Dropdown */}
      <div 
        className={`fixed top-[84px] right-4 sm:right-6 w-[280px] h-auto pb-8 bg-[#0a0b1a]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-40 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right md:hidden flex flex-col pt-6 px-6 overflow-hidden transform
          ${isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0 rotate-0 visible pointer-events-auto' : 'opacity-0 scale-90 -translate-y-4 rotate-2 invisible pointer-events-none'}
        `}
      >
        {/* Dense Starry Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[32px]">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-600/30 rounded-full blur-[50px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[120px] h-[120px] bg-blue-500/20 rounded-full blur-[40px] -translate-x-1/3 translate-y-1/3" />
          
          <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_12px_2px_#93c5fd] opacity-90 animate-pulse" />
          <div className="absolute top-[25%] right-[15%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_1px_white] opacity-70 animate-pulse" />
          <div className="absolute top-[35%] left-[45%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_1px_white] opacity-40" />
          <div className="absolute top-[40%] right-[35%] w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_15px_3px_#a5b4fc] opacity-80" />
          <div className="absolute top-[60%] left-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_1px_white] opacity-50 animate-pulse" />
          <div className="absolute top-[75%] right-[25%] w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_2px_#818cf8] opacity-90 animate-pulse" />
          <div className="absolute bottom-[15%] left-[30%] w-1 h-1 bg-blue-200 rounded-full shadow-[0_0_8px_1px_#bfdbfe] opacity-50" />
          <div className="absolute bottom-[25%] right-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_white] opacity-80 animate-pulse" />
          <div className="absolute bottom-[5%] left-[50%] w-1 h-1 bg-indigo-200 rounded-full shadow-[0_0_8px_1px_#c7d2fe] opacity-60 animate-pulse" />
        </div>

        {/* Navigation Links with Interactive Hover Animations */}
        <div className="relative z-10 flex flex-col gap-4 text-xl font-medium text-white tracking-tight mt-2">
          <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-2 opacity-80 pl-1">Explore</span>
          
          {navLinks.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center justify-between border-b border-white/5 pb-3 text-gray-300 hover:text-white transition-all duration-300 transform
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-6 opacity-0 invisible'}
              `}
              style={{ transitionDelay: `${isMobileMenuOpen ? 100 + index * 60 : 0}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:translate-x-2 group-hover:text-indigo-300 transition-transform duration-300">{item.name}</span>
              
              <svg 
                className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}