import React from 'react';
import Navbar from './Navbar'; // Your existing glassmorphism navbar
import VideoHero from './VideoHero';
import CapabilitiesGrid from './CapabilitiesGrid';
import ProductShowcase from './ProductShowcase';
import Footer from './footer';

export default function App() {
  return (
    <div className="relative w-full min-h-screen font-sans">
      {/* Since the navbar is "glassmorphism" and likely uses 'fixed' or 'absolute' positioning, 
        it will sit perfectly transparent over the top of the VideoHero.
      */}
      <Navbar /> 
      
      <main>
        {/* The massive full-screen video section */}
        <VideoHero />
        
        {/* The rest of your website will stack naturally below as the user scrolls */}
        <ProductShowcase />

        <CapabilitiesGrid />
      </main>
    </div>
  );
}