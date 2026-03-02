import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ProductReviews from './ProductReviews';
import { URLS, API_BASE_URL } from '../utils/constants.js';

// --- Types based on new JSON structure ---
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
    rating?: number; // Kept for UI purposes
    reviewsCount?: number; // Kept for UI purposes
}

// --- Mock Fetch Data (Updated) ---
const mockProduct: ProductDetails = {
    "_id": "69a4da0a9bdff5b577a0b0a4",
    "title": "Hoodie",
    "title_image": "https://s3.fake.com/title-6c425b93-be42-4597-afab-3e1b07cd4d27.jpg",
    "product_type": "Hoodie",
    "mp_des_title_to_description": {
        "Material": "100% Cotton",
        "Care": "Hand Wash",
        "Fit": "Regular"
    },
    "gender": "female",
    "product_options": {
        "Red": {
            "mp_sizes_to_stock": { "XL": 0, "L": 33, "S": 19, "M": 2, "XS": 25 },
            "price": 50,
            "priceAdjustment": 50,
            "tax": 12,
            "images": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"], // Used unsplash for visual testing
            "videos": []
        },
        "Black": {
            "mp_sizes_to_stock": { "XL": 0, "M": 12, "S": 45, "XS": 48 },
            "price": 37,
            "priceAdjustment": 37,
            "tax": 10,
            "images": [
                "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80",
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80"
            ],
            "videos": []
        }
    },
    "mp_delivery_type_to_fee": {
        "standard": { "base_fee": 70, "price_per_km": 3, "min_km": 0, "max_km": 10 },
        "express": { "base_fee": 71, "price_per_km": 6, "min_km": 0, "max_km": 20 }
    },
    "product_reviews_id": "69a4db23a83f011e7ccac4cd",
    "product_image": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
    "product_video": [
        "https://s3.fake.com/main-0e35fdda-32bb-4f06-a980-0384ad49e5c8.mp4",
        "https://s3.fake.com/main-39ad1421-e697-4763-98d7-b473112f0f63.mp4"
    ],
    "__v": 0,
    "rating": 4.5,
    "reviewsCount": 128
};

