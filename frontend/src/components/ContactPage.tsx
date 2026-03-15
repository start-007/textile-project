import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { particles } from '../utils/constants.js';

// --- Animation Variants ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const pageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: easeOutQuart, staggerChildren: 0.1 } 
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { duration: 0.6, ease: easeOutQuart } 
    }
};

const ContactPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        inquiryType: 'Order Support',
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const inquiryTypes = ['Order Support', 'Sizing & Fit', 'Press & Media', 'Other'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-4 md:px-6 lg:px-8 font-sans text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Deep Space Starry Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_2px_#06b6d4] opacity-60 animate-pulse" />
                <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_2px_#a855f7] opacity-50" />
                <div className="absolute top-[40%] right-[10%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_15px_3px_#67e8f9] opacity-60 animate-pulse" />
                {particles.map((p, i) => (
                  <div key={i} className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-40 ${p.pulse ? "animate-pulse" : ""}`} style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }} />
                ))}
            </div>

            <div className="max-w-[1200px] mx-auto relative z-10">
                
                {/* Massive "LandingStore" Wrapper */}
                <motion.div 
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-12 lg:p-16 shadow-2xl overflow-hidden relative"
                >
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
                        
                        {/* LEFT COLUMN: The Dispatch Form */}
                        <div className="w-full lg:w-7/12 flex flex-col">
                            <motion.div variants={itemVariants} className="mb-10">
                                <span className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 inline-flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    Comms Channel Open
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                                    Get in Touch.
                                </h1>
                                <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed max-w-md">
                                    Whether you have a question about our technical fabrics, sizing, or an existing order, our team is ready to assist.
                                </p>
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form 
                                        key="contact-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                        transition={{ duration: 0.4 }}
                                        onSubmit={handleSubmit} 
                                        className="flex flex-col gap-8"
                                    >
                                        {/* Inquiry Type Pill Selector */}
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                                                I need help with...
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                {inquiryTypes.map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setFormState({ ...formState, inquiryType: type })}
                                                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                                                            formState.inquiryType === type 
                                                            ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                                                            : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <motion.div variants={itemVariants}>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2" htmlFor="name">
                                                    Name
                                                </label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    value={formState.name}
                                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                    className="w-full bg-black/40 text-white p-4 rounded-[1.5rem] border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-zinc-600 transition-all shadow-inner text-sm font-medium"
                                                    placeholder="Jane Doe"
                                                />
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2" htmlFor="email">
                                                    Email
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={formState.email}
                                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                    className="w-full bg-black/40 text-white p-4 rounded-[1.5rem] border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-zinc-600 transition-all shadow-inner text-sm font-medium"
                                                    placeholder="jane@example.com"
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2" htmlFor="message">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                required
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                className="w-full bg-black/40 text-white p-5 rounded-[1.5rem] border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-zinc-600 transition-all resize-none shadow-inner text-sm font-medium leading-relaxed"
                                                placeholder="Tell us how we can help..."
                                            ></textarea>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !formState.name || !formState.email || !formState.message}
                                                className="w-full sm:w-auto bg-cyan-400 text-black font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                        Transmitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Transmit Message
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7 7H3" /></svg>
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    </motion.form>
                                ) : (
                                    /* Success State */
                                    <motion.div 
                                        key="success-state"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center py-12 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-inner"
                                    >
                                        <div className="w-24 h-24 bg-cyan-400/10 border border-cyan-400/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                            <svg className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Transmission Received</h3>
                                        <p className="text-zinc-400 font-medium max-w-sm mb-8 leading-relaxed text-sm">
                                            Thank you for reaching out. Our support operatives will review your transmission and respond within 24 hours.
                                        </p>
                                        <button 
                                            onClick={() => setIsSubmitted(false)}
                                            className="text-xs font-bold text-black bg-white px-8 py-3 rounded-full hover:bg-zinc-200 transition-colors"
                                        >
                                            Send Another Message
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT COLUMN: Direct Channels */}
                        <div className="w-full lg:w-5/12 flex flex-col gap-6 lg:border-l border-white/10 lg:pl-16 pt-10 lg:pt-0">
                            
                            <motion.div variants={itemVariants} className="flex flex-col mb-4">
                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Direct Channels</h3>
                                <p className="text-zinc-400 text-sm font-medium">For immediate assistance, utilize our dedicated communication arrays.</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer">
                                <div className="w-12 h-12 bg-black/40 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-colors">
                                    <svg className="w-5 h-5 text-zinc-300 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Email Support</h4>
                                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">support@sarwantrika.com</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer">
                                <div className="w-12 h-12 bg-black/40 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-colors">
                                    <svg className="w-5 h-5 text-zinc-300 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">HQ Uplink</h4>
                                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">+1 (800) 555-0199</p>
                                <p className="text-xs text-zinc-500 mt-2 font-medium">Mon-Fri, 9AM-6PM EST</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer">
                                <div className="w-12 h-12 bg-black/40 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-colors">
                                    <svg className="w-5 h-5 text-zinc-300 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Global HQ</h4>
                                <p className="text-sm font-medium text-white leading-relaxed group-hover:text-cyan-400 transition-colors">
                                    Sarwantrika Design Labs<br />
                                    100 Innovation Way<br />
                                    Hoboken, NJ 07030
                                </p>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;