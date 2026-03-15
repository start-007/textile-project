import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import video from "../assets/video.mp4"
import { particles } from '../utils/constants.js'

// ==========================================
// ⚙️ PAGE CONTENT CONFIGURATION
// ==========================================
const PAGE_DATA = {
  hero: {
    title: "Shop your perfect branded set",
    subtitle: "Elevate your everyday style with our premium collection.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c028b?auto=format&fit=crop&q=80&w=2000",
    video: video,
    primaryButton: { label: "Shop Now", href: "/shop/all" },
    secondaryButton: { label: "Discover", href: "#collections" }
  },
  collections: {
    title: "Shop our collections",
    items: [
      { name: "Women's", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", href: "/collections/women" },
      { name: "Gym", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800", href: "/collections/gym" },
      { name: "Men's", image: "https://images.unsplash.com/photo-1490578474895-699bc4e3f444?auto=format&fit=crop&q=80&w=800", href: "/collections/men" },
      { name: "Traditional", image: "https://images.unsplash.com/photo-1583391733958-d153111b4e00?auto=format&fit=crop&q=80&w=800", href: "/collections/traditional" }
    ]
  },
  fashionPicks: {
    title: "Explore Our Fashion Picks",
    subtitle: "Discover our newest arrivals tailored just for your lifestyle.",
    tabs: ['All', 'Men', 'Women', 'Kids'],
    viewAllButton: { label: "View All Products", href: "/shop/all" },
    products: [
      { id: 1, title: "Essential Black Hoodie", category: "Men's Apparel", price: "$65.00", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400", video: video, href: "/product/essential-hoodie", isFeatured: false },
      { id: 2, title: "Graphic Print Tee", category: "Unisex", price: "$35.00", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400", href: "/product/graphic-tee", isFeatured: false },
      { id: 3, title: "Wide Leg Denim", category: "Women's", price: "$85.00", image: "https://images.unsplash.com/photo-1550614000-4b95d466f206?auto=format&fit=crop&q=80&w=800", video: video, href: "/product/wide-leg-denim", isFeatured: true, sizes: ['S', 'M', 'L'] },
      { id: 4, title: "White Puffer Jacket", category: "Outerwear", price: "$120.00", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=400", href: "/product/yellow-puffer", isFeatured: false },
      { id: 5, title: "Classic Leather Jacket", category: "Outerwear", price: "$195.00", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400", href: "/product/leather-jacket", isFeatured: false }
    ]
  },
  infoSection: {
    titleLine1: "Glamour Grove :",
    titleLine2: "Ultimate Destination",
    description: "We strive to provide the latest fashion trends combined with uncompromising comfort. Our pieces are carefully curated to ensure you feel confident.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
    video: video,
    button: { label: "Read More", href: "/about-us" }
  },
  ctaBanner: {
    title: "Built an ultimate style for you, be unique",
    description: "Discover clothes that speak to your personality. Dive into a world where fashion meets individuality.",
    button: { label: "Shop Now", href: "/shop" }
  },
  secondaryHero: {
    image: "https://images.unsplash.com/photo-1529139574466-a303027c028b?auto=format&fit=crop&q=80&w=2000",
    video: video,
    href: "/campaign/summer"
  },
  faqSection: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our products, shipping, and returns.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    quote: "\"Fashion is not something that exists in dresses only. Fashion is in the sky, in the street...\"",
    faqs: [
      { question: "How Do I Track My Order?", answer: "Once your order ships, you will receive a confirmation email with a tracking link. You can also track your order directly from your account dashboard." },
      { question: "What is your return policy?", answer: "We provide swift shipping and hassle-free returns on all standard orders within 30 days of purchase, provided items are unworn and have original tags." },
      { question: "Do you ship internationally?", answer: "Yes! We offer worldwide shipping. Delivery times and customs fees vary depending on your location." },
      { question: "How can I contact support?", answer: "You can reach our support team 24/7 via the 'Contact Us' page or by emailing support@glamourgrove.com." },
      { question: "What payment methods do you accept?", answer: "We accept all major credit cards, Apple Pay, Google Pay, and PayPal." }
    ]
  },
  social: {
    images: [
      { url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=400", href: "https://instagram.com/post1" },
      { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400", href: "https://instagram.com/post2", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=400", href: "https://instagram.com/post3" },
      { url: "https://images.unsplash.com/photo-1485230895905-ebfe00be055b?auto=format&fit=crop&q=80&w=400", href: "https://instagram.com/post4" }
    ],
    button: { label: "Follow us", href: "https://instagram.com" }
  }
};

// ==========================================
// 🎞️ ANIMATION VARIANTS
// ==========================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// ==========================================
// 📺 VIEWPORT MEDIA COMPONENT
// ==========================================
interface ViewportMediaProps {
  image: string;
  video?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

const ViewportMedia: React.FC<ViewportMediaProps> = ({ image, video, alt, className = "", imgClassName = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!video || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0.3 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [video]);

  useEffect(() => {
    if (video && videoRef.current) {
      if (isInView) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isInView, video]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <img 
        src={image} 
        alt={alt} 
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 ${video && isInView ? 'opacity-0' : 'opacity-100'} ${imgClassName}`} 
      />
      {video && (
        <video
          ref={videoRef}
          src={video}
          muted
          playsInline
          loop
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

// ==========================================
// 🚀 MAIN PAGE COMPONENT
// ==========================================
export default function LandingStore() {
  const [activeTab, setActiveTab] = useState(PAGE_DATA.fashionPicks.tabs[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [swipedCollections, setSwipedCollections] = useState(false);
  const [swipedPicks, setSwipedPicks] = useState(false);
  
  return (
    <div className="min-h-screen bg-black font-sans text-white relative pb-16 overflow-hidden selection:bg-white selection:text-black">
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 1. Starry Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
        {particles.map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.size} ${p.color} ${p.shadow} rounded-full opacity-60 ${p.pulse ? "animate-pulse" : ""}`}
            style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }}
          />
        ))}
      </div>

      {/* Main Content Container - Reduced Max Width & Spacing */}
      <main className="relative z-10 pt-20 md:pt-28 px-4 md:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-16 md:space-y-24">
        
        {/* 2. Hero Section - Glass Box */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 md:p-5 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row gap-6 items-center"
        >
          {/* Left Media inside Glass Box */}
          <div className="w-full lg:w-1/2 h-[35vh] lg:h-[50vh] relative rounded-[1.5rem] overflow-hidden">
             <ViewportMedia 
              image={PAGE_DATA.hero.image} 
              video={PAGE_DATA.hero.video} 
              alt="Hero background" 
              className="absolute inset-0 w-full h-full" 
            />
            {/* Floating Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff] animate-pulse" />
              New Collection
            </div>
          </div>

          {/* Right Text Content */}
          <div className="w-full lg:w-1/2 px-4 md:px-6 py-6 lg:py-0 flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-4 tracking-tight">
              {PAGE_DATA.hero.title}
            </h2>
            <p className="text-sm md:text-base mb-6 font-medium text-zinc-300 max-w-sm mx-auto lg:mx-0 leading-relaxed">
              {PAGE_DATA.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
              <a href={PAGE_DATA.hero.primaryButton.href} className="bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all flex items-center justify-center shadow-lg hover:-translate-y-1">
                {PAGE_DATA.hero.primaryButton.label}
              </a>
              <a href={PAGE_DATA.hero.secondaryButton.href} className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-all text-center flex items-center justify-center hover:-translate-y-1">
                {PAGE_DATA.hero.secondaryButton.label}
              </a>
            </div>
          </div>
        </motion.section>

        {/* 3. Shop Collections - Glass Boxes */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6 px-2">
             <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-white">{PAGE_DATA.collections.title}</motion.h3>
          </div>
          
          <div className="relative">
            {!swipedCollections && (
              <div className="absolute inset-0 flex items-center justify-between px-1 z-40 pointer-events-none md:hidden">
                <div className="flex items-center justify-center px-1 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <svg className="w-4 h-4 text-white chevron-l-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  <svg className="w-4 h-4 text-white chevron-l-2 -ml-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </div>
                <div className="flex items-center justify-center px-1 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <svg className="w-4 h-4 text-white chevron-r-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  <svg className="w-4 h-4 text-white chevron-r-3 -ml-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>
            )}

            <div 
              className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory hide-scroll pb-2"
              onScroll={() => setSwipedCollections(true)}
              onTouchStart={() => setSwipedCollections(true)}
            >
              {PAGE_DATA.collections.items.map((col, idx) => (
                <motion.a 
                  key={idx} 
                  variants={fadeInUp}
                  href={col.href} 
                  className="w-[45vw] sm:w-[35vw] md:w-auto shrink-0 snap-center bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[1.5rem] group hover:-translate-y-1 transition-transform duration-300 shadow-xl flex flex-col"
                >
                  <div className="relative aspect-[4/5] rounded-[1rem] overflow-hidden bg-white/5">
                    <ViewportMedia 
                      image={col.image} 
                      video={col.video} 
                      alt={col.name} 
                      className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <div className="py-3 text-center flex-grow flex items-center justify-center">
                    <span className="text-white font-semibold text-sm group-hover:underline underline-offset-4">{col.name}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 4. Fashion Picks - Glass Grid */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <motion.h3 variants={fadeInUp} className="text-2xl md:text-3xl font-bold mb-2 text-white">{PAGE_DATA.fashionPicks.title}</motion.h3>
              <motion.p variants={fadeInUp} className="text-zinc-300 font-medium text-sm">{PAGE_DATA.fashionPicks.subtitle}</motion.p>
            </div>
            
            <motion.div variants={fadeInUp} className="flex gap-2 overflow-x-auto hide-scroll pb-2">
              {PAGE_DATA.fashionPicks.tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-300 border ${
                    activeTab === tab 
                    ? 'bg-white text-black border-white' 
                    : 'bg-white/5 border-white/20 text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          </div>

          <div className="relative w-full">
            <div 
              className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory hide-scroll pb-4"
              onScroll={() => setSwipedPicks(true)}
              onTouchStart={() => setSwipedPicks(true)}
            >
              {PAGE_DATA.fashionPicks.products.map((product) => {
                if (product.isFeatured) {
                  return (
                    <motion.a variants={fadeInUp} key={product.id} href={product.href} className="col-span-2 row-span-2 relative rounded-[1.5rem] overflow-hidden group hidden md:flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 p-2 shadow-xl shrink-0 snap-center w-[85vw] md:w-auto hover:-translate-y-1 transition-transform duration-300">
                      <div className="relative w-full h-full min-h-[250px] rounded-[1rem] overflow-hidden bg-white/5 flex-grow">
                        <ViewportMedia 
                          image={product.image} 
                          video={product.video} 
                          alt={product.title} 
                          className="absolute inset-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" 
                        />
                      </div>
                      <div className="pt-4 pb-2 px-3 text-white flex justify-between items-end">
                        <div>
                          <p className="text-zinc-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{product.category}</p>
                          <h4 className="font-bold text-lg mb-2">{product.title}</h4>
                          {product.sizes && (
                            <div className="flex gap-1.5">
                              {product.sizes.map((size, i) => (
                                <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${i === 1 ? 'border-white bg-white text-black' : 'border-white/20 bg-transparent text-white'}`}>
                                  {size}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-lg">{product.price}</span>
                          <span className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs hover:bg-zinc-200 transition">Add</span>
                        </div>
                      </div>
                    </motion.a>
                  );
                }

                return (
                  <motion.a variants={fadeInUp} key={product.id} href={product.href} className="flex flex-col group p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] hover:-translate-y-1 transition-transform duration-300 shadow-xl shrink-0 snap-center w-[50vw] sm:w-[35vw] md:w-auto">
                    <ViewportMedia 
                      image={product.image} 
                      video={product.video} 
                      alt={product.title} 
                      className="bg-white/5 rounded-[1rem] p-4 mb-3 aspect-[4/5] flex items-center justify-center overflow-hidden opacity-90 group-hover:opacity-100" 
                    />
                    <div className="px-2 pb-2 flex-grow flex flex-col justify-end">
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{product.category}</p>
                      <h4 className="font-bold text-sm text-white line-clamp-1 mb-2">{product.title}</h4>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-bold text-base text-white">{product.price}</span>
                        <span className="text-xs font-bold border border-white/30 bg-transparent text-white rounded-full px-3 py-1 group-hover:bg-white group-hover:text-black transition">Add</span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <motion.a variants={fadeInUp} href={PAGE_DATA.fashionPicks.viewAllButton.href} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-white/20 transition shadow-lg hover:-translate-y-1">
              {PAGE_DATA.fashionPicks.viewAllButton.label}
            </motion.a>
          </div>
        </motion.section>

        {/* 5. Info & Banner Section - Glass Layout */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="grid lg:grid-cols-12 gap-4"
        >
          {/* Info Text Box */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col justify-center items-start">
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
              {PAGE_DATA.infoSection.titleLine1}<br/>
              <span className="text-zinc-300">{PAGE_DATA.infoSection.titleLine2}</span>
            </h3>
            <p className="text-zinc-300 mb-6 leading-relaxed text-sm">
              {PAGE_DATA.infoSection.description}
            </p>
            <a href={PAGE_DATA.infoSection.button.href} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition inline-flex items-center gap-2">
              {PAGE_DATA.infoSection.button.label}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>

          {/* Info Media Box */}
          <div className="lg:col-span-7 h-[250px] md:h-[350px] bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[2rem] shadow-xl">
             <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden">
              <ViewportMedia 
                image={PAGE_DATA.infoSection.image} 
                video={PAGE_DATA.infoSection.video} 
                alt="Fashion Models" 
                className="absolute inset-0 w-full h-full opacity-80" 
              />
            </div>
          </div>
        </motion.section>

        {/* 6. CTA Banner - Glass Strip */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 md:p-10 rounded-[2rem] shadow-xl text-center md:text-left"
        >
          <h3 className="text-2xl md:text-3xl font-bold max-w-sm leading-tight">{PAGE_DATA.ctaBanner.title}</h3>
          <div className="flex flex-col items-center md:items-start gap-4 max-w-xs">
            <p className="text-zinc-300 text-sm leading-relaxed">{PAGE_DATA.ctaBanner.description}</p>
            <a href={PAGE_DATA.ctaBanner.button.href} className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-zinc-200 transition shadow-lg hover:-translate-y-1">
              {PAGE_DATA.ctaBanner.button.label}
            </a>
          </div>
        </motion.section>

        {/* 7. FAQ Section - Glass Accordion */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-8 items-start"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-5 lg:sticky top-24">
            <h3 className="text-3xl md:text-4xl font-bold mb-2 text-white">{PAGE_DATA.faqSection.title}</h3>
            <p className="text-zinc-300 mb-6 text-sm">{PAGE_DATA.faqSection.subtitle}</p>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[2rem] shadow-xl overflow-hidden h-[200px] relative">
              <img src={PAGE_DATA.faqSection.image} alt="FAQ Background" loading="lazy" className="absolute inset-0 w-full h-full object-cover rounded-[1.5rem] opacity-60" />
              <div className="absolute inset-x-4 bottom-4 bg-black/40 backdrop-blur-md text-white p-4 rounded-[1.5rem] border border-white/10">
                <p className="text-xs leading-relaxed font-bold italic">"{PAGE_DATA.faqSection.quote}"</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-3">
            {PAGE_DATA.faqSection.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-[1.5rem] p-4 shadow-lg">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center font-bold text-sm md:text-base text-left hover:text-zinc-300 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className={`text-xl font-light w-6 h-6 rounded-full flex items-center justify-center transition-colors border ${openFaq === idx ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/30'}`}>
                    {openFaq === idx ? '-' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }} 
                    className="text-zinc-300 text-sm leading-relaxed"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* 8. Social Grid - Small Glass Tiles */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col items-center max-w-[800px] mx-auto w-full"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-8">
            {PAGE_DATA.social.images.map((social, idx) => (
              <motion.a 
                variants={fadeInUp}
                key={idx} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`block bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[1.5rem] shadow-xl hover:-translate-y-1 transition-transform duration-300 ${idx === 1 ? 'md:-translate-y-4' : idx === 2 ? 'md:translate-y-4' : ''}`}
              >
                <div className="relative aspect-square rounded-[1rem] overflow-hidden bg-white/5">
                  <ViewportMedia 
                    image={social.url} 
                    video={social.video} 
                    alt={`Social ${idx + 1}`} 
                    className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity" 
                  />
                </div>
              </motion.a>
            ))}
          </div>
          <motion.a variants={fadeInUp} href={PAGE_DATA.social.button.href} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-zinc-200 transition shadow-xl hover:-translate-y-1">
            {PAGE_DATA.social.button.label}
          </motion.a>
        </motion.section>

      </main>
    </div>
  );
}