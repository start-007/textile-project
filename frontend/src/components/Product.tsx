import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ProductReviews from './ProductReviews';
import { URLS, API_BASE_URL } from '../utils/constants.js';
import { useCartStore } from '../utils/useCartStore.js'
import { particles } from '../utils/constants.js'; 

// --- Types ---
interface ProductOption {
    mp_sizes_to_stock: Record<string, number>;
    price: number;
    priceAdjustment: number;
    tax: number;
    images: string[];
    videos: string[];
}

interface DeliveryFee {
    base_fee: number;
    price_per_km: number;
    min_km: number;
    max_km: number;
}

interface ProductDetails {
    _id: string;
    title: string;
    title_image: string;
    product_type: string;
    mp_des_title_to_description: Record<string, string>;
    gender: string;
    product_options: Record<string, ProductOption>;
    mp_delivery_type_to_fee: Record<string, DeliveryFee>;
    product_reviews_id: string;
    product_image: string[];
    product_video: string[];
    __v?: number;
    rating?: number;
    reviewsCount?: number;
}

// --- Animation Variants ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: easeOutQuart, staggerChildren: 0.1 }
    }
};
// --- Animation Variants ---

// ADD THIS MISSING BLOCK:
const headerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: easeOutQuart } 
    }
};
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: easeOutQuart }
    }
};

const mock_data: ProductDetails = {
    _id: "prod_8fa92b3c4d5e", 
    title: "AeroShell Premium Anorak",
    title_image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    product_type: "Outerwear",
    mp_des_title_to_description: {
        Material: "Triple-layer waterproof breathable membrane",
        Fit: "Articulated, relaxed fit designed for modular layering",
        Care: "Machine wash cold, lay flat to dry",
        Features: "Seam-sealed interior, waterproof aquaguard zippers, hidden utility pockets",
    },
    gender: "Men",
    product_options: {
        "Obsidian Black": {
            mp_sizes_to_stock: { XS: 5, S: 12, M: 0, L: 24, XL: 8 },
            price: 245.0,
            priceAdjustment: 0,
            tax: 18.5,
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800",
            ],
            videos: [],
        },
        "Glacier White": {
            mp_sizes_to_stock: { XS: 2, S: 8, M: 15, L: 10, XL: 0 },
            price: 245.0,
            priceAdjustment: 15.0,
            tax: 19.5,
            images: [
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
            ],
            videos: [],
        },
    },
    mp_delivery_type_to_fee: {
        standard: { base_fee: 0, price_per_km: 0, min_km: 0, max_km: 9999 },
        express: { base_fee: 15, price_per_km: 0.5, min_km: 0, max_km: 500 },
        "next-day": { base_fee: 25, price_per_km: 1.2, min_km: 0, max_km: 100 },
    },
    product_reviews_id: "rev_92b3c4d5e8fa",
    product_image: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"],
    product_video: [],
    __v: 1,
    rating: 4.8,
    reviewsCount: 342,
};

