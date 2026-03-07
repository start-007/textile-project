import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../utils/useCartStore';

// --- Assumed Cart Item Type ---
interface CartItem {
    id: string | number;
    title: string; 
    price: number;
    quantity: number;
    image?: string; 
    color?: string;
    style?: string; 
    size?: string;  
}

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
    },
    exit: { 
        opacity: 0, 
        scale: 0.95, 
        x: -20, 
        transition: { duration: 0.3 } 
    }
};

const CartPage: React.FC = () => {
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    const { cart, updateQuantity, removeItem } = useCartStore() as {
        cart: CartItem[];
        updateQuantity: (id: string | number, qty: number) => void;
        removeItem: (id: string | number) => void;
    };
    const navigate = useNavigate();
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 10.00 : 0; 
    const taxes = subtotal * 0.08; 
    const total = subtotal + shipping + taxes;

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
                    Back
                </button> */}
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easeOutQuart }}
                    className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-12"
                >
                    Your Cart
                </motion.h1>

                {cart.length === 0 ? (
                    // Empty State
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: easeOutQuart, delay: 0.1 }}
                        className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-black mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 font-light mb-10">Looks like you haven't added any items to your cart yet.</p>
                        <Link 
                            to="/store/all" 
                            className="bg-black hover:bg-gray-800 text-white font-medium py-3.5 px-10 rounded-full transition-colors duration-300 shadow-sm"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        
                        {/* Left Column: Cart Items List */}
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="w-full lg:w-2/3 space-y-6"
                        >
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        layout
                                        variants={itemVariants}
                                        exit="exit"
                                        className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start group"
                                    >
                                        {/* Product Image */}
                                        <Link 
                                            to={`/store/product/${item.id}`} 
                                            className="w-full sm:w-40 h-40 shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 block relative"
                                        >
                                            <img 
                                                src={item.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80"} 
                                                alt={item.title || "Product Image"} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                                            />
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-1 w-full flex flex-col h-full justify-between gap-4 py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <Link to={`/store/product/${item.id}`}>
                                                        <h3 className="text-xl font-semibold text-black line-clamp-2 hover:text-gray-500 transition-colors tracking-tight">
                                                            {item.title}
                                                        </h3>
                                                    </Link>
                                                    {(item.style || item.size) && (
                                                        <p className="text-sm text-black-400 mt-2 font-light">
                                                            {item.style && <span className="uppercase tracking-wider">{item.style}</span>}
                                                            {item.style && item.size && <span className="mx-2">|</span>}
                                                            {item.size && <span className="uppercase tracking-wider">Size: {item.size}</span>}
                                                            {item.color && item.color && <span className="mx-2">|</span>}
                                                            {item.color && <span className="uppercase tracking-wider">Color: {item.color}</span>}
                                                        </p>
                                                        
                                                    )}
                                                </div>
                                                <span className="text-xl font-medium text-black shrink-0">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Controls (Quantity & Remove) */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                                                    >-</button>
                                                    <span className="px-3 py-1.5 text-black font-medium text-sm w-10 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                                                    >+</button>
                                                </div>

                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center text-sm font-medium text-gray-400 hover:text-black transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Right Column: Order Summary */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: easeOutQuart, delay: 0.2 }}
                            className="w-full lg:w-1/3"
                        >
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm sticky top-32">
                                <h2 className="text-xl font-semibold text-black tracking-tight mb-8">Order Summary</h2>
                                
                                <div className="space-y-4 text-sm text-gray-500 font-light mb-8">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Shipping</span>
                                        <span className="text-black font-medium">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Taxes</span>
                                        <span className="text-black font-medium">${taxes.toFixed(2)}</span>
                                    </div>
                                </div>

                                <hr className="border-gray-100 mb-8" />

                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-lg font-medium text-black">Total</span>
                                    <span className="text-3xl font-semibold text-black tracking-tight">${total.toFixed(2)}</span>
                                </div>

                                <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-full transition-all duration-300 shadow-sm flex justify-center items-center gap-2">
                                    Proceed to Checkout
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                                
                                <div className="mt-6 text-center">
                                    <Link to="/store" className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition-colors">
                                        or Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;