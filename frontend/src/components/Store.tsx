import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { particles } from '../utils/constants.js'; 
import "./Store.css"

// --- Types ---
interface ProductOption {
    mp_sizes_to_stock: Record<string, number>;
    price: number;
    originalPrice?: number; 
    priceAdjustment: number;
    tax: number;
    images: string[];
    videos: string[];
}

interface Product {
    _id: string;
    title: string;
    product_type: string;
    gender: string;
    description?: string;
    product_options: Record<string, ProductOption>;
    product_reviews_id: string;
    rating: number;
    reviewCount: number;
    pastMonthSales?: string; 
    deliveryEstimate?: string; 
    isLowStock?: boolean; 
    fastDelivery?: boolean; 
}

interface ProductCardProps {
    product: Product;
    navigate: ReturnType<typeof useNavigate>;
    expandingId: string | null;
    setExpandingId: (id: string | null) => void;
}

// --- Smooth Animation Configs ---
const smoothSpring = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 };
const easeOutCirc = [0.0, 0.55, 0.45, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutCirc } },
};

const headerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutCirc } }
};

const skeletonContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const skeletonVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutCirc } }
};

const Shimmer = () => (
    <motion.div
        className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatDelay: 0.3 }}
    />
);

// Expanded mock data with Amazon-style properties
const mockProducts: Product[] = [
    {
        _id: "prod_8fa92b3c4d5e",
        title: "AeroShell Premium Anorak",
        description: "Stylish olive-green hoodie crafted from premium organic fabric.",
        product_type: "Outerwear",
        gender: "mens",
        rating: 4.8,
        reviewCount: 1243,
        pastMonthSales: "2K+ bought in past month",
        deliveryEstimate: "Tomorrow, Mar 15",
        isLowStock: false,
        fastDelivery: true,
        product_reviews_id: "rev_92b3c4d5e8fa",
        product_options: {
            "Obsidian Black": {
                mp_sizes_to_stock: { XS: 5, S: 12, M: 0, L: 24, XL: 8 },
                price: 190.50,
                originalPrice: 250.00,
                priceAdjustment: 0,
                tax: 18.5,
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"],
                videos: []
            }
        }
    },
    {
        _id: "prod_102",
        title: "Pace Breaker Shorts",
        description: "Lightweight, sweat-wicking shorts designed for high-intensity training sessions.",
        product_type: "Bottoms",
        gender: "mens",
        rating: 4.6,
        reviewCount: 89,
        pastMonthSales: "500+ bought in past month",
        deliveryEstimate: "Monday, Mar 17",
        isLowStock: true,
        fastDelivery: false,
        product_reviews_id: "rev_102",
        product_options: {
            "Navy Blue": {
                mp_sizes_to_stock: { M: 20, L: 20 },
                price: 68.00,
                priceAdjustment: 0,
                tax: 5,
                images: ["https://images.unsplash.com/photo-1593032465171-8a6f6c1c9f45?auto=format&fit=crop&w=600&q=80"],
                videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"]
            }
        }
    },
    {
        _id: "prod_8fa92b3c4de",
        title: "Utility Cargo Pants",
        description: "Durable cotton-blend cargo pants featuring multiple utility pockets.",
        product_type: "Bottoms",
        gender: "mens",
        rating: 4.2,
        reviewCount: 312,
        deliveryEstimate: "Sunday, Mar 16",
        isLowStock: false,
        fastDelivery: true,
        product_reviews_id: "rev_92b3c4d5e8fa",
        product_options: {
            "Olive Green": {
                mp_sizes_to_stock: { XS: 5, S: 12, M: 5, L: 24, XL: 8 },
                price: 130.00,
                priceAdjustment: 0,
                tax: 18.5,
                images: ["https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=800&q=80"],
                videos: []
            }
        }
    },
    {
        _id: "prod_new1",
        title: "Essential Oversized Tee",
        description: "Heavyweight cotton oversized t-shirt for daily wear.",
        product_type: "Tops",
        gender: "unisex",
        rating: 4.9,
        reviewCount: 8920,
        pastMonthSales: "10K+ bought in past month",
        deliveryEstimate: "Tomorrow, Mar 15",
        isLowStock: false,
        fastDelivery: true,
        product_reviews_id: "rev_new1",
        product_options: {
            "White": {
                mp_sizes_to_stock: { S: 100, M: 200, L: 150 },
                price: 35.00,
                originalPrice: 50.00,
                priceAdjustment: 0,
                tax: 2.5,
                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
                videos: []
            }
        }
    }
];

