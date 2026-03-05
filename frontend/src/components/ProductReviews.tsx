import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { URLS, API_BASE_URL } from '../utils/constants.js';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface ReviewItem {
    _id: string;
    title: string;
    description: string;
    rating: number;
    images: string[];
    videos: string[];
    createdAt: string;
    date: string;
}

interface ReviewsData {
    _id: string;
    review: ReviewItem[];
    rating: number;
    reviewCount: number;
    clothing_Id: string;
}

interface ProductReviewsProps {
    productId: string;
}

// --- Mock Data ---
const mockReviewsData: ReviewsData = {
    "_id": "69a4db23a83f011e7ccac4cd",
    "review": [
        {
            "_id": "69a50199cd75d47022d8ae38",
            "title": "Excellent Quality!",
            "description": "The fabric is incredibly soft and the modular fit works perfectly. It adapts well to different climates just as advertised. Highly recommend!",
            "rating": 5,
            "images": [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80" 
            ],
            "videos": [],
            "createdAt": "2026-03-01T12:00:00.000Z",
            "date": "2026-03-02T03:18:49.641Z"
        },
        {
            "_id": "69a50199cd75d47022d8ae39",
            "title": "Nice color, highly technical.",
            "description": "Loved the glacier white colorway. The waterproofing is top-notch, though the articulated sleeves took a day to get used to. Overall, a solid piece of outerwear.",
            "rating": 4,
            "images": [
                "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=400&q=80"
            ],
            "videos": [], 
            "createdAt": "2026-03-01T12:05:00.000Z",
            "date": "2026-03-02T03:18:49.643Z"
        }
    ],
    "rating": 4.5, 
    "reviewCount": 2,
    "clothing_Id": "69a4da0a9bdff5b577a0b0a4"
};

// --- Animation Variants (Premium, Fluid) ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            // Uncomment when API is ready
            // const response = await fetch(`${API_BASE_URL}/${URLS.REVIEWS}/${productId}`);
            // const data = await response.json();
            
            const data = mockReviewsData;

            setTimeout(() => {
                setReviewsData(data);
                setIsLoading(false);
            }, 800);
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    // Refined Monochromatic Star Rating
    const renderStars = (rating: number) => {
        return (
            <div className="flex text-black text-sm gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row gap-12 animate-pulse mt-12 border-t border-gray-200 pt-16">
                <div className="w-full lg:w-1/3 h-64 bg-gray-200 rounded-3xl"></div>
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="h-48 bg-gray-200 rounded-3xl"></div>
                    <div className="h-48 bg-gray-200 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    if (!reviewsData || reviewsData.review.length === 0) {
        return (
            <div className="mt-12 border-t border-gray-200 pt-16">
                <div className="p-12 bg-white border border-gray-100 shadow-sm rounded-3xl flex flex-col items-center text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-black mb-3">Customer Reviews</h2>
                    <p className="text-gray-500 font-light mb-8">No reviews yet for this product. Be the first to share your experience!</p>
                    <button 
                        onClick={() => navigate(`/store/product/${productId}/submit/review`)} 
                        className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full transition-colors"
                    >
                        Write a Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12 mt-12 border-t border-gray-200 pt-16 font-sans">

            {/* Left Column: Overall Rating Summary (Sticky) */}
            <div className="w-full lg:w-1/3">
                <div className="sticky top-24">
                    <h2 className="text-3xl font-semibold text-black tracking-tight mb-8">Reviews</h2>

                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-5xl font-medium text-black">{reviewsData.rating}</span>
                        <div className="flex flex-col">
                            {renderStars(reviewsData.rating)}
                            <span className="text-sm text-gray-500 mt-1">
                                Based on {reviewsData.reviewCount} rating{reviewsData.reviewCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <hr className="border-gray-200 my-10" />

                    <h3 className="text-lg font-medium text-black tracking-tight mb-2">Share your thoughts</h3>
                    <p className="text-gray-500 font-light text-sm mb-6">Let other customers know what you think about this product.</p>
                    
                    <button 
                        onClick={() => navigate(`/store/product/${productId}/submit/review`)} 
                        className="w-full bg-transparent hover:bg-black text-black hover:text-white font-medium py-3 px-6 border border-black rounded-full transition-all duration-300"
                    >
                        Write a Review
                    </button>
                </div>
            </div>

            {/* Right Column: List of Reviews */}
            <motion.div
                className="w-full lg:w-2/3 flex flex-col gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {reviewsData.review.map((rev) => (
                    <motion.div
                        key={rev._id}
                        variants={itemVariants}
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        {/* User Header */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm border border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-black">Verified Purchaser</span>
                                <span className="text-xs text-gray-400">
                                    Reviewed on {formatDate(rev.date)}
                                </span>
                            </div>
                        </div>

                        {/* Rating and Title */}
                        <div className="flex items-center gap-3 mb-4">
                            {renderStars(rev.rating)}
                            <h4 className="text-base font-semibold text-black tracking-tight">{rev.title}</h4>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 font-light text-[15px] leading-relaxed mb-6">
                            {rev.description}
                        </p>

                        {/* Attached Media */}
                        {(rev.images.length > 0 || rev.videos.length > 0) && (
                            <div className="flex flex-wrap gap-4 mt-2">
                                {rev.images.map((imgUrl, idx) => (
                                    <div key={`img-${idx}`} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                                        <img src={imgUrl} alt="Review attachment" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                ))}
                                {rev.videos.map((vidUrl, idx) => (
                                    <div key={`vid-${idx}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer group">
                                        <video src={vidUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

        </div>
    );
};

export default ProductReviews;