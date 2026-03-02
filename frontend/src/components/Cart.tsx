import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../utils/useCartStore';
import { useNavigate } from 'react-router-dom';
// --- Assumed Cart Item Type ---
interface CartItem {
    id: string | number;
    title: string; 
    price: number;
    quantity: number;
    image?: string; 
    style?: string; 
    size?: string;  
}

const CartPage: React.FC = () => {
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
        <div className="min-h-screen bg-gray-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-gray-100 font-sans">
          <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8 group" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back 
                </button>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8">
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-12 text-center border border-gray-700/50 flex flex-col items-center justify-center"
                    >
                        <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <Link 
                            to="/store/all" 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Left Column: Cart Items List */}
                        <div className="w-full lg:w-2/3 space-y-4">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 shadow-lg flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                                    >
                                        {/* Product Image - NOW CLICKABLE */}
                                        <Link 
                                            to={`/store/product/${item.id}`} 
                                            className="w-full sm:w-32 h-32 shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 group block"
                                        >
                                            <img 
                                                src={item.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80"} 
                                                alt={item.title || "Product Image"} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-1 w-full flex flex-col h-full justify-between gap-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    {/* Title - NOW CLICKABLE */}
                                                    <Link to={`/store/product/${item.id}`}>
                                                        <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-blue-400 transition-colors">
                                                            {item.title}
                                                        </h3>
                                                    </Link>
                                                    {(item.style || item.size) && (
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {item.style && <span>Style: {item.style}</span>}
                                                            {item.style && item.size && <span className="mx-2">•</span>}
                                                            {item.size && <span>Size: {item.size}</span>}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xl font-bold text-white shrink-0">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Controls (Quantity & Remove) */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden bg-gray-900/50 w-fit">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="px-3 py-1 text-gray-300 hover:bg-gray-700 transition-colors"
                                                    >-</button>
                                                    <span className="px-4 py-1 text-white font-medium border-x border-gray-600 text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 text-gray-300 hover:bg-gray-700 transition-colors"
                                                    >+</button>
                                                </div>

                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center text-sm font-medium text-gray-400 hover:text-red-400 transition-colors group"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-32">
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 text-sm text-gray-300 mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Shipping</span>
                                        <span className="text-white font-medium">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Taxes</span>
                                        <span className="text-white font-medium">${taxes.toFixed(2)}</span>
                                    </div>
                                </div>

                                <hr className="border-gray-700/50 mb-6" />

                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-3xl font-extrabold text-white">${total.toFixed(2)}</span>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 flex justify-center items-center gap-2">
                                    Proceed to Checkout
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                                
                                <div className="mt-4 text-center">
                                    <Link to="/store" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                        or Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;