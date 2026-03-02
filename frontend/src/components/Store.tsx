import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from "../utils/useCartStore.js";
import { URLS,API_BASE_URL } from '../utils/constants.js';
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

// --- Helper Component: Star Rating (Adapted for Dark Mode) ---
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center text-amber-400 text-sm">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-current' : 'text-gray-600 fill-current'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
};

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
};

// --- Sub-components (Dark Mode Skeleton) ---
const SkeletonCard = () => (
    <div className="p-5 border border-gray-700/50 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-sm animate-pulse flex flex-col h-[380px]">
        <div className="bg-gray-700/50 h-48 w-full rounded-xl mb-4"></div>
        <div className="bg-gray-700/50 h-4 w-1/3 rounded mb-3"></div>
        <div className="bg-gray-700/50 h-5 w-full rounded mb-2"></div>
        <div className="bg-gray-700/50 h-5 w-2/3 rounded mb-4"></div>
        <div className="bg-gray-700/50 h-8 w-1/4 rounded mt-auto"></div>
    </div>
);

// --- Main Store Component ---
const Store: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const addToCart = useCartStore((state) => state.addToCart);
    const params = useParams<{ gender: string }>(); 
    const gender = params.gender;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true); // Keep the snappy loading fix!
            
            try {
                const response = await fetch(`${API_BASE_URL}/${URLS.STORE}/${gender}`);
                const data = await response.json();
                
                setTimeout(() => {
                    setProducts(data);
                    setIsLoading(false);
                }, 500);
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
        <div className="min-h-screen bg-gray-900 pt-30 pb-10 px-4 sm:px-6 lg:px-8 text-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight capitalize">
                        {gender ? `${gender} Products` : 'Featured Products'}
                    </h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {products.map((product) => {
                            const optionKeys = Object.keys(product.product_options || {});
                            const firstOptionKey = optionKeys[0];
                            const defaultOption = firstOptionKey ? product.product_options[firstOptionKey] : null;
                            
                            // const displayImage = defaultOption?.images?.[0] || 'https://via.placeholder.com/500?text=No+Image';
                            const displayImage ="https://media.gettyimages.com/id/154960461/photo/red-sweat-shirt-on-white-background.jpg?s=612x612&w=gi&k=20&c=S3A3cS6lIf-frbPgvMKkwRUIj59FTf1GW97kA9myxK0="
                            const displayPrice = defaultOption?.price || 0;
                            const colorCount = optionKeys.length;

                            return (
                                <motion.div
                                    key={product._id}
                                    variants={cardVariants}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => navigate(`/store/product/${product._id}`)}
                                    className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 border border-gray-700/50 flex flex-col cursor-pointer group"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 mb-4 overflow-hidden rounded-xl bg-gray-900/50 flex items-center justify-center">
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            src={displayImage}
                                            alt={product.title}
                                            className="object-cover h-full w-full opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-grow">
                                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                                            {product.product_type}
                                        </span>
                                        <h3 className="text-sm font-medium text-gray-200 line-clamp-2 mb-2">
                                            {product.title}
                                        </h3>

                                        {/* Ratings Row (Amazon Style, Dark Mode Colors) */}
                                        <div className="flex items-center mb-2 space-x-2">
                                            <StarRating rating={product.rating || 0} />
                                            <span className="text-xs text-blue-400 hover:text-white transition-colors">
                                                {product.reviewCount || 0}
                                            </span>
                                        </div>

                                        {/* Bottom Row: Price, Colors & Add to Cart */}
                                        <div className="mt-auto flex items-end justify-between">
                                            <div className="flex flex-col">
                                                {/* Formatted Price */}
                                                <div className="flex items-start text-white">
                                                    <span className="text-xs font-semibold mt-1">$</span>
                                                    <span className="text-2xl font-bold">{Math.floor(displayPrice)}</span>
                                                    <span className="text-xs font-semibold mt-1">
                                                        {(displayPrice % 1).toFixed(2).substring(1)}
                                                    </span>
                                                </div>
                                                
                                                {/* Color Indicator */}
                                                {colorCount > 1 && (
                                                    <span className="text-[11px] text-gray-400 mt-1">
                                                        + {colorCount} colors available
                                                    </span>
                                                )}
                                            </div>

                                            {/* Original Hover Cart Button */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="bg-blue-600 text-white p-2 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:bg-blue-500 shadow-lg shadow-blue-900/20 z-10"
                                                aria-label="Add to Cart"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Store;