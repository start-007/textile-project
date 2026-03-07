import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL, URLS } from '../utils/constants.js';

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
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
            <div className="max-w-3xl mx-auto">
                
                {/* Minimalist Back Button */}
                
                <motion.div 
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12"
                >
                    <h2 className="text-3xl font-semibold text-black tracking-tight mb-8">
                        Write a Review
                    </h2>

                    {/* PRODUCT HEADER */}
                    {product && (
                        <div className="flex items-center space-x-6 mb-10 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {product.title_image ? (
                                <img src={product.title_image} alt={product.title} className="w-20 h-20 object-cover bg-white rounded-xl shadow-sm" />
                            ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-xl shadow-sm" />
                            )}
                            <h3 className="text-lg font-medium text-black line-clamp-2">{product.title}</h3>
                        </div>
                    )}

                    <hr className="border-gray-100 mb-10" />

                    {/* FORM SECTION */}
                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* Overall Rating Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Overall Rating</h3>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={`w-10 h-10 transition-colors focus:outline-none ${
                                            star <= (hover || rating) ? "text-black" : "text-gray-200 hover:text-gray-300"
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

                        <hr className="border-gray-100" />

                        {/* Headline Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3" htmlFor="headline">
                                Add a Headline
                            </label>
                            <input
                                id="headline"
                                type="text"
                                required
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full text-base bg-gray-50 text-black p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-colors"
                                placeholder="What's most important to know?"
                            />
                        </div>

                        <hr className="border-gray-100" />

                        {/* Media Upload Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Add Media</h3>
                            <p className="text-gray-500 mb-4 text-sm font-light">Shoppers find images and videos more helpful than text alone.</p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-black transition-colors group">
                                    <label className="block text-sm font-medium text-black mb-1 cursor-pointer group-hover:underline">
                                        Upload Images
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => setImages(Array.from(e.target.files || []))}
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-xs text-gray-400 font-light">{images.length > 0 ? `${images.length} file(s) selected` : "PNG, JPG, or WEBP"}</span>
                                </div>

                                <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-black transition-colors group">
                                    <label className="block text-sm font-medium text-black mb-1 cursor-pointer group-hover:underline">
                                        Upload Videos
                                        <input
                                            type="file"
                                            accept="video/*"
                                            multiple
                                            onChange={(e) => setVideos(Array.from(e.target.files || []))}
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-xs text-gray-400 font-light">{videos.length > 0 ? `${videos.length} file(s) selected` : "MP4 or MOV"}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Written Review Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3" htmlFor="comment">
                                Written Review
                            </label>
                            <textarea
                                id="comment"
                                rows={6}
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full text-base bg-gray-50 text-black p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-colors resize-none"
                                placeholder="What did you like or dislike? What did you use this product for?"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="w-full sm:w-auto text-sm bg-black text-white font-medium py-3.5 px-10 rounded-full shadow-sm hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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