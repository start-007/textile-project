import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from "../utils/useCartStore.js";
import { URLS, API_BASE_URL } from '../utils/constants.js';

// --- Types ---
interface ProductOption {
    mp_sizes_to_stock: Record<string, number>;
    price: number;
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
    product_options: Record<string, ProductOption>;
    product_reviews_id: string;
    rating: number;
    reviewCount: number;
}

interface ProductCardProps {
    product: Product;
    navigate: ReturnType<typeof useNavigate>;
    handleAddToCart: (e: React.MouseEvent, product: Product) => void;
}

// --- Animation Variants (Premium, Fluid, No Bounce) ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }, 
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: easeOutQuart }
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: easeOutQuart } 
    }
};
const mockProducts: Product[] = [
    {
        _id: "prod_101",
        title: "AeroSwift Motion Windbreaker",
        product_type: "Jacket",
        gender: "mens",
        rating: 4.9,
        reviewCount: 142,
        product_reviews_id: "rev_101",
        product_options: {
            "Onyx Black": {
                mp_sizes_to_stock: { "S": 10, "M": 15, "L": 5, "XL": 2 },
                price: 128,
                priceAdjustment: 0,
                tax: 10,
                // High-quality vertical placeholder image
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&h=750&q=80"],
                // Standard W3C sample video for testing playback
                videos: ["https://www.w3schools.com/html/mov_bbb.mp4"] 
            }
        }
    },
    {
        _id: "prod_102",
        title: "Pace Breaker Training Shorts",
        product_type: "Bottoms",
        gender: "mens",
        rating: 4.6,
        reviewCount: 89,
        product_reviews_id: "rev_102",
        product_options: {
            "Navy Blue": {
                mp_sizes_to_stock: { "M": 20, "L": 20 },
                price: 68,
                priceAdjustment: 0,
                tax: 5,
                images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: [] // Empty video array to test fallback
            },
            "Olive Green": {
                mp_sizes_to_stock: { "S": 5, "M": 10 },
                price: 68,
                priceAdjustment: 0,
                tax: 5,
                images: ["https://images.unsplash.com/photo-1533682805518-48d1f5e8cd3e?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: []
            }
        }
    },
    {
        _id: "prod_104",
        title: "Pace Breaker Training Shorts",
        product_type: "Bottoms",
        gender: "mens",
        rating: 4.6,
        reviewCount: 89,
        product_reviews_id: "rev_102",
        product_options: {
            "Navy Blue": {
                mp_sizes_to_stock: { "M": 20, "L": 20 },
                price: 68,
                priceAdjustment: 0,
                tax: 5,
                images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: [] // Empty video array to test fallback
            },
            "Olive Green": {
                mp_sizes_to_stock: { "S": 5, "M": 10 },
                price: 68,
                priceAdjustment: 0,
                tax: 5,
                images: ["https://images.unsplash.com/photo-1533682805518-48d1f5e8cd3e?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: []
            }
        }
    },
    
    
    

    {
        _id: "prod_103",
        title: "Everyday Core Hoodie",
        product_type: "Fleece",
        gender: "mens",
        rating: 0, // Tests the "New" logic
        reviewCount: 0,
        product_reviews_id: "rev_103",
        product_options: {
            "Heather Grey": {
                mp_sizes_to_stock: { "S": 8, "M": 12, "L": 12 },
                price: 88,
                priceAdjustment: -10, // Tests price adjustment math
                tax: 7,
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: ["https://www.w3schools.com/html/mov_bbb.mp4"]
            }
        }
    },
    {
        _id: "prod_107",
        title: "Everyday Core Hoodie",
        product_type: "Fleece",
        gender: "mens",
        rating: 0, // Tests the "New" logic
        reviewCount: 0,
        product_reviews_id: "rev_103",
        product_options: {
            "Heather Grey": {
                mp_sizes_to_stock: { "S": 8, "M": 12, "L": 12 },
                price: 88,
                priceAdjustment: -10, // Tests price adjustment math
                tax: 7,
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: ["https://www.w3schools.com/html/mov_bbb.mp4"]
            }
        }
    },
    {
        _id: "prod_108",
        title: "Everyday Core Hoodie",
        product_type: "Fleece",
        gender: "mens",
        rating: 0, // Tests the "New" logic
        reviewCount: 0,
        product_reviews_id: "rev_103",
        product_options: {
            "Heather Grey": {
                mp_sizes_to_stock: { "S": 8, "M": 12, "L": 12 },
                price: 88,
                priceAdjustment: -10, // Tests price adjustment math
                tax: 7,
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&h=750&q=80"],
                videos: ["https://www.w3schools.com/html/mov_bbb.mp4"]
            }
        }
    }

];

// --- Sub-components ---
const SkeletonCard = () => (
    <div className="flex flex-col w-full animate-pulse">
        {/* Changed from aspect-[4/5] to aspect-square to reduce height */}
        <div className="w-full aspect-square bg-gray-200 rounded-3xl mb-4"></div>
        {/* Text Placeholders */}
        <div className="flex justify-between items-start mb-2">
            <div className="h-5 bg-gray-200 w-2/3 rounded-md"></div>
            <div className="h-5 bg-gray-200 w-1/4 rounded-md"></div>
        </div>
        <div className="h-4 bg-gray-200 w-1/3 rounded-md mb-4"></div>
        {/* Button Placeholder */}
        <div className="h-10 bg-gray-200 w-full rounded-xl mt-auto"></div>
    </div>
);

// Individual Product Card Component to handle Video Hover Logic
const ProductCard: React.FC<ProductCardProps> = ({ product, navigate, handleAddToCart }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // To track our 500ms timer
    const [isHovered, setIsHovered] = useState(false); 
    
    const optionKeys = Object.keys(product.product_options || {});
    const firstOptionKey = optionKeys[0];
    const defaultOption = firstOptionKey ? product.product_options[firstOptionKey] : null;
    
    const displayImage = defaultOption?.images?.[0] || 'https://via.placeholder.com/500?text=No+Image';
    const displayVideo = defaultOption?.videos?.[0]; 
    const displayPrice = (defaultOption?.price || 0) + (defaultOption?.priceAdjustment || 0);
    const colorCount = optionKeys.length;
    
    const rating = product.rating || 0;
    const reviewCount = product.reviewCount || 0;

    // Cleanup timer if the component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleInteractionStart = () => {
        // 1. Clear any existing timer just to be safe
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // 2. Start a 500ms countdown before showing/playing the video
        timeoutRef.current = setTimeout(() => {
            setIsHovered(true);
            if (videoRef.current && displayVideo) {
                videoRef.current.play().catch(error => console.log("Video auto-play prevented:", error));
            }
        }, 250);
    };

    const handleInteractionEnd = () => {
        // 1. If they scroll or move away BEFORE 500ms, cancel the timer!
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        // 2. Reset the video state
        setIsHovered(false);
        if (videoRef.current && displayVideo) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; 
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            onClick={() => navigate(`/store/product/${product._id}`)}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart} 
            onTouchEnd={handleInteractionEnd}     
            onTouchCancel={handleInteractionEnd}  
            className="group flex flex-col cursor-pointer"
        >
            {/* Image / Video Container */}
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-3xl bg-gray-100">
                {/* Base Image */}
                <img
                    src={displayImage}
                    alt={product.title}
                    loading="lazy"
                    className={`absolute inset-0 object-cover h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 ${displayVideo && isHovered ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {/* Hover Video Overlay */}
                {displayVideo && (
                    <video
                        ref={videoRef}
                        src={displayVideo}
                        muted
                        playsInline
                        loop
                        className={`absolute inset-0 object-cover h-full w-full transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}
                
                {/* Top Left Pill Tag */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-black/5">
                    <span className="text-[11px] font-semibold text-black uppercase tracking-widest">
                        {product.product_type}
                    </span>
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none"></div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col px-1">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors duration-300">
                        {product.title}
                    </h3>
                    <span className="text-base font-medium text-black shrink-0">
                        ${Math.floor(displayPrice)}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-1.5">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                            {rating > 0 ? rating.toFixed(1) : 'New'}
                        </span>
                        <span className="text-sm text-gray-400 font-normal">
                            ({reviewCount})
                        </span>
                    </div>

                    {colorCount > 1 && (
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                            {colorCount} Colors
                        </span>
                    )}
                </div>

                <button
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label="Add to Cart"
                    className="mt-4 w-full py-2.5 rounded-xl border transition-all duration-300 flex justify-center items-center gap-2 group/btn 
                               bg-black text-white border-black 
                               lg:bg-white lg:text-black lg:border-gray-200 lg:hover:bg-black lg:hover:text-white lg:hover:border-black"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
};
const Store: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const addToCart = useCartStore((state) => state.addToCart);
    const params = useParams<{ gender: string }>(); 
    const gender = params.gender;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); 
            
            try {
                const response = await fetch(`${API_BASE_URL}/${URLS.STORE}/${gender}`);
                const data = await response.json();
                
                setTimeout(() => {
                    setProducts(mockProducts);
                    setIsLoading(false);
                }, 600);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [gender]);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation(); 
        addToCart(product);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-36 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <motion.div 
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black capitalize">
                        {gender ? `${gender}'s Collection` : 'Featured Apparel'}
                    </h1>
                    <p className="text-gray-500 font-light text-lg md:max-w-xs">
                        Engineered for performance, designed for everyday movement.
                    </p>
                </motion.div>

                {isLoading ? (
                    // Skeleton Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : (
                    // Actual Product Grid
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                    >
                        {products.length === 0 ? (
                            <h2 className="text-2xl text-gray-400 font-light col-span-full text-center py-20">
                                No products found.
                            </h2>
                        ) : null}

                        {products.map((product) => (
                            <ProductCard 
                                key={product._id} 
                                product={product} 
                                navigate={navigate} 
                                handleAddToCart={handleAddToCart} 
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Store;