// --- Animation Variants ---
const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
                const response = await fetch(
                    `${API_BASE_URL}/${URLS.CLOTH_ITEM}/${productId}`
                );

                const data = await response.json();

                // Simulate loading delay
                setTimeout(() => {
                    setProduct(data);

                    if (data?.product_options) {
                        const firstOptionKey = Object.keys(data.product_options)[0];

                        if (firstOptionKey) {
                            setSelectedOptionKey(firstOptionKey);

                            const sizesToStock =
                                data.product_options[firstOptionKey].mp_sizes_to_stock;

                            if (sizesToStock) {
                                const firstSize = Object.keys(sizesToStock).find(
                                    size => sizesToStock[size] > 0
                                );

                                if (firstSize) {
                                    setSelectedSize(firstSize);
                                }
                            }
                        }
                    }

                    setIsLoading(false);
                }, 1000);

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

    const renderStars = (rating: number = 5) => {
        return (
            <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-30 pb-10 px-4 sm:px-6 lg:px-8 text-gray-100 font-sans">
            <div className="max-w-7xl mx-auto">
                <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8 group" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Store
                </button>

                {isLoading || !product ? (
                    <div className="animate-pulse flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/2 bg-gray-800/50 rounded-2xl h-[500px]"></div>
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            <div className="bg-gray-700/50 h-10 w-full rounded"></div>
                            <div className="bg-gray-800/50 h-64 w-full rounded-2xl mt-6"></div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        variants={pageVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col lg:flex-row gap-10"
                    >
                        {/* Left Column: Image Gallery */}
                        <div className="w-full lg:w-5/12 flex flex-col-reverse sm:flex-row gap-4">
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0 pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {currentGallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 w-16 h-16 sm:w-full sm:h-20 ${activeImageIndex === idx
                                            ? 'border-blue-500 ring-2 ring-blue-500/50 opacity-100'
                                            : 'border-transparent hover:border-gray-500 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full" />
                                    </button>
                                ))}
                            </div>

                            <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-4 border border-gray-700/50 shadow-2xl flex items-center justify-center overflow-hidden h-[400px] sm:h-[500px] flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={mainImage}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        src={mainImage}
                                        alt={product.title}
                                        className="object-contain w-full h-full rounded-2xl"
                                    />
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Middle Column: Amazon-Style Details */}
                        <div className="w-full lg:w-4/12 flex flex-col pr-0 lg:pr-4">
                            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                                {product.gender} • {product.product_type}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                {renderStars(product.rating)}
                                <span className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30">
                                    {product.reviewsCount} ratings
                                </span>
                            </div>

                            <hr className="border-gray-700/50 mb-6" />

                            <div className="space-y-4 mb-6">
                                {Object.entries(product.mp_des_title_to_description).map(([key, value]) => (
                                    <div key={key} className="flex gap-4">
                                        <span className="text-sm font-semibold text-gray-400 w-24 shrink-0">{key}</span>
                                        <span className="text-gray-200 text-sm font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-700/50 mb-6" />

                            {/* Delivery Information Block */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Delivery Options</h3>
                                <div className="space-y-3">
                                    {Object.entries(product.mp_delivery_type_to_fee).map(([type, fee]) => (
                                        <div key={type} className="flex justify-between items-center text-sm p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                            <span className="capitalize text-gray-300 font-medium">{type} Delivery</span>
                                            <span className="text-white font-bold">${fee.base_fee.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Amazon-Style Buy Box */}
                        <div className="w-full lg:w-3/12">
                            <div className="sticky top-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-white">${currentPrice.toFixed(2)}</span>
                                    {currentOption && currentOption.tax > 0 && (
                                        <p className="text-xs text-gray-400 mt-1">+ ${currentOption.tax} estimated tax</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <span className={`text-lg font-bold ${inStock ? 'text-green-500' : 'text-red-500'}`}>
                                        {inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    {inStock && <p className="text-xs text-gray-400 mt-1">Order now to reserve.</p>}
                                </div>

                                {/* Style Selector */}
                                <div className="mb-5">
                                    <span className="text-gray-300 text-sm font-medium block mb-2">Color: <span className="text-white font-bold">{selectedOptionKey}</span></span>
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
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedOptionKey === optKey
                                                    ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-500/50'
                                                    : 'bg-gray-900/50 text-gray-300 border border-gray-600 hover:border-gray-400'
                                                    }`}
                                            >
                                                {optKey}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector */}
                                {currentOption && (
                                    <div className="mb-6">
                                        <span className="text-gray-300 text-sm font-medium block mb-2">Size: <span className="text-white font-bold">{selectedSize}</span></span>
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
                                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${selectedSize === size
                                                            ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-500/50'
                                                            : isOutOfStock
                                                                ? 'bg-gray-800/30 text-gray-600 border border-gray-700/50 cursor-not-allowed line-through'
                                                                : 'bg-gray-900/50 text-gray-300 border border-gray-600 hover:border-gray-400'
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
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-300 text-sm font-medium">Qty:</span>
                                        <div className={`flex items-center border rounded-lg overflow-hidden bg-gray-900/50 ${inStock ? 'border-gray-600' : 'border-gray-700 opacity-50'}`}>
                                            <button
                                                disabled={!inStock}
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-3 py-1 text-gray-300 hover:bg-gray-700 disabled:hover:bg-transparent transition-colors"
                                            >-</button>
                                            <span className="px-3 py-1 text-white font-medium border-x border-gray-600 w-10 text-center">{quantity}</span>
                                            <button
                                                disabled={!inStock || quantity >= currentStock}
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-3 py-1 text-gray-300 hover:bg-gray-700 disabled:hover:bg-transparent transition-colors"
                                            >+</button>
                                        </div>
                                    </div>

                                    <button disabled={!inStock} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:text-blue-300/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30">
                                        Buy Now
                                    </button>
                                    <button disabled={!inStock} className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-600">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <ProductReviews productId={product?._id || ''} />

            </div>
        </div>
    );
};

export default Product;