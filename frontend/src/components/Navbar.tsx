import React, { useState } from 'react';

// --- ATOM: The Brand Logo ---
const NavLogo = () => (
  <div className="flex items-center gap-2 text-white text-lg font-bold tracking-tight">
    <div className="w-5 h-5 bg-indigo-500 rounded-full" />
    <span>Company Name</span>
  </div>
);

// --- ATOM: The Individual Link ---
const NavLink = ({ href, label, icon, count, className = "" }) => (
  <a 
    href={href} 
    className={`group flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 ${className}`}
  >
    {icon && <span className="group-hover:scale-110 transition-transform">{icon}</span>}
    <span>{label}</span>
    {count !== undefined && (
      <span className="flex items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/30 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors">
        {count}
      </span>
    )}
  </a>
);

// --- ORCHESTRATOR: The Navbar ---
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Centralized Navigation Data
  const navItems = [
    { label: 'Store', href: '/store' },
    { label: 'About', href: '/about' },
    { 
      label: 'Cart', 
      href: '/cart', 
      count: 0, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ) 
    },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl md:rounded-full px-6 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        <NavLogo />

        {/* Desktop Mapping */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Mapping */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col items-center border-t border-white/10 pt-4">
          {navItems.map((item) => (
            <NavLink key={item.label} {...item} className="w-full justify-center" />
          ))}
        </div>
      )}
    </nav>
  );
}