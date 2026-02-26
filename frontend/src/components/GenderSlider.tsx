import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import DecryptedText from "./DecryptedText";

const GenderSlider = () => {
    const x = useMotionValue(0);
    const navigate = useNavigate();
    // Maps the drag distance to colors or opacity if you want visual feedback
    const opacityLeft = useTransform(x, [-50, 0], [1, 0.3]);
    const opacityRight = useTransform(x, [0, 50], [0.3, 1]);

    const handleDragEnd = (_, info) => {
    if (info.offset.x < -50) {
        navigate("/men");
    } else if (info.offset.x > 50) {
        navigate("/women");
    }
};

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Dynamic Text Display */}
            <h2 className="text-5xl font-extrabold tracking-tighter uppercase italic">
                <div style={{ marginTop: '4rem' }}>
                    <DecryptedText
                        text="Some text that will look good"
                        animateOn="view"
                        speed={60}
                        revealDirection="start"
                        sequential
                        useOriginalCharsOnly={false}
                    />

                </div>
            </h2>

            {/* The Track */}
            <div className="relative w-64 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-2 flex items-center justify-between px-6">
                <motion.span style={{ opacity: opacityLeft }} className="text-sm font-bold">MEN</motion.span>
                <motion.span style={{ opacity: opacityRight }} className="text-sm font-bold">WOMEN</motion.span>

                {/* The Sliding Knob */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: -80, right: 80 }}
                        dragElastic={0.1}
                        dragSnapToOrigin={false} // Change to true if you want it to bounce back like an iPhone
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        className="w-12 h-12 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center"
                    >
                        <div className="flex gap-1">
                            <div className="w-1 h-4 bg-gray-300 rounded-full" />
                            <div className="w-1 h-4 bg-gray-300 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default GenderSlider;