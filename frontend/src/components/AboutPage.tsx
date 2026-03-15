import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { particles } from '../utils/constants.js';

// --- Updated Working Stock Image Assets (Using reliable Unsplash URLs) ---
const heritageStoneImg = "https://thumbs.dreamstime.com/b/pink-dahlia-flower-details-macro-photo-border-frame-wide-banner-background-message-wedding-background-pink-dahlia-flower-117406512.jpg"; // Calligraphy on stone
const concreteArchImg = "https://images.unsplash.com/photo-1511871893393-82e9c1892d03?q=80&w=1600"; // Minimalist concrete architecture
const fabricWovenImg = "https://images.unsplash.com/photo-1556196148-1fb724238998?q=80&w=1600"; // Premium white fabric texture
const streetwearDetailImg = "https://images.unsplash.com/photo-1521312384950-b08e75299464?q=80&w=1600"; // Urban technical detail
const productTshirtImg = "https://images.unsplash.com/photo-1576871330029-0457813c840a?q=80&w=600"; // Black T-shirt on hanger

// --- Animation Variants ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({ 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: easeOutQuart, delay: custom * 0.1 } 
    })
};

const AboutPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Intersection Observer for Section Entrance Animations
    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        Object.values(sectionRefs.current).forEach(ref => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, []);

    // Scroll-based Parallax for the Hero Section
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const productScrollProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
    const productCard1Y = useTransform(productScrollProgress, [0, 0.4], [50, 0]);
    const productCard2Y = useTransform(productScrollProgress, [0.2, 0.6], [50, 0]);
    const productCard3Y = useTransform(productScrollProgress, [0.4, 1], [50, 0]);


    return (
        <div className="min-h-screen bg-black pt-20 pb-24 px-4 md:px-6 lg:px-8 font-sans text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Deep Space Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_2px_#06b6d4] opacity-60 animate-pulse" />
                <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_2px_#a855f7] opacity-50" />
                {particles.map((p, i) => (
                  <div key={i} className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-30 ${p.pulse ? "animate-pulse" : ""}`} style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }} />
                ))}
            </div>

            <div className="max-w-[1280px] mx-auto relative z-10">
                
                {/* ========================================= */}
                {/* SECTION 1: THE MANIFESTO (CINEMATIC HERO) */}
                {/* ========================================= */}
                <motion.section 
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative w-full h-[90vh] flex flex-col justify-center items-center mb-16 rounded-[3rem] overflow-hidden group"
                >
                    {/* Background images blend heritage + modern */}
                    <div className="absolute inset-0 z-0 flex">
                        <div className="w-1/2 h-full relative">
                            <img src={heritageStoneImg} alt="Ancient Stone Carving" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3s]" />
                            <div className="absolute inset-0 bg-black/60" />
                        </div>
                        <div className="w-1/2 h-full relative">
                            <img src={concreteArchImg} alt="Minimalist Concrete" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3s] delay-100" />
                            <div className="absolute inset-0 bg-black/60" />
                        </div>
                    </div>
                    {/* Heavy dark gradient overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />
                    
                    <div className="relative z-20 text-center px-6 max-w-4xl flex flex-col items-center">
                        <motion.span variants={fadeUpVariants} initial="hidden" animate="visible" custom={1} className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-bold px-5 py-2 rounded-full tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Our Identity
                        </motion.span>
                        <motion.h1 
                            variants={fadeUpVariants} initial="hidden" animate="visible" custom={2}
                            className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-tight mb-6 drop-shadow-2xl"
                        >
                            Sarvantra
                        </motion.h1>
                        <motion.p 
                            variants={fadeUpVariants} initial="hidden" animate="visible" custom={3}
                            className="text-lg md:text-xl font-medium text-zinc-300 leading-relaxed mb-12"
                        >
                            More than a clothing brand—it is a movement of <span className="text-white font-bold">identity, culture, and modern expression.</span> representing strength, individuality, and timeless style. The name symbolizes universality: <span className="text-cyan-400">fashion that belongs everywhere and to everyone.</span>
                        </motion.p>
                        <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" custom={4} className="flex gap-4">
                            <a href="#vision" className="bg-cyan-400 hover:bg-white text-black font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2">
                                Discover Our Vision
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            </a>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Massive "LandingStore" Wrapper for the rest of the content */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-12 lg:p-16 shadow-2xl overflow-hidden relative"
                >
                    {/* Internal Glow Orbs */}
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                    {/* ========================================= */}
                    {/* SECTION 2: VISION & MISSION (DATA GRIDS) */}
                    {/* ========================================= */}
                    <section id="vision" ref={el => sectionRefs.current['vision'] = el} className="mb-24 flex flex-col items-center">
                        <motion.h2 
                            animate={visibleSections['vision'] ? "visible" : "hidden"} variants={fadeUpVariants}
                            className="text-center text-4xl md:text-5xl font-bold tracking-tight text-white mb-16"
                        >
                            Strategic Imperative
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                            {/* Vision Card */}
                            <motion.div 
                                animate={visibleSections['vision'] ? "visible" : "hidden"} variants={fadeUpVariants} custom={1}
                                className="relative bg-black/40 border border-cyan-400/30 p-8 rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-colors" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_2px_#06b6d4]" />
                                        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Our Vision</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-white tracking-tight leading-tight">
                                        To create a global fashion brand that <span className="text-cyan-400">connects tradition with modern lifestyle</span>, empowering creativity.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Mission Card */}
                            <motion.div 
                                animate={visibleSections['vision'] ? "visible" : "hidden"} variants={fadeUpVariants} custom={2}
                                className="relative bg-black/40 border border-white/10 p-8 rounded-[2.5rem] shadow-inner overflow-hidden group hover:border-cyan-400/30 transition-colors"
                            >
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Our Mission</h3>
                                    </div>
                                    <div className="space-y-4 text-base font-medium text-zinc-300">
                                        <p>Design <span className="text-white">high-quality, comfortable</span>, and stylish apparel combining culture with streetwear.</p>
                                        <p>Build a community that <span className="text-white">values originality and self-expression.</span></p>
                                        <p>Deliver premium fashion at accessible prices.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* ========================================= */}
                    {/* SECTION 3: PRODUCTS (THE FLOATING STACK) */}
                    {/* ========================================= */}
                    <section id="products" ref={el => sectionRefs.current['products'] = el} className="mb-28 flex flex-col lg:flex-row items-center gap-16">
                        <motion.div 
                            animate={visibleSections['products'] ? "visible" : "hidden"} variants={fadeUpVariants}
                            className="w-full lg:w-5/12 text-center lg:text-left"
                        >
                            <span className="text-zinc-500 font-bold tracking-widest uppercase mb-4 text-xs inline-block">The Apparatus</span>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-8">
                                Modern Essentials
                            </h2>
                            <p className="text-base font-medium text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                                Sarvantra offers contemporary staples, each product designed with obsessive attention to detail, quality craftsmanship, and modern aesthetics.
                            </p>
                            <Link to="/store" className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold py-3 px-8 rounded-full text-sm hover:bg-white/10 transition-all flex items-center gap-2 inline-flex">
                                Shop the Core
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </motion.div>

                        {/* Floating Product Stack */}
                        <div className="w-full lg:w-7/12 flex flex-col sm:flex-row justify-center lg:justify-end gap-6 relative">
                            {/* Product Card 1 */}
                            <motion.div style={{ y: productCard1Y }} className="relative w-[280px] h-[350px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex flex-col group overflow-hidden shrink-0">
                                <img src={productTshirtImg} alt="Premium T-Shirt" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 rounded-full w-max shadow-lg">Premium T-shirts</span>
                                    <p className="text-xl font-bold text-white drop-shadow-md">Elevated staples, perfect fits, and durable materials.</p>
                                </div>
                            </motion.div>
                            
                            {/* Product Card 2 (Offset Y) */}
                            <motion.div style={{ y: productCard2Y }} className="relative w-[280px] h-[350px] bg-zinc-900 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex flex-col group overflow-hidden shrink-0 mt-8 sm:mt-12">
                                <img src={streetwearDetailImg} alt="Streetwear Collection" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <span className="text-white text-xs font-bold tracking-widest uppercase bg-white/10 border border-white/20 px-3 py-1 rounded-full w-max shadow-lg">Streetwear Collection</span>
                                    <p className="text-xl font-bold text-white drop-shadow-md">Blending cultural heritage with urban aesthetics.</p>
                                </div>
                            </motion.div>

                             {/* Product Card 3 (Glow) */}
                            <motion.div style={{ y: productCard3Y }} className="relative w-[280px] h-[350px] bg-cyan-400 border border-cyan-400 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(6,182,212,0.4)] flex flex-col group overflow-hidden shrink-0 mt-8 sm:mt-24">
                                <div className="absolute inset-0 bg-black/80" />
                                <div className="relative z-10 flex flex-col h-full justify-center text-center items-center">
                                    <div className="w-16 h-16 bg-cyan-400/10 border border-cyan-400/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                        <svg className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2">Future Redacted</span>
                                    <p className="text-xl font-bold text-white leading-tight">Limited Edition Drops & Collaborations.</p>
                                    <p className="text-xs text-zinc-500 mt-2 font-medium">Coming Soon.</p>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* ========================================= */}
                    {/* SECTION 4: DIFFERENTIATORS (THE PARALLAX PILLARS) */}
                    {/* ========================================= */}
                    <section id="diff" ref={el => sectionRefs.current['diff'] = el} className="mb-24 flex flex-col items-center">
                        <motion.div 
                            animate={visibleSections['diff'] ? "visible" : "hidden"} variants={fadeUpVariants}
                            className="text-center mb-16 max-w-xl"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-5">
                                The Sarvantra Algorithm
                            </h2>
                            <p className="text-base font-medium text-zinc-400 leading-relaxed">
                                We prioritize substance over fast fashion trends, focusing on durability, meaningful aesthetic, and our growing community.
                            </p>
                        </motion.div>
                        
                        {/* Parallax Pillars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                            {[
                                { title: "Meaningful Design", text: "designs inspired by strength, heritage, and modern minimalism.", icon: "💎", img: heritageStoneImg },
                                { title: "Premium Comfort", text: "obsessive focus on high-quality fabrics, perfect fits, and durable materials.", icon: "✨", img: fabricWovenImg },
                                { title: "Timeless Style", text: "creating enduring pieces that stay relevant season after season.", icon: "🛡️", img: concreteArchImg },
                                { title: "Community First", text: "we grow with our community—every customer is part of the journey.", icon: "🔥", img: streetwearDetailImg },
                            ].map((pillar, idx) => (
                                <motion.div 
                                    key={pillar.title}
                                    animate={visibleSections['diff'] ? "visible" : "hidden"} variants={fadeUpVariants} custom={idx}
                                    className="relative w-full h-[450px] group rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 flex flex-col justify-end p-8"
                                >
                                    {/* Parallax Image Background */}
                                    <div className="absolute inset-0 z-0">
                                        <img src={pillar.img} alt={pillar.title} className="w-full h-full object-cover opacity-60 transition-transform duration-[4s] ease-linear group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                    </div>
                                    
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <div className="text-3xl mb-4 group-hover:-translate-y-2 transition-transform">{pillar.icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-sm font-medium text-zinc-300 leading-relaxed group-hover:text-white transition-colors">
                                            {pillar.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ========================================= */}
                    {/* SECTION 5: CTA (JOIN THE MOVEMENT) */}
                    {/* ========================================= */}
                    <section id="cta" ref={el => sectionRefs.current['cta'] = el} className="flex flex-col items-center text-center py-20 bg-black/40 border border-white/10 rounded-[3rem] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                        
                        <motion.div animate={visibleSections['cta'] ? "visible" : "hidden"} variants={fadeUpVariants} className="relative z-10 flex flex-col items-center px-6">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter leading-tight mb-6">
                                Join the Movement.
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-tight leading-snug mb-12 max-w-2xl">
                                Sarvantra is not just a brand you wear—it is a statement you live. <span className="text-white">Wear Your Identity. Define Your Style. Become Sarvantra.</span>
                            </p>
                            <Link to="/store" className="bg-cyan-400 hover:bg-white text-black font-bold py-4 px-12 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 block text-base flex items-center gap-2">
                                Shop the Gear
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7 7H3" /></svg>
                            </Link>
                        </motion.div>
                    </section>

                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;