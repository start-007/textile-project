import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { URLS, API_BASE_URL } from '../utils/constants.js';
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
            "description": "The fabric is soft and fits perfectly. Highly recommend!",
            "rating": 5,
            "images": [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80" // using unsplash for visual testing
            ],
            "videos": [],
            "createdAt": "2026-03-01T12:00:00.000Z",
            "date": "2026-03-02T03:18:49.641Z"
        },
        {
            "_id": "69a50199cd75d47022d8ae39",
            "title": "Nice Color but Slightly Tight",
            "description": "Loved the color but the size is a bit tight. Consider sizing up.",
            "rating": 4,
            "images": [
                "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=200&q=80"
            ],
            "videos": [], // Assuming video URLs would go here
            "createdAt": "2026-03-01T12:05:00.000Z",
            "date": "2026-03-02T03:18:49.643Z"
        }
    ],
    "rating": 4.5, // Changed to 4.5 to make the UI look more realistic based on the two reviews
    "reviewCount": 2,
    "clothing_Id": "69a4da0a9bdff5b577a0b0a4"
};

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulating an API call using the passed productId
        const fetchReviews = async () => {
            setIsLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/${URLS.REVIEWS}/${productId}`
            );
            const data = await response.json();
            console.log(data);
            
            setTimeout(() => {
                setReviewsData(data);
                setIsLoading(false);
            }, 800);
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    // Helper to render stars
    const renderStars = (rating: number) => {
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

    // Helper to format dates
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row gap-10 animate-pulse mt-8">
                <div className="w-full lg:w-1/3 h-64 bg-gray-800/50 rounded-2xl"></div>
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="h-32 bg-gray-800/50 rounded-2xl"></div>
                    <div className="h-32 bg-gray-800/50 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (!reviewsData || reviewsData.review.length === 0) {
        return (
            <div className="mt-8 p-8 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-center">
                <p className="text-gray-400">No reviews yet for this product. Be the first to review!</p>
                <div className="w-full lg:w-1/3">
                <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
                
                <div className="flex items-center gap-4 mb-4">
                    {renderStars(reviewsData.rating)}
                    <span className="text-xl font-medium text-white">{reviewsData.rating} out of 5</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-8">
                    Based on {reviewsData.reviewCount} global rating{reviewsData.reviewCount !== 1 ? 's' : ''}
                </p>

                {/* You could add a review breakdown bar chart here in the future */}
                
                <hr className="border-gray-700/50 mb-6" />
                
                <h3 className="text-lg font-bold text-white mb-2">Review this product</h3>
                <p className="text-gray-400 text-sm mb-4">Share your thoughts with other customers</p>
                <button className="w-full bg-transparent hover:bg-gray-800 text-white font-semibold py-2 px-4 border border-gray-600 rounded-xl transition-colors">
                    Write a customer review
                </button>
            </div>
            </div>
            
            
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-10 mt-8">
            
            {/* Left Column: Overall Rating Summary (Amazon Style) */}
            <div className="w-full lg:w-1/3">
                <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
                
                <div className="flex items-center gap-4 mb-4">
                    {renderStars(reviewsData.rating)}
                    <span className="text-xl font-medium text-white">{reviewsData.rating} out of 5</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-8">
                    Based on {reviewsData.reviewCount} global rating{reviewsData.reviewCount !== 1 ? 's' : ''}
                </p>

                {/* You could add a review breakdown bar chart here in the future */}
                
                <hr className="border-gray-700/50 mb-6" />
                
                <h3 className="text-lg font-bold text-white mb-2">Review this product</h3>
                <p className="text-gray-400 text-sm mb-4">Share your thoughts with other customers</p>
                <button className="w-full bg-transparent hover:bg-gray-800 text-white font-semibold py-2 px-4 border border-gray-600 rounded-xl transition-colors">
                    Write a customer review
                </button>
            </div>

            {/* Right Column: List of Reviews */}
            <motion.div 
                className="w-full lg:w-2/3 flex flex-col gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {reviewsData.review.map((rev) => (
                    <motion.div 
                        key={rev._id} 
                        variants={itemVariants}
                        className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/30"
                    >
                        {/* User Header Placeholder */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold text-sm">
                                {/* Auto-generate avatar letter from a hypothetical username, or use a default icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-300">Verified Purchaser</span>
                        </div>

                        {/* Rating and Title */}
                        <div className="flex items-center gap-3 mb-1">
                            {renderStars(rev.rating)}
                            <h4 className="text-base font-bold text-white">{rev.title}</h4>
                        </div>

                        {/* Date */}
                        <span className="text-xs text-gray-500 mb-4 block">
                            Reviewed on {formatDate(rev.date)}
                        </span>

                        {/* Description */}
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            {rev.description}
                        </p>

                        {/* Attached Media */}
                        {(rev.images.length > 0 || rev.videos.length > 0) && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {rev.images.map((imgUrl, idx) => (
                                    <div key={`img-${idx}`} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-700">
                                        <img src={imgUrl} alt="Review attachment" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {rev.videos.map((vidUrl, idx) => (
                                    <div key={`vid-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-700 bg-gray-900 flex items-center justify-center cursor-pointer group">
                                        <video src={vidUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
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