import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    expandingId: string | null;
    setExpandingId: (id: string | null) => void;
}

// --- Animation Variants ---
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
        _id: "prod_8fa92b3c4d5e", // Matched ID to your Product.tsx mock data for seamless testing
        title: "AeroShell Anorak",
        product_type: "Outerwear",
        gender: "mens",
        rating: 4.8,
        reviewCount: 342,
        product_reviews_id: "rev_92b3c4d5e8fa",
        product_options: {
            "Obsidian Black": {
                mp_sizes_to_stock: { XS: 5, S: 12, M: 0, L: 24, XL: 8 },
                price: 245,
                priceAdjustment: 0,
                tax: 18.5,
                images: [
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
                ],
                videos: []
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
                mp_sizes_to_stock: { M: 20, L: 20 },
                price: 68,
                priceAdjustment: 0,
                tax: 5,
                images: [
                    "https://images.unsplash.com/photo-1593032465171-8a6f6c1c9f45?auto=format&fit=crop&w=600&q=80"
                ],
                videos: [
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                ]
            }
        }
    }
];

// --- Sub-components ---
const SkeletonCard = () => (
    <div className="flex flex-col w-full animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-3xl mb-4"></div>
        <div className="flex justify-between items-start mb-2">
            <div className="h-5 bg-gray-200 w-2/3 rounded-md"></div>
            <div className="h-5 bg-gray-200 w-1/4 rounded-md"></div>
        </div>
        <div className="h-4 bg-gray-200 w-1/3 rounded-md mb-4"></div>
        <div className="h-10 bg-gray-200 w-full rounded-xl mt-auto"></div>
    </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, navigate, handleAddToCart, expandingId, setExpandingId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const optionKeys = Object.keys(product.product_options || {});
    const firstOptionKey = optionKeys[0];
    const defaultOption = firstOptionKey ? product.product_options[firstOptionKey] : null;

    const displayImage = defaultOption?.images?.[0] || 'https://via.placeholder.com/500?text=No+Image';
    const displayVideo = defaultOption?.videos?.[0];
    const displayPrice = (defaultOption?.price || 0) + (defaultOption?.priceAdjustment || 0);
    const colorCount = optionKeys.length;

    const rating = product.rating || 0;
    const reviewCount = product.reviewCount || 0;

    const isExpanding = expandingId === product._id;
    const isOtherExpanding = expandingId !== null && !isExpanding;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleInteractionStart = () => {
        if (expandingId) return; 
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsPlaying(true);
            if (videoRef.current && displayVideo) {
                videoRef.current.play().catch(error => console.log("Video auto-play prevented:", error));
            }
        }, 250);
    };

    const handleCardClick = () => {
        if (expandingId) return;
        setExpandingId(product._id);
        
        // Wait exactly for the 0.8s animation duration to finish before routing
        setTimeout(() => {
            navigate(`/store/product/${product._id}`);
            setTimeout(() => setExpandingId(null), 100); 
        }, 800); 
    };

    return (
        <motion.div
            variants={cardVariants}
            animate={isOtherExpanding ? { opacity: 0, transition: { duration: 0.3 } } : "visible"}
            onClick={handleCardClick}
            onMouseEnter={handleInteractionStart}
            onTouchStart={handleInteractionStart}
            className="group flex flex-col cursor-pointer"
        >
            {/* The layoutId ties this card to the overlay animation target */}
            <motion.div 
                layoutId={`card-image-${product._id}`}
                className="relative w-full aspect-square mb-4 overflow-hidden rounded-3xl bg-white"
            >
                <img
                    src={displayImage}
                    alt={product.title}
                    loading="lazy"
                    className={`absolute inset-0 object-cover h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 ${displayVideo && isPlaying ? 'opacity-0' : 'opacity-100'}`}
                />

                {displayVideo && (
                    <video
                        ref={videoRef}
                        src={displayVideo}
                        muted
                        playsInline
                        loop
                        className={`absolute inset-0 object-cover h-full w-full transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                <motion.div animate={{ opacity: expandingId ? 0 : 1 }}>
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-black/5">
                        <span className="text-[11px] font-semibold text-black uppercase tracking-widest">
                            {product.product_type}
                        </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none"></div>
                </motion.div>
            </motion.div>

            <motion.div 
                animate={{ opacity: expandingId ? 0 : 1, transition: { duration: 0.3 } }}
                className="flex flex-col px-1"
            >
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
                            +{colorCount} Colors
                        </span>
                    )}
                </div>

                <button
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label="Add to Cart"
                    className="mt-4 w-full py-2.5 rounded-xl border transition-all duration-300 flex justify-center items-center gap-2 group/btn bg-black text-white border-black lg:bg-white lg:text-black lg:border-gray-200 lg:hover:bg-black lg:hover:text-white lg:hover:border-black"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                </button>
            </motion.div>
        </motion.div>
    );
};

const Store: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandingId, setExpandingId] = useState<string | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);
    const params = useParams<{ gender: string }>(); 
    const gender = params.gender;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); 
            try {
                setTimeout(() => {
                    setProducts(mockProducts);
                    setIsLoading(false);
                }, 600);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [gender]);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation(); 
        addToCart(product);
    };

    const availableTypes = Array.from(new Set(products.map((p) => p.product_type)));
    const toggleTypeFilter = (type: string) => {
        setSelectedTypes((prev) => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const filteredProducts = products.filter((product) => {
        if (selectedTypes.length === 0) return true;
        return selectedTypes.includes(product.product_type);
    });

    const FilterContent = () => (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">Category</h3>
                <div className="flex flex-col gap-3">
                    {availableTypes.length > 0 ? availableTypes.map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedTypes.includes(type)}
                                onChange={() => toggleTypeFilter(type)} 
                            />
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                {selectedTypes.includes(type) && (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-base transition-colors ${selectedTypes.includes(type) ? 'text-black font-medium' : 'text-gray-600'}`}>
                                {type}
                            </span>
                        </label>
                    )) : (
                        <p className="text-gray-400 text-sm">Loading categories...</p>
                    )}
                </div>
            </div>
            {selectedTypes.length > 0 && (
                <button onClick={() => setSelectedTypes([])} className="text-sm text-gray-500 font-medium underline text-left hover:text-black w-max transition-colors">
                    Clear Filters
                </button>
            )}
        </div>
    );

    const expandingProduct = products.find(p => p._id === expandingId);
    const expandingOptionKey = expandingProduct ? Object.keys(expandingProduct.product_options || {})[0] : null;
    const expandingImage = expandingOptionKey ? expandingProduct?.product_options[expandingOptionKey]?.images?.[0] : '';

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-36 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black relative">
            
            {/* MAGIC OVERLAY: 
              This precisely matches the structure, padding, and layout grid of Product.tsx.
              When a card is clicked, Framer Motion seamlessly morphs the grid image 
              into this exact container, creating the illusion of the image moving into place 
              before the product page actually loads!
            */}
            <AnimatePresence>
                {expandingId && expandingProduct && (
                    <div className="fixed inset-0 z-[100] pointer-events-none flex justify-center pt-40 px-6 md:px-12 lg:px-24">
                        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-16">
                            
                            {/* This div structure strictly mimics the left column in Product.tsx */}
                            <div className="w-full lg:w-5/12 flex flex-col-reverse sm:flex-row gap-4">
                                
                                {/* Invisible spacer mimicking the thumbnail column so the main image alignment is perfect */}
                                <div className="hidden sm:block sm:w-20 shrink-0" />

                                {/* The target container for the layoutId animation */}
                                <motion.div
                                    layoutId={`card-image-${expandingId}`}
                                    className="bg-gray-100 rounded-3xl overflow-hidden h-[350px] sm:h-[500px] flex-1 relative shadow-lg"
                                    transition={{ duration: 0.8, ease: easeOutQuart }}
                                >
                                    <img
                                        src={expandingImage}
                                        alt={expandingProduct.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>

                        </div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-[1400px] mx-auto">
                <motion.div 
                    variants={headerVariants}
                    initial="hidden"
                    animate={expandingId ? { opacity: 0, transition: { duration: 0.3 } } : "visible"}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black capitalize mb-2">
                            {gender ? `${gender}'s Collection` : 'Featured Apparel'}
                        </h1>
                        <p className="text-gray-500 font-light text-lg">
                            {filteredProducts.length} Results
                        </p>
                    </div>
                    <button onClick={() => setIsMobileFilterOpen(true)} className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filters {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                    </button>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <aside className="hidden md:block w-64 flex-shrink-0 sticky top-36">
                        <motion.div animate={{ opacity: expandingId ? 0 : 1, transition: { duration: 0.3 } }}>
                            <FilterContent />
                        </motion.div>
                    </aside>

                    <AnimatePresence>
                        {isMobileFilterOpen && (
                            <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" />
                                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 p-6 shadow-2xl overflow-y-auto md:hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-bold">Filters</h2>
                                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <FilterContent />
                                    <div className="mt-10 pt-6 border-t border-gray-100">
                                        <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-black text-white py-3.5 rounded-xl font-medium">View {filteredProducts.length} Items</button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 w-full">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {[...Array(6)].map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                key={selectedTypes.join(',')}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                            >
                                {filteredProducts.length === 0 ? (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                                        <h2 className="text-2xl text-gray-900 font-medium">No products found</h2>
                                        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                                        <button onClick={() => setSelectedTypes([])} className="mt-2 text-black underline font-medium">
                                            Clear all filters
                                        </button>
                                    </div>
                                ) : null}

                                {filteredProducts.map((product) => (
                                    <ProductCard 
                                        key={product._id} 
                                        product={product} 
                                        navigate={navigate} 
                                        handleAddToCart={handleAddToCart}
                                        expandingId={expandingId}
                                        setExpandingId={setExpandingId}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store;