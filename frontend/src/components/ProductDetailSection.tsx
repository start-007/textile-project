import React, { useState, useEffect, useRef } from 'react';

export default function ProductDetailSection() {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  // Intersection Observer for entrance animations
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
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  // --- Countdown State ---
  const [timeLeft, setTimeLeft] = useState({ days: 20, hours: 23, minutes: 59, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Highly-styled, glassmorphic circular timer
  const CircularTimer = ({ value, max, label }: { value: number, max: number, label: string }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / max) * circumference;

    return (
      <div className="relative flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 group">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-400/40 transition-colors duration-500" />
        
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="transparent" />
          <circle
            cx="50" cy="50" r={radius}
            stroke="currentColor" strokeWidth="3" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-cyan-400 transition-all duration-1000 ease-linear" 
          />
        </svg>

        {/* Inner Glass Bubble */}
        <div className="absolute inset-2.5 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] group-hover:border-cyan-400/30 transition-colors duration-500">
          <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section ref={domRef} className="relative w-full py-12 font-sans overflow-hidden">
      
      {/* Constrained layout matching the rest of the app */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8">
        
        {/* MAIN CONTAINER: Heavily rounded, floating box effect */}
        <div className={`relative w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100 blur-none' : 'opacity-0 translate-y-24 scale-95 blur-xl'
        }`}>
          
          {/* Banner Image Background */}
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000" 
            alt="Winter Sale" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[2000ms] hover:scale-105"
          />
          
          {/* Heavy Space Dark Overlay with dynamic gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-cyan-900/30 backdrop-blur-sm" />
          
          <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6 text-center">
            
            {/* SUBTITLE: Drops down slightly */}
            <span className={`bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-bold text-[10px] px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}>
              Limited Time Event
            </span>

            {/* MAIN TITLE: Scales down and unblurs for a cinematic hit */}
            <h2 className={`text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-12 drop-shadow-2xl transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0 scale-100 blur-none' : 'opacity-0 translate-y-8 scale-110 blur-md'
            }`}>
              Winter Collection Sale
            </h2>
            
            {/* TIMER CONTAINER: Slides up */}
            <div className={`flex flex-wrap justify-center gap-4 md:gap-6 mb-14 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <CircularTimer value={timeLeft.days} max={30} label="Days" />
              <CircularTimer value={timeLeft.hours} max={24} label="Hours" />
              <CircularTimer value={timeLeft.minutes} max={60} label="Minutes" />
              <CircularTimer value={timeLeft.seconds} max={60} label="Seconds" />
            </div>

            {/* BUTTONS: Expand outward */}
            <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto transition-all duration-700 delay-[900ms] ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <button className="px-10 py-4 rounded-full bg-cyan-400 text-black font-bold hover:bg-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all duration-300">
                Shop the Sale
              </button>
              <button className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                View Lookbook
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}