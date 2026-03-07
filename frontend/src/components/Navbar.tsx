import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from "../utils/useCartStore.js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 1. Get current route

  // 2. Determine if we are on the home page
  const isHome = location.pathname === '/'

  // 3. The Navbar should be "solid" (white) if:
  // - We are NOT on the home page
  // - OR we have scrolled down on the home page
  // - OR the mobile menu is open
  const shouldBeSolid = !isHome || isScrolled || isMobileMenuOpen;

  // Handle scroll state for background changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when the mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Men", href: "/store/men" },
    { name: "Women", href: "/store/women" },
    { name: "Lookbook", href: "/lookbook" },
    { name: "About", href: "/about" }
  ];
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between transition-all duration-300
        px-6 md:px-12 pt-12 pb-12
        ${shouldBeSolid ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'bg-transparent'}
      `}>

        {/* 1. Logo Section */}
        <div className={`relative z-20 flex items-center transition-colors duration-300 ${shouldBeSolid ? 'text-black' : 'text-white'}`}>
          <div className="flex items-end gap-[2px] mr-2 h-5">
            <div className="w-1 h-3 bg-current"></div>
            <div className="w-1 h-5 bg-current"></div>
            <div className="w-1 h-4 bg-current"></div>
          </div>
          <a href='/'>
            <span className="text-[18px] font-semibold tracking-tight">Sarwantrika</span>
          </a>

          <span className={`mx-3 text-[18px] font-light opacity-40 ${shouldBeSolid ? 'text-black' : 'text-white'}`}>|</span>
          <a href='/store'>
            <span className="text-[18px] font-normal tracking-wide">Store</span>
          </a>
        </div>

        {/* 2. Desktop Center Links (Hidden on Mobile) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`
                px-4 py-1.5 rounded-full text-[14px] font-normal transition-all duration-300 backdrop-blur-md
                ${shouldBeSolid
                  ? 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-800'
                  : 'bg-white/10 hover:bg-white/20 text-white/95 border border-white/[0.05]'
                }
              `}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* 3. Right Actions & Mobile Toggle */}
        <div className={`relative z-20 flex items-center gap-3 md:gap-4 transition-colors duration-300 ${shouldBeSolid ? 'text-black' : 'text-white'}`}>

          {/* Cart Button (Always visible) */}

          <button onClick={() => { navigate('/cart') }}
            className={`
    relative flex items-center justify-center
    w-10 h-10 rounded-full transition-colors
    ${shouldBeSolid
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-200'}
  `}
          >
            {/* Bag Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M5 8h14l-1 12H6L5 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 8a3 3 0 016 0" />
            </svg>

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
              {cartCount}
            </span>
          </button>

          {/* Search Text (Hidden on very small screens) */}
          {/* <button className="hidden sm:block text-[14px] font-normal hover:opacity-70 transition-opacity">
            Search
          </button> */}

          {/* Mobile Menu Toggle (Hamburger / X icon) */}
          <button
            className="md:hidden ml-2 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              // X (Close) Icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger Icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* 4. Mobile Menu Overlay (Glassmorphism Dropdown) */}
      <div className={`
        fixed top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-2xl z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col pt-24 px-6
        ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="py-12 flex flex-col gap-6 text-2xl font-semibold text-black tracking-tight">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="border-b border-gray-100 pb-4 hover:text-gray-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          {/* <a 
            href="#search"
            className="border-b border-gray-100 pb-4 hover:text-gray-500 transition-colors sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Search
          </a> */}
        </div>
      </div>
    </>
  );
}