import React from 'react';
import { motion } from 'framer-motion';

const FullScreenVideo: React.FC = () => {
    // Using the sample video from the previous step
    const videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

    return (
        // Container must be relative, screen height, and hide overflow
        <div className="relative w-full h-screen overflow-hidden bg-black">
            
            {/* 1. The Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline // Crucial for auto-playing on iOS mobile devices
                src={videoUrl}
            />

            {/* 2. Gradient Overlay (Optional, but helps text readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

            {/* 3. Content Overlay (Text, Buttons, etc.) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 md:pb-32 px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4 text-center"
                >
                    Summer Collection
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    className="text-lg md:text-2xl font-light text-gray-200 mb-10 text-center max-w-2xl"
                >
                    Discover lightweight fabrics and effortless silhouettes designed for the heat.
                </motion.p>
                
                <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="bg-white text-black px-10 py-4 rounded-full font-medium tracking-wide hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    Shop the Look
                </motion.button>
            </div>
            
            {/* Optional: A minimalist header/nav could go here with z-30, top-0, absolute */}
            <div className="absolute top-0 left-0 w-full p-6 z-30 flex justify-between items-center text-white">
                <span className="text-2xl font-bold tracking-tighter">asos</span>
                <button className="text-sm font-medium uppercase tracking-widest hover:text-gray-300 transition-colors">
                    Menu
                </button>
            </div>
        </div>
    );
};

export default FullScreenVideo;