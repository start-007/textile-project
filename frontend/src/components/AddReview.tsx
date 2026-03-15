import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL, URLS, particles } from '../utils/constants.js';

// --- Animation Variants ---
const easeOutQuart = [0.25, 1, 0.5, 1];
const pageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: easeOutQuart } 
    }
};

const AddReview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Product state
    const [product, setProduct] = useState<{ title?: string; title_image?: string, product_reviews_id?: string } | null>(null);

    // Form state
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [headline, setHeadline] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    // File state
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch product details on mount
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${URLS.CLOTH_ITEM}/${id}?fields=title,title_image,product_reviews_id`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // TODO: Implement your S3 upload logic here before sending the PUT request.

        const s3ImageUrls: string[] = [];
        const s3VideoUrls: string[] = [];

        const reviewPayload = {
            reviewItemId: product?.product_reviews_id,
            title: headline,
            comment: comment,
            rating: rating,
            images: s3ImageUrls,
            videos: s3VideoUrls
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${URLS.REVIEWS}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewPayload),
            });

            if (response.ok) {
                alert("Review submitted successfully!");
                navigate(`/store/product/${id}`);
            } else {
                alert("Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-4 md:px-6 font-sans text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Background Layer (Matches Store & Product) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_2px_#06b6d4] opacity-60 animate-pulse" />
                <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_2px_#a855f7] opacity-50" />
                {particles.map((p, i) => (
                  <div key={i} className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-40 ${p.pulse ? "animate-pulse" : ""}`} style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }} />
                ))}
            </div>

            {/* Shrunk the max width to make it a tighter, more concentrated form box */}
            <div className="max-w-[700px] mx-auto relative z-10">
                
                {/* Massive "LandingStore" Wrapper */}
                <motion.div 
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-10 shadow-2xl"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                            Write a Review
                        </h2>
                        <p className="text-zinc-400 font-medium text-sm md:text-base">Share your experience with the community.</p>
                    </div>

                    {/* PRODUCT HEADER - Sleek Pill Design */}
                    {product && (
                        <div className="flex items-center space-x-4 mb-10 bg-black/20 p-3 pr-6 rounded-[2rem] border border-white/5 shadow-inner w-max max-w-full">
                            {product.title_image ? (
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] overflow-hidden shrink-0">
                                    <img src={product.title_image} alt={product.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-[1.5rem] border border-white/10 shrink-0" />
                            )}
                            <h3 className="text-sm md:text-base font-bold text-white line-clamp-2">{product.title}</h3>
                        </div>
                    )}

                    <hr className="border-white/10 mb-8" />

                    {/* FORM SECTION */}
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Overall Rating Section */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Overall Rating</h3>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={`w-10 h-10 md:w-12 md:h-12 transition-all focus:outline-none hover:scale-110 ${
                                            star <= (hover || rating) 
                                            ? "text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" 
                                            : "text-white/10 hover:text-white/30"
                                        }`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* Headline Section */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3" htmlFor="headline">
                                Add a Headline
                            </label>
                            <input
                                id="headline"
                                type="text"
                                required
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full text-sm md:text-base bg-black/40 text-white p-4 md:p-5 rounded-[1.5rem] border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-zinc-600 transition-colors shadow-inner"
                                placeholder="What's most important to know?"
                            />
                        </div>

                        <hr className="border-white/5" />

                        {/* Media Upload Section */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Add Media</h3>
                            <p className="text-zinc-500 mb-4 text-xs md:text-sm font-medium">Shoppers find images and videos more helpful than text alone.</p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Image Uploader */}
                                <div className={`flex-1 bg-black/20 border-2 border-dashed rounded-[2rem] p-6 md:p-8 text-center transition-colors group cursor-pointer relative ${images.length > 0 ? 'border-cyan-400/50 bg-cyan-400/5' : 'border-white/10 hover:border-cyan-400 hover:bg-cyan-400/5'}`}>
                                    <label className="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center z-10">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => setImages(Array.from(e.target.files || []))}
                                            className="hidden"
                                        />
                                    </label>
                                    <svg className={`w-8 h-8 mx-auto mb-3 transition-colors ${images.length > 0 ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className={`block text-xs md:text-sm font-bold mb-1 transition-colors ${images.length > 0 ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
                                        Upload Images
                                    </span>
                                    <span className="text-[10px] md:text-xs text-zinc-500 font-medium">
                                        {images.length > 0 ? <span className="text-cyan-400">{images.length} file(s) selected</span> : "PNG, JPG, or WEBP"}
                                    </span>
                                </div>

                                {/* Video Uploader */}
                                <div className={`flex-1 bg-black/20 border-2 border-dashed rounded-[2rem] p-6 md:p-8 text-center transition-colors group cursor-pointer relative ${videos.length > 0 ? 'border-cyan-400/50 bg-cyan-400/5' : 'border-white/10 hover:border-cyan-400 hover:bg-cyan-400/5'}`}>
                                    <label className="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center z-10">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            multiple
                                            onChange={(e) => setVideos(Array.from(e.target.files || []))}
                                            className="hidden"
                                        />
                                    </label>
                                    <svg className={`w-8 h-8 mx-auto mb-3 transition-colors ${videos.length > 0 ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className={`block text-xs md:text-sm font-bold mb-1 transition-colors ${videos.length > 0 ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
                                        Upload Videos
                                    </span>
                                    <span className="text-[10px] md:text-xs text-zinc-500 font-medium">
                                        {videos.length > 0 ? <span className="text-cyan-400">{videos.length} file(s) selected</span> : "MP4 or MOV"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* Written Review Section */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3" htmlFor="comment">
                                Written Review
                            </label>
                            <textarea
                                id="comment"
                                rows={6}
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full text-sm md:text-base bg-black/40 text-white p-4 md:p-5 rounded-[1.5rem] border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder-zinc-600 transition-colors resize-none shadow-inner"
                                placeholder="What did you like or dislike? What did you use this product for?"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="w-full sm:w-auto text-sm bg-cyan-400 text-black font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-white transition-all duration-300 disabled:bg-white/5 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed"
                                disabled={rating === 0 || !headline || !comment}
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default AddReview;