// --- Main Product Component ---
const Product: React.FC = () => {
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    
    // Alert State
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    // Selection State
    const [selectedOptionKey, setSelectedOptionKey] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    // Lazy Loading Reviews State
    const reviewsRef = useRef<HTMLDivElement>(null);
    const param = useParams<{ id: string }>();
    const productId = param.id || mock_data._id; 
    
    const currentOption = product && selectedOptionKey ? product.product_options[selectedOptionKey] : null;
    const currentPrice = currentOption ? currentOption.price + (currentOption.priceAdjustment || 0) : 0;
    const currentStock = currentOption && selectedSize ? currentOption.mp_sizes_to_stock[selectedSize] || 0 : 0;
    const inStock = currentStock > 0;

    const currentGallery = currentOption && currentOption.images.length > 0
        ? currentOption.images
        : product?.product_image || [product?.title_image || ""];
    const mainImage = currentGallery[activeImageIndex] || currentGallery[0];

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: ProductDetails) => {
        e.preventDefault();

        if (!selectedOptionKey || !selectedSize || !currentOption) {
            console.warn("Please select a color and size before adding to cart.");
            return;
        }

        const cartItem = {
            productId: product._id,
            title: product.title,
            color: selectedOptionKey,
            size: selectedSize,
            quantity: quantity,
            price: currentPrice,
            image: mainImage, 
            tax: currentOption.tax,
        };

        addToCart(cartItem);
        setShowAlert(true);
        
        if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
        alertTimerRef.current = setTimeout(() => setShowAlert(false), 1500);
    };

    useEffect(() => {
        return () => { if (alertTimerRef.current) clearTimeout(alertTimerRef.current); };
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                window.scrollTo(0,0)
                const data = mock_data;
                setProduct(data);

                if (data?.product_options) {
                    const firstOptionKey = Object.keys(data.product_options)[0];
                    if (firstOptionKey) {
                        setSelectedOptionKey(firstOptionKey);
                        const sizesToStock = data.product_options[firstOptionKey].mp_sizes_to_stock;
                        if (sizesToStock) {
                            const firstSize = Object.keys(sizesToStock).find(size => sizesToStock[size] > 0);
                            if (firstSize) setSelectedSize(firstSize);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        };
        fetchProduct();
    }, [productId]);

    const renderStars = (rating: number = 5) => {
        return (
            <div className="flex text-cyan-400 text-sm gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-white/20 fill-current'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
        );
    };

    if (!product) return null; 

    return (
       <div className="min-h-screen bg-black pt-32 pb-24 px-4 md:px-6 lg:px-8 font-sans text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Background Layer (Matching Store) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_2px_#06b6d4] opacity-60 animate-pulse" />
                <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_2px_#a855f7] opacity-50" />
                {particles.map((p, i) => (
                  <div key={i} className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-40 ${p.pulse ? "animate-pulse" : ""}`} style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }} />
                ))}
            </div>

            {/* ADDED TO CART ALERT */}
            <div 
                className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none transition-all duration-300 ease-out flex items-center gap-2.5 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-300 text-[14px] font-bold tracking-wide
                ${showAlert ? 'opacity-100 translate-y-0 bg-cyan-400 text-black' : 'opacity-0 -translate-y-4 bg-cyan-400 text-black'}`}
            >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Added to cart
            </div>

            {/* Main Content Constrained & Nested in Mega Wrappers */}
            <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col gap-8 md:gap-12">
                
                {/* 1. Mega "LandingStore" Wrapper for Product Details */}
                <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-10 lg:p-12 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                        
                        {/* Left Column: Premium Image Gallery */}
                        <div className="w-full lg:w-5/12 flex flex-col-reverse sm:flex-row gap-4 order-1">
                            {/* Thumbnails */}
                            <motion.div variants={itemVariants} className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0 pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {currentGallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative rounded-[1rem] overflow-hidden transition-all duration-300 shrink-0 w-16 h-16 sm:w-full sm:h-20 border-2
                                            ${activeImageIndex === idx
                                                ? 'border-cyan-400 opacity-100 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                                : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/30'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full bg-white/5" />
                                    </button>
                                ))}
                            </motion.div>

                            {/* Main Image */}
                            <motion.div layoutId={`card-image-${productId}`} className="bg-white/5 rounded-[2.5rem] overflow-hidden h-[350px] sm:h-[500px] flex-1 relative shadow-2xl border border-white/10">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={mainImage}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                                        src={mainImage}
                                        alt={product.title}
                                        className="object-cover w-full h-full"
                                    />
                                </AnimatePresence>
                                {/* Floating Product Type Pill */}
                                <motion.div variants={itemVariants} className="absolute top-5 left-5 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                        {product.product_type}
                                    </span>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Middle Column: Editorial Product Details */}
                        <motion.div variants={itemVariants} className="w-full lg:w-4/12 flex flex-col pr-0 lg:pr-4 order-3 lg:order-2">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                                {product.gender}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                {renderStars(product.rating)}
                                <span className="text-sm text-zinc-400 hover:text-white font-medium transition-colors border-b border-zinc-600 hover:border-white">
                                    {product.reviewsCount} reviews
                                </span>
                            </div>

                            <hr className="border-white/10 mb-8" />

                            <div className="space-y-5 mb-8">
                                {Object.entries(product.mp_des_title_to_description).map(([key, value]) => (
                                    <div key={key} className="flex gap-6">
                                        <span className="text-xs font-bold text-zinc-500 w-24 shrink-0 uppercase tracking-widest">{key}</span>
                                        <span className="text-zinc-300 text-sm font-medium leading-relaxed">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-white/10 mb-8" />

                            {/* Delivery Options */}
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Delivery Options</h3>
                                <div className="space-y-3">
                                    {Object.entries(product.mp_delivery_type_to_fee).map(([type, fee]) => (
                                        <div key={type} className="flex justify-between items-center text-sm p-4 bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-white/10">
                                            <span className="capitalize text-white font-bold">{type} Delivery</span>
                                            <span className="text-cyan-400 font-mono font-bold">${fee.base_fee.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Clean Buy Box */}
                        <motion.div variants={itemVariants} className="w-full lg:w-3/12 order-2 lg:order-3">
                            <div className="sticky top-28 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl">
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-white tracking-tight">${currentPrice.toFixed(2)}</span>
                                    {currentOption && currentOption.tax > 0 && (
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-2">+ ${currentOption.tax} estimated tax</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${inStock ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                {/* Color Selector */}
                                <div className="mb-6">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-3">
                                        Color: <span className="text-white ml-1">{selectedOptionKey}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(product.product_options).map(optKey => (
                                            <button
                                                key={optKey}
                                                onClick={() => {
                                                    setSelectedOptionKey(optKey);
                                                    setActiveImageIndex(0);
                                                    const firstSize = Object.keys(product.product_options[optKey].mp_sizes_to_stock)[0];
                                                    setSelectedSize(firstSize);
                                                    setQuantity(1);
                                                }}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${selectedOptionKey === optKey
                                                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] border-white'
                                                    : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {optKey}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector */}
                                {currentOption && (
                                    <div className="mb-8">
                                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-3">
                                            Size: <span className="text-white ml-1">{selectedSize}</span>
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(currentOption.mp_sizes_to_stock).map(([size, stock]) => {
                                                const isOutOfStock = stock === 0;
                                                return (
                                                    <button
                                                        key={size}
                                                        disabled={isOutOfStock}
                                                        onClick={() => { setSelectedSize(size); setQuantity(1); }}
                                                        className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 border ${selectedSize === size
                                                            ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] border-cyan-400'
                                                            : isOutOfStock
                                                                ? 'bg-transparent text-zinc-600 border-white/5 cursor-not-allowed line-through'
                                                                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity & Actions */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Quantity</span>
                                        <div className={`flex items-center border rounded-full overflow-hidden bg-white/5 ${inStock ? 'border-white/20' : 'border-white/5 opacity-50'}`}>
                                            <button disabled={!inStock} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-zinc-300 hover:bg-white/10 hover:text-white disabled:hover:bg-transparent font-bold transition-colors">-</button>
                                            <span className="px-2 py-2 text-white font-bold w-10 text-center">{quantity}</span>
                                            <button disabled={!inStock || quantity >= currentStock} onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-zinc-300 hover:bg-white/10 hover:text-white disabled:hover:bg-transparent font-bold transition-colors">+</button>
                                        </div>
                                    </div>

                                    <button disabled={!inStock} className="w-full bg-cyan-400 hover:bg-white disabled:bg-white/5 disabled:text-zinc-600 disabled:cursor-not-allowed text-black font-bold py-3.5 px-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                        Buy Now
                                    </button>
                                    <button onClick={(e) => { handleAddToCart(e, product) }} disabled={!inStock} className="w-full bg-white/5 backdrop-blur-md hover:bg-white/10 disabled:bg-transparent disabled:text-zinc-600 disabled:border-white/5 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-full transition-all duration-300 border border-white/20">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* 2. Mega Wrapper for Reviews */}
                <motion.div 
                    ref={reviewsRef}
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-10 lg:p-12 shadow-2xl"
                >
                    <ProductReviews productId={product._id} />
                </motion.div>

            </div>
        </div>
    );
};

export default Product;