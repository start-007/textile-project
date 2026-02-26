import { useState, useEffect, useRef } from 'react';
import LightPillar from './LightPillar.jsx';
import GenderSlider from './GenderSlider.jsx'; 
import cornerVideo  from "../assets/video.mp4"; 

function Homepage() {
    // Setup state and ref for scroll-based lazy loading
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoContainerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVideoLoaded(true);
                    observer.disconnect(); 
                }
            },
            { threshold: 0.1 } 
        );

        if (videoContainerRef.current) {
            observer.observe(videoContainerRef.current);
        }

        return () => {
            if (videoContainerRef.current) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <>
        {/* Original Light Pillar Section */}
        <div className="relative w-full overflow-hidden h-[70vh] min-h-[360px] max-h-[900px] lg:h-[100vh]">
            <div className="absolute inset-0 -z-10">
                <LightPillar
                    topColor="#5227FF"
                    bottomColor="#FF9FFC"
                    intensity={1}
                    rotationSpeed={0.1}
                    glowAmount={0.002}
                    pillarWidth={4}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={25}
                    interactive={false}
                    mixBlendMode="screen"
                    quality="medium"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <GenderSlider />
            </div>
        </div>

        {/* Scroll-Triggered Video Section */}
        <div 
            ref={videoContainerRef} 
            // REMOVED bg-[#0a0a0a] from here so the background is transparent
            className="flex items-center justify-center w-full py-12 min-h-[300px] md:min-h-[500px]"
        >
            {isVideoLoaded && (
                <div className="relative w-11/12 lg:w-11/12 max-w-7xl h-[40vh] md:h-[70vh] max-h-[500px] rounded-lg shadow-2xl overflow-hidden bg-black">
                    
                    {/* The Video Element with a brightness filter applied directly */}
                    <video
                        src={cornerVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        // Added brightness-50 to darken the video directly, eliminating the need for an overlay div
                        className="w-full h-full object-cover brightness-50"
                    />

                </div>
            )}
        </div>
        </>
    );
}

export default Homepage;