const SkeletonCard = () => (
    <motion.div variants={skeletonVariants} className="flex flex-col w-full bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2.5rem] overflow-hidden">
        <div className="w-full aspect-square bg-white/5 rounded-[2rem] mb-3 relative overflow-hidden">
            <Shimmer />
        </div>
        <div className="flex justify-between items-center px-3 pb-3">
            <div className="flex flex-col gap-2 w-2/3">
                <div className="h-3 bg-white/10 w-full rounded-full relative overflow-hidden"><Shimmer /></div>
                <div className="h-4 bg-white/5 w-1/2 rounded-full relative overflow-hidden mt-1"><Shimmer /></div>
            </div>
            <div className="h-10 w-10 bg-white/10 rounded-full relative overflow-hidden"><Shimmer /></div>
        </div>
    </motion.div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, navigate, expandingId, setExpandingId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const optionKeys = Object.keys(product.product_options || {});
    const firstOptionKey = optionKeys[0];
    const defaultOption = firstOptionKey ? product.product_options[firstOptionKey] : null;

    const displayImage = defaultOption?.images?.[0] || 'https://via.placeholder.com/500?text=No+Image';
    const displayVideo = defaultOption?.videos?.[0];
    const displayPrice = (defaultOption?.price || 0) + (defaultOption?.priceAdjustment || 0);
    const originalPrice = defaultOption?.originalPrice;
    const isSale = !!originalPrice;

    const isExpanding = expandingId === product._id;
    const isOtherExpanding = expandingId !== null && !isExpanding;

    // Autoplay videos when visible on desktop/laptop views
    useEffect(() => {
        const isDesktop = window.innerWidth >= 1024;
        
        if (!isDesktop || !displayVideo || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsPlaying(true);
                    videoRef.current?.play().catch(() => {});
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.2 } // Trigger when 20% visible
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [displayVideo]);

    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

    // Keep manual interaction for mobile/tablet
    const handleInteractionStart = () => {
        if (expandingId || window.innerWidth >= 1024) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsPlaying(true);
            if (videoRef.current && displayVideo) videoRef.current.play().catch(() => {});
        }, 150);
    };

    const handleCardClick = () => {
        if (expandingId) return;
        setExpandingId(product._id);
        setTimeout(() => {
            navigate(`/store/product/${product._id}`);
            setTimeout(() => setExpandingId(null), 50); 
        }, 600); 
    };

    return (
        <motion.div
            ref={containerRef}
            variants={cardVariants}
            animate={isOtherExpanding ? { opacity: 0, scale: 0.95, transition: { duration: 0.3 } } : "visible"}
            onClick={handleCardClick}
            onMouseEnter={handleInteractionStart}
            onTouchStart={handleInteractionStart}
            className={`flex flex-col cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2.5rem] shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all duration-300 ${!isExpanding ? 'group' : ''}`}
        >
            <motion.div
                layoutId={`card-image-${product._id}`}
                transition={smoothSpring}
                style={{ borderRadius: 32 }} 
                className="relative w-full aspect-square overflow-hidden bg-zinc-900 origin-top mb-3"
            >
                <img
                    src={displayImage}
                    alt={product.title}
                    loading="lazy"
                    className={`absolute inset-0 object-cover h-full w-full ${!isExpanding ? 'transition-transform duration-700 group-hover:scale-105' : ''} ${displayVideo && isPlaying ? 'opacity-0' : 'opacity-100'}`}
                />
                {displayVideo && (
                    <video
                        ref={videoRef}
                        src={displayVideo}
                        muted playsInline loop
                        className={`absolute inset-0 object-cover h-full w-full transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}
                
                {/* Floating Bubble Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isSale && (
                        <span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg">
                            SALE -{Math.round((1 - displayPrice/originalPrice) * 100)}%
                        </span>
                    )}
                    {product.fastDelivery && (
                        <span className="bg-cyan-400 text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            FAST
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Compact Details Section */}
            <motion.div animate={{ opacity: expandingId ? 0 : 1, transition: { duration: 0.2 } }} className="flex justify-between items-end px-3 pb-2">
                <div className="flex flex-col w-[75%]">
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{product.product_type}</p>
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                        {product.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-bold text-white leading-none">
                            ${displayPrice.toFixed(2)}
                        </span>
                        {isSale && (
                            <span className="text-[10px] text-zinc-500 line-through font-medium">
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Circular Add Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-cyan-400 hover:scale-105 transition-all shadow-md shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </motion.div>
        </motion.div>
    );
};

// --- Custom Toggle Switch Component ---
const ToggleSwitch = ({ label, isChecked, onChange }: { label: string, isChecked: boolean, onChange: () => void }) => (
    <label className="flex items-center justify-between cursor-pointer group w-full">
        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</span>
        <div className="relative">
            <input type="checkbox" className="hidden" checked={isChecked} onChange={onChange} />
            <div className={`w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${isChecked ? 'bg-cyan-400' : 'bg-white/10'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${isChecked ? 'transform translate-x-4' : ''}`}></div>
        </div>
    </label>
);

const Store: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandingId, setExpandingId] = useState<string | null>(null);
    
    // Filters
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState<number>(300);
    const [showSaleOnly, setShowSaleOnly] = useState<boolean>(false);
    const [fastDeliveryOnly, setFastDeliveryOnly] = useState<boolean>(false);
    
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const navigate = useNavigate();
    const params = useParams<{ gender: string }>();
    const gender = params.gender;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                setTimeout(() => {
                    setProducts(mockProducts);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [gender]);

    const availableTypes = Array.from(new Set(products.map((p) => p.product_type)));
    
    const toggleTypeFilter = (type: string) => {
        setSelectedTypes((prev) => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const filteredProducts = products.filter((product) => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(product.product_type)) return false;
        
        const price = Object.values(product.product_options)[0]?.price || 0;
        if (price > maxPrice) return false;
        
        const hasOriginalPrice = !!Object.values(product.product_options)[0]?.originalPrice;
        if (showSaleOnly && !hasOriginalPrice) return false;

        if (fastDeliveryOnly && !product.fastDelivery) return false;
        
        return true;
    });

    const FilterContent = () => (
        <div className="flex flex-col gap-8 w-full">
            {/* Bubble Category Filter */}
            <div>
                <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">
                    Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {availableTypes.map((type) => (
                        <button 
                            key={type} 
                            onClick={() => toggleTypeFilter(type)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedTypes.includes(type) ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Toggles */}
            <div className="border-t border-white/10 pt-6">
                <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">Shopping Preferences</h3>
                <div className="flex flex-col gap-4">
                    <ToggleSwitch label="Sale & Discounts" isChecked={showSaleOnly} onChange={() => setShowSaleOnly(!showSaleOnly)} />
                    <ToggleSwitch label="GLAM-FAST Delivery" isChecked={fastDeliveryOnly} onChange={() => setFastDeliveryOnly(!fastDeliveryOnly)} />
                </div>
            </div>

            {/* Price Slider */}
            <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Max Price</h3>
                    <span className="text-xs font-bold text-black bg-cyan-400 px-3 py-1 rounded-full">${maxPrice}</span>
                </div>
                <input 
                    type="range" 
                    min="0" max="500" step="10"
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                    <span>$0</span>
                    <span>$500+</span>
                </div>
            </div>

            {/* Clear Filters Bubble */}
            {(selectedTypes.length > 0 || maxPrice < 500 || showSaleOnly || fastDeliveryOnly) && (
                <div className="border-t border-white/10 pt-6">
                    <button 
                        onClick={() => { setSelectedTypes([]); setMaxPrice(500); setShowSaleOnly(false); setFastDeliveryOnly(false); }} 
                        className="w-full text-xs text-white border border-white/20 hover:bg-white hover:text-black py-3 rounded-full font-bold transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );

    const expandingProduct = products.find(p => p._id === expandingId);
    const expandingOptionKey = expandingProduct ? Object.keys(expandingProduct.product_options || {})[0] : null;
    const expandingImage = expandingOptionKey ? expandingProduct?.product_options[expandingOptionKey]?.images?.[0] : '';

    return (
        <div className="min-h-screen pt-28 pb-24 px-4 md:px-6 lg:px-8 font-sans text-white relative bg-black selection:bg-cyan-500 selection:text-black">
            
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_2px_#06b6d4] opacity-60 animate-pulse" />
                <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_2px_#a855f7] opacity-50" />
                {particles.map((p, i) => (
                  <div key={i} className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-40 ${p.pulse ? "animate-pulse" : ""}`} style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }} />
                ))}
            </div>

            {/* Expansion Overlay */}
            <AnimatePresence>
                {expandingId && expandingProduct && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]" />
                        <div className="fixed inset-0 z-[100] pointer-events-none flex justify-center items-center px-4 md:px-8">
                            <div className="w-full max-w-7xl flex gap-12">
                                <div className="w-full lg:w-4/12 flex gap-4">
                                    <motion.div layoutId={`card-image-${expandingId}`} transition={smoothSpring} style={{ borderRadius: 32 }} className="bg-zinc-900 overflow-hidden h-[400px] sm:h-[500px] w-full relative shadow-2xl">
                                        <img src={expandingImage} alt={expandingProduct.title} className="w-full h-full object-cover" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Reduced max-width from 1600px to 1280px to narrow the main boxes */}
            <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col gap-8 md:gap-12">
                
                {/* Top Promo Banner */}
                <motion.div 
                    variants={headerVariants} 
                    initial="hidden" 
                    animate={expandingId ? { opacity: 0 } : "visible"}
                    className="relative w-full h-[350px] md:h-[450px] rounded-[3rem] overflow-hidden flex items-center justify-center group shadow-2xl border border-white/10"
                >
                    <img
                        src="https://thumbs.dreamstime.com/b/pink-dahlia-flower-details-macro-photo-border-frame-wide-banner-background-message-wedding-background-pink-dahlia-flower-117406512.jpg"
                        alt="Summer Essentials Collection"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-700 pointer-events-none" />

                    <div className="relative z-10 text-center px-6 max-w-2xl flex flex-col items-center pointer-events-auto">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4 inline-block">
                            Sponsored Brand
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Summer Essentials</h2>
                        <p className="text-zinc-200 mb-8 text-sm md:text-base leading-relaxed">
                            Upgrade your wardrobe with our new lightweight fabrics. Prime members get early access.
                        </p>
                        <button className="bg-cyan-400 text-black px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            Shop the Collection
                        </button>
                    </div>
                </motion.div>

                {/* Massive "LandingStore" Wrapper with heavily increased padding (p-6 md:p-10 lg:p-12) */}
                <motion.div 
                    variants={headerVariants} 
                    initial="hidden" 
                    animate={expandingId ? { opacity: 0 } : "visible"}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-10 lg:p-12 shadow-2xl"
                >
                    {/* Header Inside Wrapper */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white capitalize mb-1">
                                {gender ? `${gender}'s Apparel` : 'Featured Products'}
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                Showing {filteredProducts.length} items
                            </p>
                        </div>
                        
                        <button onClick={() => setIsMobileFilterOpen(true)} className="md:hidden flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm font-bold text-white hover:bg-white/20 transition-colors shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filters
                        </button>
                    </div>

                    <div className="flex gap-6 lg:gap-8 items-start">
                        {/* Desktop Sidebar Panel */}
                        <aside className="hidden md:block w-[240px] flex-shrink-0 sticky top-28 bg-black/20 border border-white/5 p-6 rounded-[2rem]">
                            <FilterContent />
                        </aside>

                        {/* Mobile Drawer */}
                        <AnimatePresence>
                            {isMobileFilterOpen && (
                                <>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" />
                                    <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-zinc-950/95 backdrop-blur-3xl z-50 p-6 shadow-2xl overflow-y-auto md:hidden rounded-r-[2.5rem] border-r border-white/10">
                                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Refine Search</h2>
                                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/20 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <FilterContent />
                                        <div className="mt-8 pt-4">
                                            <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-cyan-400 text-black py-4 rounded-full font-bold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">View {filteredProducts.length} Items</button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Product Grid */}
                        <div className="flex-1 w-full">
                            {isLoading ? (
                                <motion.div variants={skeletonContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                                    {[...Array(6)].map((_, index) => <SkeletonCard key={index} />)}
                                </motion.div>
                            ) : (
                                <motion.div key={`${selectedTypes.join(',')}-${maxPrice}-${showSaleOnly}-${fastDeliveryOnly}`} variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                                    {filteredProducts.length === 0 ? (
                                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-black/20 rounded-[2.5rem] border border-white/5">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                            </div>
                                            <h2 className="text-xl text-white font-bold">No items match your criteria</h2>
                                            <p className="text-zinc-400 text-sm mt-2 mb-6">Try expanding your search by adjusting the filters.</p>
                                            <button onClick={() => { setSelectedTypes([]); setMaxPrice(500); setShowSaleOnly(false); setFastDeliveryOnly(false); }} className="text-black bg-white px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors">
                                                Clear all filters
                                            </button>
                                        </div>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <ProductCard key={product._id} product={product} navigate={navigate} expandingId={expandingId} setExpandingId={setExpandingId} />
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Store;