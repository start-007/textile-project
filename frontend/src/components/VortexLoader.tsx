import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import './VortexLoader.css';

interface VortexLoaderProps {
  targetPercentage?: number;
  duration?: number;
}

const VortexLoader: React.FC<VortexLoaderProps> = ({ 
  targetPercentage = 100, 
  duration = 4000 
}) => {
  const [init, setInit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize the particle engine
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Simulate the loading progress
  useEffect(() => {
    let start = 0;
    const intervalTime = 50; 
    const increment = targetPercentage / (duration / intervalTime); 

    const interval = setInterval(() => {
      start += increment;
      if (start >= targetPercentage) {
        setProgress(targetPercentage);
        clearInterval(interval);
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [targetPercentage, duration]);

  // Particle configuration for the glowing galaxy swirl
  const particleOptions = {
    fpsLimit: 60,
    fullScreen: { enable: false }, // Keep it contained within our div
    particles: {
      number: {
        value: 400, // High density for that "explosive" look
        density: { enable: true, width: 400, height: 400 }
      },
      color: {
        value: ["#00ffff", "#b829ff", "#ffcc00", "#ffffff"] // Cyan, Purple, Gold, White
      },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.1, max: 0.9 },
        animation: { enable: true, speed: 1.5, sync: false } // Twinkling effect
      },
      size: {
        value: { min: 0.5, max: 3 }, // Varied particle sizes
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: { default: "out" as const }, // Particles flow outward
      }
    },
    background: {
      color: "transparent"
    }
  };

  return (
    <div className="vortex-container">
      {/* The Swirling Particle Background */}
      <div className="particle-wrapper">
        <div className="particle-spinner">
           {init && (
            <Particles
              id="tsparticles"
              options={particleOptions}
              className="particles-canvas"
            />
          )}
        </div>
        {/* Bright Glowing Core */}
        <div className="vortex-core"></div>
      </div>

      {/* Futuristic Text and Progress */}
      <div className="ui-container">
        <h1 className="glitch-text" data-text="LOADING...">LOADING...</h1>
        <div className="progress-bar-wrapper">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-numbers">
          <span className="percentage">{progress}%</span>
          <span className="status">SYSTEM INITIATION</span>
        </div>
      </div>
    </div>
  );
};

export default VortexLoader;