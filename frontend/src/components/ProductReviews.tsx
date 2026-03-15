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
    author: string; // Added for realistic UI
}

interface ReviewsData {
    _id: string;
    review: ReviewItem[];
    rating: number;
    reviewCount: number;
    clothing_Id: string;
    ratingBreakdown: { star: number; percentage: number }[]; // Added for Amazon-style bars
}

interface ProductReviewsProps {
    productId: string;
}

// --- Mock Data ---
const mockReviewsData: ReviewsData = {
    "_id": "69a4db23a83f011e7ccac4cd",
    "rating": 4.5, 
    "reviewCount": 128,
    "clothing_Id": "69a4da0a9bdff5b577a0b0a4",
    "ratingBreakdown": [
        { star: 5, percentage: 75 },
        { star: 4, percentage: 15 },
        { star: 3, percentage: 5 },
        { star: 2, percentage: 3 },
        { star: 1, percentage: 2 },
    ],
    "review": [
        {
            "_id": "69a50199cd75d47022d8ae38",
            "author": "Alex M.",
            "title": "Excellent Quality & Fit!",
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
            "author": "Jordan T.",
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
    ]
};

// --- Animation Variants ---
const easeOutQuart = [0.25, 1, 0.5, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: easeOutQuart }
    }
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // Track helpful votes locally for UI interaction
    const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

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

    // Glowing Neon Cyan Star Rating
    const renderStars = (rating: number, size: string = "w-4 h-4") => {
        return (
            <div className="flex text-cyan-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`${size} ${i < Math.floor(rating) ? 'fill-current shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-white/20 fill-current'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const toggleHelpful = (id: string) => {
        setHelpfulVotes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-pulse font-sans">
                <div className="w-full lg:w-1/3 h-64 bg-white/5 rounded-[2.5rem] border border-white/10"></div>
                <div className="w-full lg:w-2/3 space-y-4">
                    <div className="h-40 bg-white/5 rounded-[2rem] border border-white/10"></div>
                    <div className="h-40 bg-white/5 rounded-[2rem] border border-white/10"></div>
                </div>
            </div>
        );
    }

    if (!reviewsData || reviewsData.review.length === 0) {
        return (
            <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] rounded-[2.5rem] flex flex-col items-center text-center max-w-2xl mx-auto font-sans">
                <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
                <p className="text-zinc-400 text-sm font-medium mb-8">No reviews yet for this product. Be the first to share your experience!</p>
                <button 
                    onClick={() => navigate(`/store/product/${productId}/submit/review`)} 
                    className="bg-cyan-400 hover:bg-white text-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                    Write a Review
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 font-sans w-full">

            {/* Left Column: Overall Rating Summary (Sticky Amazon Style) */}
            <div className="w-full lg:w-1/3">
                <div className="sticky top-28 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Customer Reviews</h2>

                    {/* Big Rating Summary */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-5xl font-bold text-white">{reviewsData.rating.toFixed(1)}</span>
                        <div className="flex flex-col gap-1">
                            {renderStars(reviewsData.rating, "w-5 h-5")}
                            <span className="text-xs text-zinc-400 font-medium">
                                Based on {reviewsData.reviewCount.toLocaleString()} global ratings
                            </span>
                        </div>
                    </div>

                    {/* Amazon-Style Rating Breakdown */}
                    <div className="space-y-3 mb-8">
                        {reviewsData.ratingBreakdown.map((bar) => (
                            <div key={bar.star} className="flex items-center gap-3 text-xs font-bold text-zinc-300 group cursor-pointer hover:text-cyan-400 transition-colors">
                                <span className="w-12 text-right shrink-0">{bar.star} star</span>
                                <div className="flex-1 h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full" 
                                        style={{ width: `${bar.percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-zinc-500 group-hover:text-cyan-400">{bar.percentage}%</span>
                            </div>
                        ))}
                    </div>

                    <hr className="border-white/10 my-6" />

                    <h3 className="text-base font-bold text-white tracking-tight mb-2">Share your thoughts</h3>
                    <p className="text-zinc-400 font-medium text-xs mb-6">If you’ve used this product, share your thoughts with other customers.</p>
                    
                    <button 
                        onClick={() => navigate(`/store/product/${productId}/submit/review`)} 
                        className="w-full bg-transparent hover:bg-white text-white hover:text-black font-bold py-3.5 px-6 border border-white/20 hover:border-white rounded-full transition-all duration-300 shadow-sm text-sm"
                    >
                        Write a Customer Review
                    </button>
                </div>
            </div>

            {/* Right Column: List of Reviews (Compact Cards) */}
            <motion.div
                className="w-full lg:w-2/3 flex flex-col gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {/* Header for reviews list */}
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-lg font-bold text-white">Top reviews from United States</h3>
                    <button className="text-xs font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1">
                        Sort by: Top
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>

                {reviewsData.review.map((rev) => (
                    <motion.div
                        key={rev._id}
                        variants={itemVariants}
                        className="bg-white/5 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-white/10 shadow-lg hover:bg-white/10 transition-colors duration-300"
                    >
                        {/* Compact Header: Avatar, Name, Stars, Date */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm border border-white/10 shrink-0">
                                    {rev.author.charAt(0)}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-white">{rev.author}</span>
                                        <span className="bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                                            Verified
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {renderStars(rev.rating, "w-3 h-3")}
                                        <span className="text-[11px] font-medium text-zinc-500">
                                            {formatDate(rev.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-white tracking-tight mb-1.5">{rev.title}</h4>

                        {/* Description */}
                        <p className="text-zinc-300 font-medium text-xs md:text-sm leading-relaxed mb-4">
                            {rev.description}
                        </p>

                        {/* Attached Media (Tighter layout) */}
                        {(rev.images.length > 0 || rev.videos.length > 0) && (
                            <div className="flex flex-wrap gap-3 mb-4">
                                {rev.images.map((imgUrl, idx) => (
                                    <div key={`img-${idx}`} className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10 bg-black/20 group cursor-pointer">
                                        <img src={imgUrl} alt="Review attachment" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" loading="lazy" />
                                    </div>
                                ))}
                                {rev.videos.map((vidUrl, idx) => (
                                    <div key={`vid-${idx}`} className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10 bg-black/20 flex items-center justify-center cursor-pointer group">
                                        <video src={vidUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer: Helpful Action */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <span className="text-[11px] font-bold text-zinc-500">Helpful?</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleHelpful(rev._id)}
                                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${helpfulVotes[rev._id] ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-transparent text-zinc-300 border-white/20 hover:bg-white/10 hover:text-white'}`}
                                >
                                    Yes
                                </button>
                                <button className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-transparent text-zinc-300 border border-white/20 hover:bg-white/10 hover:text-white transition-colors">
                                    No
                                </button>
                            </div>
                            <button className="ml-auto text-[11px] font-bold text-zinc-500 hover:text-white transition-colors">
                                Report
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

        </div>
    );
};

export default ProductReviews;