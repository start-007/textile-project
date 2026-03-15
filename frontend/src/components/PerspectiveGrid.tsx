import React from 'react';

export default function PerspectiveDivider() {
  return (
    // Compressed height: changed to h-[80px] md:h-[120px] to act as a slim divider
    <div className="relative w-full h-[80px] md:h-[120px] bg-[#050614] overflow-hidden flex items-end">
      
      {/* 1. Ambient Background Glows (Scaled down for shorter height) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[80px] bg-indigo-600/20 blur-[40px] pointer-events-none" />
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[30%] h-[60px] bg-blue-500/30 blur-[30px] pointer-events-none" />

      {/* 2. Floating Particles (Adjusted to stay within the narrow band) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_12px_2px_#93c5fd] opacity-80 animate-pulse" />
        <div className="absolute top-[40%] left-[45%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_1px_white] opacity-60 animate-pulse" />
        <div className="absolute top-[35%] right-[40%] w-1.5 h-1.5 bg-indigo-300 rounded-full shadow-[0_0_15px_3px_#a5b4fc] opacity-70" />
        <div className="absolute bottom-[20%] right-[25%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_1px_white] opacity-50 animate-pulse" />
        <div className="absolute bottom-[30%] right-[35%] w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_12px_2px_#818cf8] opacity-60" />
        <div className="absolute bottom-[40%] left-[20%] w-1 h-1 bg-blue-200 rounded-full shadow-[0_0_8px_1px_#bfdbfe] opacity-40 animate-pulse" />
      </div>

      {/* 3. The 3D Grid Plane */}
      <div 
        className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[200%] pointer-events-none animate-grid-flow"
        style={{
          // Tweaked perspective to flatten the grid faster in the short vertical space
          transform: 'perspective(300px) rotateX(80deg)',
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px),
            linear-gradient(to top, rgba(99, 102, 241, 0.25) 1px, transparent 1px)
          `,
          // Smaller grid squares (30px) so more lines fit in the shorter space
          backgroundSize: '30px 30px',
          // Aggressive fade out at the top so it blends perfectly into the background
          maskImage: 'linear-gradient(to top, black 10%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 70%)',
        }}
      />

      {/* 4. Bottom Grounding Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent blur-[2px]" />

      {/* Grid movement animation matched to the new 30px grid size */}
      <style>
        {`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 0 30px; }
          }
          .animate-grid-flow {
            animation: gridMove 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
}