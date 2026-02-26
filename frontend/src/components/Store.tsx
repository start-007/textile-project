import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Types ---
interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
}

// --- Example Data ---
const exampleProducts: Product[] = [
    { id: 1, title: "Wireless Noise-Cancelling Headphones", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", category: "electronics" },
    { id: 2, title: "Minimalist Leather Everyday Backpack", price: 120.00, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", category: "accessories" },
    { id: 3, title: "Mechanical Keyboard - Retro Edition", price: 145.50, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80", category: "electronics" },
    { id: 4, title: "Insulated Stainless Steel Water Bottle", price: 35.00, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", category: "lifestyle" },
    { id: 5, title: "Smart Home Security Camera", price: 89.99, image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&q=80", category: "electronics" },
    { id: 6, title: "Ceramic Pour-Over Coffee Maker", price: 28.00, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80", category: "kitchen" },
    { id: 7, title: "Ergonomic Office Chair", price: 199.50, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80", category: "furniture" },
    { id: 8, title: "Unisex Cotton Crewneck T-Shirt", price: 18.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", category: "clothing" },
    { id: 11, title: "Wireless Noise-Cancelling Headphones", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", category: "electronics" },
    { id: 12, title: "Minimalist Leather Everyday Backpack", price: 120.00, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", category: "accessories" },
    { id: 13, title: "Mechanical Keyboard - Retro Edition", price: 145.50, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80", category: "electronics" },
    { id: 14, title: "Insulated Stainless Steel Water Bottle", price: 35.00, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", category: "lifestyle" },
    { id: 15, title: "Smart Home Security Camera", price: 89.99, image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&q=80", category: "electronics" },
    { id: 16, title: "Ceramic Pour-Over Coffee Maker", price: 28.00, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80", category: "kitchen" },
    { id: 17, title: "Ergonomic Office Chair", price: 199.50, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80", category: "furniture" },
    { id: 18, title: "Unisex Cotton Crewneck T-Shirt", price: 18.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", category: "clothing" }

];

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

// --- Sub-components ---
const SkeletonCard = () => (
    // Updated for dark mode with subtle glass effect
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

    useEffect(() => {
        // Artificial timeout to demonstrate the dark skeleton loaders
        setTimeout(() => {
            setProducts(exampleProducts);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        // Changed to deep gray background
        <div className="min-h-screen bg-black-900 py-12 px-4 sm:px-6 lg:px-8 text-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h1 className=" text-4xl font-extrabold text-white tracking-tight">
                        Featured Products
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
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                // Dark mode card with glassmorphism border and background
                                className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 border border-gray-700/50 flex flex-col cursor-pointer group"
                            >
                                {/* Image container: Darker inner background to make photos pop */}
                                <div className="relative h-48 mb-4 overflow-hidden rounded-xl bg-gray-900/50 flex items-center justify-center">
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                        src={product.image}
                                        alt={product.title}
                                        className="object-cover h-full w-full opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>

                                <div className="flex flex-col flex-grow">
                                    {/* Neon-ish blue for category accents in dark mode */}
                                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                                        {product.category}
                                    </span>
                                    <h3 className="text-sm font-medium text-gray-200 line-clamp-2 mb-2">
                                        {product.title}
                                    </h3>

                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-lg font-bold text-white">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {/* Cart button pops with a bright color against the dark card */}
                                        <button className="bg-blue-600 text-white p-2 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Store;