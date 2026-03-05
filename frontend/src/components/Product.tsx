import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ProductReviews from './ProductReviews';
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

// --- Animation Variants (Premium, Fluid, No Bounce) ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const pageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: easeOutQuart, staggerChildren: 0.1 } 
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: easeOutQuart } 
    }
};
const mock_data: Product = {
  _id: "prod_8fa92b3c4d5e",
  title: "AeroShell Anorak",
  title_image:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
  product_type: "Outerwear",
  mp_des_title_to_description: {
    Material: "Triple-layer waterproof breathable membrane",
    Fit: "Articulated, relaxed fit designed for modular layering",
    Care: "Machine wash cold, lay flat to dry",
    Features:
      "Seam-sealed interior, waterproof aquaguard zippers, hidden utility pockets",
  },
  gender: "Men",
  product_options: {
    "Obsidian Black": {
      mp_sizes_to_stock: {
        XS: 5,
        S: 12,
        M: 0,
        L: 24,
        XL: 8,
      },
      price: 245.0,
      priceAdjustment: 0,
      tax: 18.5,
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1550614000-4b95dd245dc4?auto=format&fit=crop&q=80&w=800",
      ],
      videos: [],
    },
    "Glacier White": {
      mp_sizes_to_stock: {
        XS: 2,
        S: 8,
        M: 15,
        L: 10,
        XL: 0,
      },
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
    standard: {
      base_fee: 0,
      price_per_km: 0,
      min_km: 0,
      max_km: 9999,
    },
    express: {
      base_fee: 15,
      price_per_km: 0.5,
      min_km: 0,
      max_km: 500,
    },
    "next-day": {
      base_fee: 25,
      price_per_km: 1.2,
      min_km: 0,
      max_km: 100,
    },
  },
  product_reviews_id: "rev_92b3c4d5e8fa",
  product_image: [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
  ],
  product_video: [],
  __v: 1,
  rating: 4.8,
  reviewsCount: 342,
};
// --- Main Product Component ---
const Product: React.FC = () => {
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate();

    // Selection State
    const [selectedOptionKey, setSelectedOptionKey] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    // Lazy Loading Reviews State
    const reviewsRef = useRef<HTMLDivElement>(null);
    const param = useParams<{ id: string }>();
    const productId = param.id;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // const response = await fetch(`${API_BASE_URL}/${URLS.CLOTH_ITEM}/${productId}`);
                const data =mock_data

                // Simulate loading delay for premium feel
                setTimeout(() => {
                    setProduct(mock_data);

                    if (data?.product_options) {
                        const firstOptionKey = Object.keys(data.product_options)[0];

                        if (firstOptionKey) {
                            setSelectedOptionKey(firstOptionKey);

                            const sizesToStock = data.product_options[firstOptionKey].mp_sizes_to_stock;
                            if (sizesToStock) {
                                const firstSize = Object.keys(sizesToStock).find(
                                    size => sizesToStock[size] > 0
                                );
                                if (firstSize) setSelectedSize(firstSize);
                            }
                        }
                    }
                    setIsLoading(false);
                }, 800);

            } catch (err) {
                console.error("Error fetching product details:", err);
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    // Derived state
    const currentOption = product && selectedOptionKey ? product.product_options[selectedOptionKey] : null;
    const currentPrice = currentOption ? currentOption.price + (currentOption.priceAdjustment || 0) : 0;
    const currentStock = currentOption && selectedSize ? currentOption.mp_sizes_to_stock[selectedSize] || 0 : 0;
    const inStock = currentStock > 0;

    const currentGallery = currentOption && currentOption.images.length > 0
        ? currentOption.images
        : product?.product_image || [product?.title_image || ""];
    const mainImage = currentGallery[activeImageIndex] || currentGallery[0];

    // Refined Monochromatic Star Rating
    const renderStars = (rating: number = 5) => {
        return (
            <div className="flex text-black text-sm gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
            <div className="max-w-7xl mx-auto">
                
                {/* Minimalist Back Button */}
                {/* <button 
                    className="flex items-center text-gray-500 hover:text-black transition-colors mb-10 group text-sm font-medium tracking-wide" 
                    onClick={() => navigate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Store
                </button> */}

                {isLoading || !product ? (
                    // Light Theme Skeleton Loader
                    <div className="animate-pulse flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-5/12 bg-gray-200 rounded-3xl h-[500px]"></div>
                        <div className="w-full lg:w-4/12 flex flex-col gap-5">
                            <div className="bg-gray-200 h-6 w-1/3 rounded-full"></div>
                            <div className="bg-gray-200 h-12 w-full rounded-lg"></div>
                            <div className="bg-gray-200 h-6 w-1/4 rounded-full mt-4"></div>
                            <div className="bg-gray-200 h-[1px] w-full my-4"></div>
                            <div className="bg-gray-200 h-32 w-full rounded-xl"></div>
                        </div>
                        <div className="w-full lg:w-3/12 bg-gray-200 rounded-3xl h-[400px]"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={pageVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col lg:flex-row gap-12 lg:gap-16"
                    >
                        {/* Left Column: Premium Image Gallery */}
                        <motion.div variants={itemVariants} className="w-full lg:w-5/12 flex flex-col-reverse sm:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0 pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {currentGallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative rounded-xl overflow-hidden transition-all duration-300 shrink-0 w-16 h-16 sm:w-full sm:h-20 border
                                            ${activeImageIndex === idx
                                                ? 'border-black opacity-100'
                                                : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full bg-gray-100" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="bg-gray-100 rounded-3xl overflow-hidden h-[400px] sm:h-[600px] flex-1 relative">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={mainImage}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4, ease: easeOutQuart }}
                                        src={mainImage}
                                        alt={product.title}
                                        className="object-cover w-full h-full"
                                    />
                                </AnimatePresence>
                                {/* Floating Product Type Pill */}
                                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-black/5">
                                    <span className="text-[11px] font-semibold text-black uppercase tracking-widest">
                                        {product.product_type}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Middle Column: Editorial Product Details */}
                        <motion.div variants={itemVariants} className="w-full lg:w-4/12 flex flex-col pr-0 lg:pr-4">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                {product.gender}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-medium text-black tracking-tight mb-4 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                {renderStars(product.rating)}
                                <span className="text-sm text-gray-500 hover:text-black transition-colors">
                                    {product.reviewsCount} reviews
                                </span>
                            </div>

                            <hr className="border-gray-200 mb-8" />

                            <div className="space-y-5 mb-8">
                                {Object.entries(product.mp_des_title_to_description).map(([key, value]) => (
                                    <div key={key} className="flex gap-6">
                                        <span className="text-sm font-semibold text-gray-400 w-24 shrink-0 uppercase tracking-wide">{key}</span>
                                        <span className="text-black text-sm font-normal leading-relaxed">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-200 mb-8" />

                            {/* Delivery Options */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Delivery Options</h3>
                                <div className="space-y-3">
                                    {Object.entries(product.mp_delivery_type_to_fee).map(([type, fee]) => (
                                        <div key={type} className="flex justify-between items-center text-sm p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <span className="capitalize text-black font-medium">{type} Delivery</span>
                                            <span className="text-gray-500">${fee.base_fee.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Clean Buy Box */}
                        <motion.div variants={itemVariants} className="w-full lg:w-3/12">
                            <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                                <div className="mb-6">
                                    <span className="text-4xl font-semibold text-black tracking-tight">${currentPrice.toFixed(2)}</span>
                                    {currentOption && currentOption.tax > 0 && (
                                        <p className="text-sm text-gray-400 font-light mt-1">+ ${currentOption.tax} estimated tax</p>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                {/* Color Selector (Pills) */}
                                <div className="mb-8">
                                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-3">
                                        Color: <span className="text-black ml-1">{selectedOptionKey}</span>
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
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                    selectedOptionKey === optKey
                                                        ? 'bg-black text-white shadow-md'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
                                                }`}
                                            >
                                                {optKey}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector (Circles) */}
                                {currentOption && (
                                    <div className="mb-8">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-3">
                                            Size: <span className="text-black ml-1">{selectedSize}</span>
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(currentOption.mp_sizes_to_stock).map(([size, stock]) => {
                                                const isOutOfStock = stock === 0;
                                                return (
                                                    <button
                                                        key={size}
                                                        disabled={isOutOfStock}
                                                        onClick={() => {
                                                            setSelectedSize(size);
                                                            setQuantity(1);
                                                        }}
                                                        className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                                                            selectedSize === size
                                                                ? 'bg-black text-white shadow-md'
                                                                : isOutOfStock
                                                                    ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed line-through'
                                                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
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
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Quantity</span>
                                        <div className={`flex items-center border rounded-full overflow-hidden bg-white ${inStock ? 'border-gray-300' : 'border-gray-100 opacity-50'}`}>
                                            <button
                                                disabled={!inStock}
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent transition-colors"
                                            >-</button>
                                            <span className="px-2 py-1.5 text-black font-medium w-10 text-center">{quantity}</span>
                                            <button
                                                disabled={!inStock || quantity >= currentStock}
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent transition-colors"
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Minimalist Solid/Outline Buttons */}
                                    <button disabled={!inStock} className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-3.5 px-4 rounded-full transition-all duration-300 shadow-sm">
                                        Buy Now
                                    </button>
                                    <button disabled={!inStock} className="w-full bg-white hover:bg-gray-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed text-black font-medium py-3.5 px-4 rounded-full transition-all duration-300 border border-black">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Reviews Section Anchor */}
                <div ref={reviewsRef} className="mt-24">
                    <ProductReviews productId={product?._id || ''} />
                </div>

            </div>
        </div>
    );
};

export default Product;