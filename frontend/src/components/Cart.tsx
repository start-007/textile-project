import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../utils/useCartStore';
import { particles } from '../utils/constants.js';

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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1,
        y: 0, 
        transition: { duration: 0.5, ease: easeOutQuart } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.8, 
        x: -20, 
        filter: "blur(10px)",
        transition: { duration: 0.4 } 
    }
};

const CartPage: React.FC = () => {
    const { cart, updateQuantity, removeItem } = useCartStore() as {
        cart: CartItem[];
        updateQuantity: (id: string | number, qty: number) => void;
        removeItem: (id: string | number) => void;
    };
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const FREE_SHIPPING_THRESHOLD = 250;
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
    const shipping = subtotal > 0 && !isFreeShipping ? 15.00 : 0; 
    const taxes = subtotal * 0.08; 
    const total = subtotal + shipping + taxes;

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-4 md:px-6 lg:px-8 font-sans text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_2px_#06b6d4] opacity-60 animate-pulse" />
                <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_2px_#a855f7] opacity-50" />
                {particles.map((p, i) => (
                  <div key={i} className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-40 ${p.pulse ? "animate-pulse" : ""}`} style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }} />
                ))}
            </div>

            <div className="max-w-[960px] mx-auto relative z-10">
                <motion.div 
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 sm:p-12 lg:p-16 shadow-2xl"
                >
                    <AnimatePresence mode="wait">
                        {cart.length > 0 ? (
                            <motion.div key="cart-content" exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-6 mb-8 gap-4">
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">Shopping Cart</h1>
                                        <p className="text-zinc-400 font-medium">{cart.length} items in your cart</p>
                                    </div>
                                    <Link to="/store" className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-10">
                                    <div className="w-full lg:w-7/12 flex flex-col gap-4">
                                        <AnimatePresence mode="popLayout">
                                            {cart.map((item) => (
                                                <motion.div 
                                                    key={item.id}
                                                    layout
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-4 border border-white/10 shadow-lg flex flex-col sm:flex-row gap-5 items-center sm:items-start group hover:bg-white/10 transition-colors"
                                                >
                                                    <Link to={`/store/product/${item.id}`} className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-black/40 rounded-[1.5rem] overflow-hidden border border-white/5 block relative">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-all duration-700" />
                                                    </Link>

                                                    <div className="flex-1 w-full flex flex-col h-full justify-between gap-3 text-center sm:text-left">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div>
                                                                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-400 transition-colors tracking-tight leading-tight">{item.title}</h3>
                                                                <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                                                                    {item.color && <span className="bg-white/10 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">{item.color}</span>}
                                                                    {item.size && <span className="bg-white/10 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">Size {item.size}</span>}
                                                                </div>
                                                            </div>
                                                            <span className="text-lg font-bold text-white shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className="flex items-center border border-white/20 rounded-full overflow-hidden bg-black/40">
                                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1 text-zinc-400 hover:bg-white hover:text-black transition-colors font-bold">-</button>
                                                                <span className="px-1 py-1 text-white font-bold text-xs w-8 text-center">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-zinc-400 hover:bg-white hover:text-black transition-colors font-bold">+</button>
                                                            </div>
                                                            <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <div className="w-full lg:w-5/12">
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl sticky top-32">
                                            <h2 className="text-lg font-bold text-white tracking-tight mb-5">Order Summary</h2>
                                            <div className="mb-6 bg-black/40 p-4 rounded-[1.5rem] border border-white/5">
                                                {isFreeShipping ? (
                                                    <div className="flex items-center gap-3 text-cyan-400">
                                                        <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                        <span className="text-xs font-bold">Free Shipping Unlocked!</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-2">
                                                            <span>Add <span className="text-cyan-400">${amountToFreeShipping.toFixed(2)}</span> for Free Shipping</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${shippingProgress}%` }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" /></div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="space-y-3 text-xs text-zinc-400 font-medium mb-6">
                                                <div className="flex justify-between"><span>Subtotal</span><span className="text-white font-bold">${subtotal.toFixed(2)}</span></div>
                                                <div className="flex justify-between"><span>Shipping</span><span className="text-white font-bold">{isFreeShipping ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                                                <div className="flex justify-between"><span>Taxes</span><span className="text-white font-bold">${taxes.toFixed(2)}</span></div>
                                            </div>
                                            <hr className="border-white/10 mb-6" />
                                            <div className="flex justify-between items-end mb-8"><span className="text-base font-bold text-white">Total</span><span className="text-2xl font-bold text-white tracking-tight">${total.toFixed(2)}</span></div>
                                            <button className="w-full bg-cyan-400 hover:bg-white text-black font-bold py-3.5 px-6 rounded-full transition-all text-sm">Proceed to Checkout</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty-cart" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: easeOutQuart }} className="text-center py-16 flex flex-col items-center justify-center max-w-md mx-auto">
                                <div className="w-28 h-28 bg-cyan-400/10 border border-cyan-400/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">Your cart is empty</h2>
                                <p className="text-zinc-400 font-medium text-sm sm:text-base mb-10 text-center">Looks like you haven't added anything yet. Discover our latest arrivals and elevate your style.</p>
                                <Link to="/store" className="bg-cyan-400 hover:bg-white text-black font-bold py-4 px-10 rounded-full transition-all duration-300 block">Start Shopping</Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default CartPage;