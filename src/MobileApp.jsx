import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Heart, ShoppingBag, Plus, Minus, User, ArrowRight, Star, X, CheckCircle, Check, PackageSearch, ArrowLeft, Snowflake, Droplets, Leaf, ShieldCheck, Lock, Truck, RotateCcw, Smartphone, Banknote, Grid, HandHeart, Flower2, Copy } from 'lucide-react';
import { useShop } from './ShopContext';
import DesktopAbout from './DesktopAbout';
import DesktopContact from './DesktopContact';

// Categories are now dynamically derived from products

// Utility to load external scripts dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const REVIEWS = [
  { id: 1, name: 'Sarah M.', text: 'The most beautiful mugs I own. The craftsmanship is incredible.', rating: 5 },
  { id: 2, name: 'James K.', text: 'Fast shipping and stunning quality. A premium unboxing experience.', rating: 5 },
  { id: 3, name: 'Elena R.', text: 'Perfectly balanced plates that make every dinner feel special.', rating: 5 },
];

export default function MobileApp({ setCurrentPage, currentPage }) {
  const { products, cart, addToCart, removeFromCart, decreaseQuantity, cartTotal, cartItemCount, submitOrder, trackOrder, fetchUserOrders, user, login, logout, register, toggleWishlist, isInWishlist, wishlist } = useShop();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalScrolled, setIsModalScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const lastModalScrollY = useRef(0);

  const handleModalScroll = (e) => {
    const currentScrollTop = e.target.scrollTop;
    if (currentScrollTop > lastModalScrollY.current && currentScrollTop > 50) {
      setIsModalScrolled(true); // scrolling down
    } else if (currentScrollTop < lastModalScrollY.current) {
      setIsModalScrolled(false); // scrolling up
    }
    lastModalScrollY.current = currentScrollTop;
  };
  const [isCartOpen, setIsCartOpen] = useState(() => sessionStorage.getItem('isCartOpen') === 'true');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(() => sessionStorage.getItem('isProfileOpen') === 'true');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(() => sessionStorage.getItem('isWishlistOpen') === 'true');
  const [isShopOpen, setIsShopOpen] = useState(() => sessionStorage.getItem('isShopOpen') === 'true');
  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem('selectedCategory') || 'All');

  useEffect(() => { sessionStorage.setItem('isCartOpen', isCartOpen); }, [isCartOpen]);
  useEffect(() => { sessionStorage.setItem('isProfileOpen', isProfileOpen); }, [isProfileOpen]);
  useEffect(() => { sessionStorage.setItem('isWishlistOpen', isWishlistOpen); }, [isWishlistOpen]);
  useEffect(() => { sessionStorage.setItem('isShopOpen', isShopOpen); }, [isShopOpen]);
  useEffect(() => { sessionStorage.setItem('selectedCategory', selectedCategory); }, [selectedCategory]);

  const heroTexts = [
    <React.Fragment key="1">Elevate Your<br />Daily Sips</React.Fragment>,
    <React.Fragment key="2">Artisan<br />Drinkware</React.Fragment>,
    <React.Fragment key="3">Handcrafted<br />Mugs & Cups</React.Fragment>
  ];

  useEffect(() => {
    if (currentPage === 'About Us' || currentPage === 'about' || currentPage === 'Contact Us') {
      setIsShopOpen(false);
      setIsProfileOpen(false);
      setIsWishlistOpen(false);
      setSelectedProduct(null);
    }
  }, [currentPage]);
  
  const [heroTextIndex, setHeroTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Compute categories dynamically based on fetched products
  const CATEGORIES = React.useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.category).filter(Boolean))].filter(c => c !== 'Glasses & Tumblers' && c !== 'Glasses &amp; Tumblers');
    const spiritualIndex = uniqueCats.indexOf('Spiritual Collection');
    if (spiritualIndex > -1) {
      uniqueCats.splice(spiritualIndex, 1);
      uniqueCats.push('Spiritual Collection');
    }
    
    const categoryImages = {
      'Water Bottles': '/assets/botle.png',
      'Spiritual Collection': '/assets/sc2.png',
      'Serveware': '/assets/serb.png',
      'Mugs': '/assets/mugs.png',
      'Tea Sets': '/assets/drink.png',
      'Glasses & Tumblers': '/assets/p4-clay-glass.png'
    };

    return uniqueCats.map(name => {
      const firstProduct = products.find(p => p.category === name);
      return { 
        name, 
        img: categoryImages[name] || (firstProduct ? firstProduct.image : '/assets/vase.png') 
      };
    });
  }, [products]);

  const [flyingItem, setFlyingItem] = useState(null);

  const handleAddToCartAnim = (product, e) => {
    if (navigator.vibrate) navigator.vibrate(50); // Premium haptic feedback
    setIsAdding(true);
    addToCart(product);
    
    if (e && e.clientX && e.clientY) {
      setFlyingItem({
        id: product.id,
        image: product.image,
        startX: e.clientX,
        startY: e.clientY
      });
      setTimeout(() => setFlyingItem(null), 900); // Wait for slower animation
    }
    
    setTimeout(() => setIsAdding(false), 800);
  };

  // User Orders
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (user && isProfileOpen) {
      setIsLoadingOrders(true);
      fetchUserOrders(user.email).then(orders => {
        setUserOrders(orders);
        setIsLoadingOrders(false);
      });
    }
  }, [user, isProfileOpen]);

  // Auth States
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Mobile Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [qrError, setQrError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('tierra_checkout_form');
    return saved ? JSON.parse(saved) : { firstName: '', lastName: '', email: '', phone: '', address: '', address2: '', city: '', state: '', postcode: '' };
  });

  useEffect(() => {
    localStorage.setItem('tierra_checkout_form', JSON.stringify(formData));
  }, [formData]);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  // Mobile Track Order States
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackOrderEmail, setTrackOrderEmail] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Auto-scroll selected category pill into view
  useEffect(() => {
    if (isShopOpen) {
      setTimeout(() => {
        document.getElementById('selected-category-pill')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 100);
    }
  }, [isShopOpen, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsScrolled(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSelectedProduct(null); // Close details if open
    setIsCartOpen(true); // Open cart to show it was added
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNextStep = (e) => {
    e.preventDefault();
    if (checkoutStep < 2) {
      setCheckoutStep(prev => prev + 1);
    } else {
      handleCheckoutSubmit(e);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'online') {
      setIsQrModalOpen(true);
      return;
    }

    // Cash on Delivery Flow
    setIsSubmitting(true);
    try {
      await submitOrder(formData, 'cod');
      setOrderSuccess(true);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to place order: ' + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQrSubmit = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setQrError('Please enter your Transaction ID / UTR number.');
      return;
    }
    
    setIsSubmitting(true);
    setQrError('');
    try {
      await submitOrder(formData, 'online', { utr: utrNumber });
      setOrderSuccess(true);
      setIsQrModalOpen(false);
      setUtrNumber('');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      setQrError('Failed to place order: ' + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrderSubmit = async (e) => {
    e.preventDefault();
    setIsTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const order = await trackOrder(trackOrderId, trackOrderEmail);
      setTrackResult(order);
    } catch (error) {
      setTrackError(error.message);
    } finally {
      setIsTrackLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');
    try {
      if (isLoginMode) {
        await login(authForm.username, authForm.password);
      } else {
        await register(authForm.email, authForm.password, authForm.username);
      }
      setIsProfileOpen(false); // close after success
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const shouldHeaderBeDark = isScrolled || isWishlistOpen || isTrackOrderOpen || isProfileOpen || isShopOpen;

  const returnToHome = () => {
    setSelectedProduct(null);
    setIsWishlistOpen(false);
    setIsTrackOrderOpen(false);
    setIsProfileOpen(false);
    setIsShopOpen(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mobile-root font-sans bg-background text-primary min-h-screen relative overflow-x-hidden">

      {/* Sticky Top Navigation */}
      {!selectedProduct && (
        <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${shouldHeaderBeDark ? 'bg-[#F8F6F2]/90 backdrop-blur-md shadow-sm py-4 text-primary' : 'bg-transparent py-6 text-white'}`}>
          <div className="flex items-center justify-between px-6">
            <Menu className={`w-6 h-6 cursor-pointer transition-colors ${shouldHeaderBeDark ? 'text-[#1A2E25]' : 'text-white'}`} onClick={() => setIsMenuOpen(true)} />
            <h1 className="font-serif text-[1.35rem] font-light tracking-wide cursor-pointer" onClick={returnToHome}>Clay & Craft</h1>
            <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className={`w-6 h-6 transition-colors ${shouldHeaderBeDark ? 'text-[#1A2E25]' : 'text-white'}`} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
          </div>
        </nav>
      )}

      {currentPage === 'About Us' || currentPage === 'about' ? (
        <div className="pb-32">
          <DesktopAbout onShopClick={() => { setIsShopOpen(true); setCurrentPage('home'); window.scrollTo(0,0); }} />
        </div>
      ) : currentPage === 'Contact Us' ? (
        <div className="pb-32">
          <DesktopContact />
        </div>
      ) : (
        <>
          {/* Hero Section */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <img src="/assets/hero-mobile.png" alt="Handcrafted Pottery" className="absolute inset-0 w-full h-full object-cover" />
        {/* Removed gradient overlay to keep it full opacity and natural */}
        
        <div className="relative z-10 px-8 pt-48 text-[#EAE6DF] text-left h-full flex flex-col justify-start">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-[9px] font-thin uppercase tracking-[0.35em] text-white/90 mb-1 block"
          >
            New Collection
          </motion.span>
          <motion.h2 
            animate={{ 
              opacity: [0, 1, 1, 0], 
              filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'],
              scale: [0.95, 1, 1, 0.95]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              times: [0, 0.15, 0.9, 1],
              ease: "easeInOut"
            }}
            className="font-serif font-light text-[2.75rem] leading-[1.05] tracking-tight mb-5 mt-4"
            style={{ fontWeight: 300 }}
          >
            {heroTexts[heroTextIndex]}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: '40px' }} transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[1px] bg-gradient-to-r from-[#D06C47] to-transparent mb-5"
          />

          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[12px] font-light text-white/90 mb-8 leading-[1.6]"
          >
            Handcrafted clay pieces,<br/>rooted in culture,<br/>made for today.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-start"
          >
            <button 
              onClick={() => {
                const shopSection = document.getElementById('shop');
                if (shopSection) {
                  shopSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white py-2.5 px-6 rounded-full font-medium text-[11px] tracking-[0.05em] hover:bg-white/20 transition-colors flex items-center gap-3"
            >
              Explore Collection <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>
      </section>


      {/* Trust Section */}
      <section className="py-12 px-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50">
            <User className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-serif text-[14px] leading-tight mb-2">Handmade by Artisans</h3>
            <p className="text-secondary text-[10px] leading-snug">Crafted with precision & heritage.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50">
            <Heart className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-serif text-[14px] leading-tight mb-2">Sustainable Clay</h3>
            <p className="text-secondary text-[10px] leading-snug">Sourced ethically from the earth.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50">
            <Truck className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-serif text-[14px] leading-tight mb-2">Secure Shipping</h3>
            <p className="text-secondary text-[10px] leading-snug">Safely delivered to your door.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50">
            <ShieldCheck className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-serif text-[14px] leading-tight mb-2">Secure Payments</h3>
            <p className="text-secondary text-[10px] leading-snug">100% safe & trusted.</p>
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="px-6 py-4">
        <div className="bg-[#4A3B32] rounded-3xl p-6 text-center text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/hero-mobile.png')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] mb-2 block font-medium text-[#E6DEC8]">Special Offer</span>
            <h2 className="font-serif text-[22px] mb-2 text-[#F8F6F2]">First Order above ₹999?</h2>
            <p className="text-[13px] opacity-90 mb-5 font-light text-[#EAE6DF]">Get ₹100 Off on your entire handcrafted purchase.</p>
            <div className="inline-block border border-white/20 rounded-xl px-5 py-2.5 bg-white/10 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-wider opacity-80 mr-2">Use Code:</span>
              <span className="font-bold tracking-wide text-[14px]">FIRST100</span>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Categories */}
      <section id="shop-section" className="py-16 pl-6">
        <h2 className="font-serif text-3xl mb-8 pr-6">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-8 pr-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              whileHover={{ y: -5 }} 
              key={i} 
              className="min-w-[200px] flex-shrink-0 cursor-pointer group"
              onClick={() => {
                setSelectedCategory(cat.name);
                setIsShopOpen(true);
              }}
            >
              <div className="w-full h-[250px] rounded-3xl overflow-hidden mb-4 relative">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl">{cat.name}</h3>
                <ArrowRight className="w-5 h-5 text-accent opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Values Banner */}
      <section id="story-section" className="py-8 bg-[#E6DEC4]">
        <div className="flex items-start justify-center divide-x divide-[#A6977F]">
          
          <div className="flex-1 flex flex-col items-center justify-start text-center px-2">
            <HandHeart className="w-8 h-8 mb-3 text-[#4A3B32]" strokeWidth={1.5} />
            <span className="font-sans text-[13px] text-[#4A3B32]">Handcrafted</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start text-center px-2">
            <Leaf className="w-8 h-8 mb-3 text-[#4A3B32]" strokeWidth={1.5} />
            <span className="font-sans text-[13px] text-[#4A3B32]">Eco-Friendly</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start text-center px-2">
            <Flower2 className="w-8 h-8 mb-3 text-[#4A3B32]" strokeWidth={1.5} />
            <span className="font-sans text-[13px] text-[#4A3B32] leading-tight">Timeless<br/>Tradition</span>
          </div>

        </div>
      </section>

      {/* WooCommerce Products */}
      <section id="shop" className="py-16 px-6 bg-background">
        <h2 className="font-serif text-3xl mb-8">Our Collection</h2>
        
        {/* Uniform Grid Layout */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {products.map((item) => (
            <div 
              key={item.id} 
              onClick={() => { setSelectedProduct(item); setActiveImageIndex(0); }}
              className="cursor-pointer group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm pb-4 h-full"
            >
              <div className="w-full aspect-square relative bg-[#F5F5F5] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="px-4 pt-3 flex flex-col flex-1">
                <h4 className="font-serif text-[16px] font-bold text-[#1A2E25] leading-snug truncate">{item.name}</h4>
                <p className="font-sans text-[11px] text-gray-500 mb-1">Handcrafted ceramic piece</p>
                
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[15px] font-bold text-[#1A2E25]">
                      ₹{item.price}
                    </span>
                    <span className="font-sans text-[11px] text-gray-400 line-through">
                      ₹{item.regular_price}
                    </span>
                  </div>
                  {(() => {
                    const qty = cart.find(c => c.id === item.id)?.quantity || 0;
                    return (
                      <motion.div 
                        layout
                        className={`overflow-hidden flex items-center h-8 rounded-full shadow-sm transition-all duration-300 ${qty > 0 ? 'bg-[#E8E0D5] text-[#1A2E25] w-[76px] justify-between px-1' : 'bg-[#0A4736] text-white hover:bg-[#073326] w-8 justify-center cursor-pointer'}`}
                        onClick={(e) => {
                          if (qty === 0) {
                            e.stopPropagation();
                            handleAddToCartAnim(item, e);
                          }
                        }}
                      >
                        <AnimatePresence mode="popLayout">
                          {qty > 0 ? (
                            <motion.div
                              key="stepper"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between w-full"
                            >
                              <button 
                                className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                onClick={(e) => { e.stopPropagation(); if(navigator.vibrate) navigator.vibrate(50); decreaseQuantity(item.id); }}
                              >
                                <Minus className="w-3 h-3" strokeWidth={2} />
                              </button>
                              <span className="font-medium text-xs w-4 text-center">{qty}</span>
                              <button 
                                className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                onClick={(e) => { e.stopPropagation(); handleAddToCartAnim(item, e); }}
                              >
                                <Plus className="w-3 h-3" strokeWidth={2} />
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="plus-only"
                              initial={{ opacity: 0, scale: 0.8, rotate: 180 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0.8, rotate: -180 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-center w-full h-full"
                            >
                              <Plus className="w-4 h-4" strokeWidth={1.5} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="pb-20 bg-white text-center">
        <div className="w-full h-[500px] mb-10">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover object-top"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="px-6">
          <h2 className="font-serif text-3xl mb-4">Made Slowly.<br/>Crafted with Purpose.</h2>
          <p className="text-secondary text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            We believe in the beauty of imperfection. Every piece in our collection is handcrafted in small batches using traditional wheel-throwing and hand-building techniques.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-[#F9F6F2] overflow-hidden">
        {/* Heading */}
        <div className="pl-6 pr-6 mb-8">
          <div className="inline-block bg-[#F4EBE1] text-[#9C4B35] text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full mb-4">
            Customer Reviews
          </div>
          <h2 className="font-serif text-3xl text-[#1A1A1A] leading-tight">What They Say?</h2>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollSnapType: 'x mandatory' }}>
          <div className="w-6 flex-shrink-0" />
          {[
            { name: 'Priya Sharma', location: 'Mumbai', text: 'The terracotta mugs are stunning! My morning chai tastes better in them. Craftsmanship is top notch.', stars: 5, initials: 'PS' },
            { name: 'Rahul Mehta', location: 'Delhi', text: 'The water dispenser keeps water naturally cool. Delivery was fast and quality exceeded expectations!', stars: 5, initials: 'RM' },
            { name: 'Anjali Verma', location: 'Bangalore', text: 'The hand-painted vase is a masterpiece. You can tell a real artisan made this with love and care.', stars: 5, initials: 'AV' },
            { name: 'Karan Patel', location: 'Ahmedabad', text: 'Gift wrapped beautifully, my mother loved the serving set! Earthy tones go perfectly with our décor.', stars: 5, initials: 'KP' },
          ].map((review, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[260px] rounded-2xl p-4 flex flex-col justify-between bg-white border border-[#E5E0D8] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Quote mark */}
              <div>
                <span className="text-[#E8E0D5] text-[44px] font-serif leading-none block -mt-1 -mb-1">"</span>
                <p className="text-[#4A4A4A] text-[12px] leading-relaxed font-light">
                  {review.text}
                </p>
              </div>

              {/* Bottom: Stars + Avatar + Name */}
              <div className="mt-3">
                {/* Stars */}
                <div className="flex gap-0.5 mb-2.5">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#B68D5A] text-[#B68D5A]" />
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F9F6F2] border border-[#E5E0D8] flex items-center justify-center text-[#8C7A6B] font-medium text-[11px] flex-shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-[#1A2E25] font-serif text-[13px] leading-none mb-0.5">{review.name}</p>
                    <p className="text-[#8C7A6B] text-[10px] uppercase tracking-wider">{review.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="w-6 flex-shrink-0" />
        </div>
      </section>



      {/* Instagram Community Section */}
      <section className="py-12 bg-[#F9F6F2]">
        <div className="px-6 mb-8 flex justify-between items-end">
          <div>
            <h2 className="font-serif text-2xl text-[#1A2E25] mb-2">#ClayAndCraft</h2>
            <p className="text-secondary text-xs">Join our community</p>
          </div>
          <a 
            href="#contact-section" 
            onClick={(e) => { 
              e.preventDefault(); 
              document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); 
            }} 
            className="text-[#82634F] text-xs font-bold uppercase tracking-wider"
          >
            Follow
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 px-6">
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img src="/assets/about_story.png" className="w-full h-full object-cover" alt="Community 1" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img src="/assets/sc1.png" className="w-full h-full object-cover" alt="Community 2" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img src="/assets/p11-painted-vase.png" className="w-full h-full object-cover" alt="Community 3" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img src="/assets/serve.png" className="w-full h-full object-cover" alt="Community 4" />
          </div>
        </div>
      </section>

      {/* Beautiful Footer */}
      <footer id="contact-section" className="bg-[#82634F] text-white pt-16 pb-32 px-8 rounded-t-3xl mt-4">
        <div className="mb-14">
          <h2 className="font-serif text-3xl mb-3">Join our community</h2>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">Subscribe to receive updates on new collections, exclusive offers, and stories behind our craft.</p>
          <div className="relative w-full max-w-[400px]">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              disabled={isSubscribed}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-colors text-sm appearance-none" 
            />
            <button 
              onClick={() => {
                if(subscribeEmail) {
                  setIsSubscribed(true);
                  setTimeout(() => {
                    setSubscribeEmail('');
                    setIsSubscribed(false);
                  }, 3000);
                }
              }}
              disabled={isSubscribed}
              className="absolute right-2 top-2 bottom-2 bg-white text-[#82634F] font-semibold tracking-widest uppercase text-xs px-6 rounded-full hover:bg-white/90 transition-colors"
            >
              {isSubscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-white/50">Legal</h3>
            <ul className="flex flex-col gap-4 text-sm list-none p-0 m-0">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Privacy Policy'); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors no-underline font-light">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Terms And Conditions'); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors no-underline font-light">Terms & Conditions</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Refund And Cancellation'); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors no-underline font-light">Refund & Cancellation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-white/50">Support</h3>
            <ul className="flex flex-col gap-4 text-sm list-none p-0 m-0">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light" onClick={(e) => { e.preventDefault(); user ? setIsProfileOpen(true) : setIsTrackOrderOpen(true); }}>Track Order</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Shipping And Delivery'); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors no-underline font-light">Shipping & Delivery</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('About Us'); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors no-underline font-light">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Contact Us'); window.scrollTo(0, 0); }} className="text-white/80 hover:text-white transition-colors no-underline font-light">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center pt-10 border-t border-white/10 text-center">
          <h2 className="font-serif text-xl tracking-[0.3em] font-bold mb-6">CLAY & CRAFT</h2>
          <div className="flex gap-8 mb-8 text-white/60">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-xs tracking-widest uppercase">Instagram</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-xs tracking-widest uppercase">Pinterest</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-xs tracking-widest uppercase">Journal</a>
          </div>
          <p className="text-[10px] tracking-widest uppercase text-white/30">© 2026 Clay & Craft. All rights reserved.</p>
        </div>
      </footer>
      </>
      )}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Menu Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-primary z-50 flex flex-col p-8 text-white overflow-hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <h2 className="font-sans text-xs tracking-[0.2em] font-medium text-white/50 uppercase">Navigation</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-white/90 transition-colors"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>
            
            <div className="flex flex-col gap-10 mt-8">
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                href="#home" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setCurrentPage('home'); window.scrollTo(0, 0); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">01</span>
                Home
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                href="#shop" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setIsShopOpen(true); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">02</span>
                Shop
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                href="#track" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); user ? setIsProfileOpen(true) : setIsTrackOrderOpen(true); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">03</span>
                Track Order
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                href="#story" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setCurrentPage('About Us'); window.scrollTo(0,0); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">04</span>
                Our Story
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
                href="#contact" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setCurrentPage('Contact Us'); window.scrollTo(0,0); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">05</span>
                Contact
              </motion.a>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-auto pt-10 border-t border-white/10 flex justify-between items-end pb-8"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Follow Us</span>
                <div className="flex gap-6 font-medium text-sm">
                  <a href="#" className="text-white no-underline hover:text-accent transition-colors">Instagram</a>
                  <a href="#" className="text-white no-underline hover:text-accent transition-colors">Pinterest</a>
                </div>
              </div>
              <h1 className="font-serif text-xl tracking-widest font-bold text-white/20">CLAY & CRAFT</h1>
            </motion.div>
          </motion.div>
        )}

        {/* Cart Overlay */}
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A2E25]/40 backdrop-blur-sm z-50 flex justify-end"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDFBF7] w-[90%] max-w-[420px] h-full shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col"
            >
              <div className="p-6 pb-4 flex justify-between items-center">
                <h2 className="font-serif text-[26px] text-[#1A2E25] font-bold">Your Cart <span className="text-[#8C7A6B] text-lg font-normal">({cartItemCount})</span></h2>
                <button onClick={() => setIsCartOpen(false)} className="bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-[#1A2E25] transition-colors border border-[#E5E0D8]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-2">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#8C7A6B]">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#E5E0D8]">
                      <ShoppingBag className="w-8 h-8 opacity-40 text-[#1A2E25]" />
                    </div>
                    <p className="font-sans font-medium text-[15px]">Your cart is beautiful, but empty.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-5 items-center bg-white p-4 rounded-3xl border border-[#E5E0D8]/60 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover bg-[#F8F5F1]" />
                        <div className="flex-1">
                          <h4 className="font-serif text-[18px] leading-tight text-[#1A2E25] font-bold mb-1.5">{item.name}</h4>
                          <p className="font-sans text-[15px] font-bold text-[#8C7A6B] mb-3">₹{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-4 bg-[#FDFBF7] w-max px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
                            <button onClick={() => decreaseQuantity(item.id)} className="text-[#8C7A6B] hover:text-[#1A2E25]">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-sans text-[13px] font-bold w-4 text-center text-[#1A2E25]">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="text-[#8C7A6B] hover:text-[#1A2E25]">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-[#E5E0D8] rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.03)] mt-auto">
                  <div className="flex justify-between items-center font-serif text-[22px] font-bold text-[#1A2E25] mb-6">
                    <span>Total</span>
                    <span className="font-sans text-[20px]">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full bg-[#0A4736] text-white py-4 rounded-full font-sans font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 hover:bg-[#073326] transition-colors shadow-lg shadow-[#0A4736]/20"
                  >
                    Checkout Securely <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Wishlist Full Screen Modal */}
        {isWishlistOpen && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8F6F2] z-30 flex flex-col font-sans pt-24"
          >
            <div className="p-6 pb-4 flex flex-col bg-[#F8F6F2]/90 backdrop-blur sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-[38px] font-semibold tracking-tight text-[#263228] flex items-center gap-3">
                  <Heart className="w-8 h-8 text-[#263228]" strokeWidth={1.5} />
                  Wishlist
                </h1>
                <button onClick={() => setIsWishlistOpen(false)} className="p-2 bg-transparent rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-6 h-6 text-[#263228]" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-2 pb-32">
              {!wishlist || wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#8C7A6B]">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#E5E0D8]">
                    <Heart className="w-10 h-10 opacity-40 text-[#1A2E25]" />
                  </div>
                  <p className="font-sans font-medium text-[16px]">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {wishlist.map((item, idx) => (
                    <div key={idx} className="flex gap-5 items-center bg-white p-5 rounded-[32px] border border-[#E5E0D8]/60 shadow-sm relative overflow-hidden group">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0" onClick={() => { setIsWishlistOpen(false); setSelectedProduct(item); setActiveImageIndex(0); }}>
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover bg-[#F8F5F1] group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-[18px] leading-tight text-[#1A2E25] font-bold mb-2 cursor-pointer" onClick={() => { setIsWishlistOpen(false); setSelectedProduct(item); setActiveImageIndex(0); }}>{item.name}</h4>
                        <p className="font-sans text-[16px] font-bold text-[#8C7A6B] mb-4">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => {
                              toggleWishlist(item);
                            }}
                            className="text-[#8C7A6B] hover:text-red-500 transition-colors"
                          >
                            <span className="text-[12px] font-bold uppercase tracking-wide">Remove</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              handleAddToCartAnim(item, e);
                            }}
                            className="text-[12px] font-bold text-white uppercase tracking-wide px-4 py-2 rounded-full bg-[#0A4736] hover:bg-[#073326] shadow-sm flex items-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Checkout Full Screen Modal */}
        {isCheckoutOpen && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8F6F2] z-50 flex flex-col font-sans"
          >
            <div className="pt-6 flex flex-col bg-[#F8F6F2]/90 backdrop-blur sticky top-0 z-10">
              <div className="flex justify-between items-center mb-4 px-6">
                <h1 className="font-serif text-[38px] font-semibold tracking-tight text-[#263228] flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-[#263228]" strokeWidth={1.5} />
                  Checkout
                </h1>
                <button onClick={() => { setIsCheckoutOpen(false); setCheckoutStep(1); }} className="p-2 bg-transparent rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-5 h-5 text-[#263228]" />
                </button>
              </div>
              
              {/* Minimalist Stepper */}
              {!orderSuccess && (
                <div className="flex items-center justify-center px-4 mt-2 gap-3 mb-4">
                  <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => setCheckoutStep(1)}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${checkoutStep >= 1 ? 'bg-[#263228]' : 'bg-[#E8E2D8]'}`}></div>
                    <span className={`text-[12px] font-medium tracking-wide uppercase ${checkoutStep >= 1 ? 'text-[#263228]' : 'text-[#7A746D]'}`}>Shipping</span>
                  </div>
                  <div className={`w-8 h-[1px] ${checkoutStep >= 2 ? 'bg-[#263228]' : 'bg-[#E8E2D8]'}`}></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${checkoutStep >= 2 ? 'bg-[#263228]' : 'bg-[#E8E2D8]'}`}></div>
                    <span className={`text-[12px] font-medium tracking-wide uppercase ${checkoutStep >= 2 ? 'text-[#263228]' : 'text-[#7A746D]'}`}>Payment</span>
                  </div>
                </div>
              )}

              {/* Fixed Banner */}
              {!orderSuccess && (
                <div className="text-center py-4 bg-[#82634F] w-full shadow-inner">
                  <h2 className="font-serif text-[1.35rem] font-light tracking-wide text-[#F8F6F2]">Clay & Craft</h2>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto pb-32">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center p-6 pt-12">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="mb-6 flex justify-center"
                  >
                    <img src="/assets/success.gif" alt="Order Placed Successfully" className="w-32 h-32 object-contain" />
                  </motion.div>
                  
                  <h3 className="font-serif text-[36px] text-gray-900 mb-2 font-medium tracking-tight">Order Placed</h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed mb-8 px-4 text-center">Thank you, {formData.firstName || 'friend'}. Your handcrafted ceramics are being carefully prepared.</p>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full bg-white p-6 rounded-3xl shadow-sm border border-[#D8D4CC] mb-auto relative overflow-hidden"
                  >
                     {/* Decorative top edge */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-[#415a46]"></div>
                     
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">Order Summary</h4>
                     
                     <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                       <span className="text-gray-500 text-[14px]">Order ID</span>
                       <span className="font-medium text-gray-900 text-[14px]">#CC-{Math.floor(10000 + Math.random() * 90000)}</span>
                     </div>
                     <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                       <span className="text-gray-500 text-[14px]">Payment Method</span>
                       <span className="font-medium text-gray-900 text-[14px] uppercase">{paymentMethod}</span>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                       <span className="text-gray-900 font-serif text-[18px]">Total Paid</span>
                       <span className="font-bold text-[#415a46] text-[20px]">₹{cartTotal.toFixed(2)}</span>
                     </div>
                  </motion.div>

                  <button 
                    className="w-full mt-8 bg-[#415a46] text-white py-4 rounded-2xl font-sans font-bold tracking-wide shadow-lg hover:bg-[#2f4233] transition-colors"
                    onClick={() => { setIsCheckoutOpen(false); setOrderSuccess(false); }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNextStep} className="flex flex-col">
                  <div className="px-5 py-4 space-y-8">
                    {/* Step 1: Shipping Details */}
                    {checkoutStep === 1 && (
                      <div className="space-y-8 animate-fade-in pb-4 px-2">
                        <section>
                          <h3 className="font-sans text-lg font-medium tracking-wide text-[#263228] mb-5 border-b border-[#E8E2D8] pb-2">Contact Information</h3>
                          <div className="flex flex-col gap-6">
                            <div className="relative group">
                              <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">Email</label>
                              <input type="email" name="email" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="relative group">
                              <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">Phone Number</label>
                              <input type="tel" name="phone" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.phone} onChange={handleInputChange} />
                            </div>
                          </div>
                        </section>
                        
                        <section className="pt-2">
                          <h3 className="font-sans text-lg font-medium tracking-wide text-[#263228] mb-5 border-b border-[#E8E2D8] pb-2">Shipping Address</h3>
                          <div className="flex flex-col gap-6">
                            <div className="flex gap-4">
                              <div className="relative group w-1/2">
                                <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">First Name</label>
                                <input type="text" name="firstName" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.firstName} onChange={handleInputChange} />
                              </div>
                              <div className="relative group w-1/2">
                                <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">Last Name</label>
                                <input type="text" name="lastName" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.lastName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div className="relative group">
                              <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">Address Line 1</label>
                              <input type="text" name="address" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="relative group">
                              <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">Address Line 2 <span className="text-[#A39D96] normal-case tracking-normal">(Optional)</span></label>
                              <input type="text" name="address2" className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.address2 || ''} onChange={handleInputChange} />
                            </div>
                            <div className="relative group mb-4">
                              <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">City</label>
                              <input type="text" name="city" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.city} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="relative group">
                                <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">State</label>
                                <input type="text" name="state" required placeholder="e.g. MH, UP" className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.state || ''} onChange={handleInputChange} />
                              </div>
                              <div className="relative group">
                                <label className="text-[11px] font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">PIN Code</label>
                                <input type="text" name="postcode" required className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 focus:outline-none focus:border-[#263228] focus:ring-1 focus:ring-[#263228] transition-all text-[14px] text-gray-900 shadow-sm" value={formData.postcode} onChange={handleInputChange} />
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    )}

                    {/* Step 2: Payment */}
                    {checkoutStep === 2 && (
                      <div className="space-y-6 animate-fade-in pb-4 px-2">
                        {/* Minimalist Order Summary */}
                        <div className="pb-10">
                          <h3 className="font-serif text-[18px] text-gray-800 mb-4">Order Summary</h3>
                          
                          <div className="space-y-4 mb-5">
                            {cart.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[15px] text-gray-900">
                                <div className="flex items-center gap-4">
                                  <img src={item.image} alt={item.name} className="w-[54px] h-[54px] object-cover rounded-lg bg-[#E8E2D8]/30 shadow-sm" />
                                  <span className="font-medium text-[16px]">{item.name} <span className="text-gray-400 font-normal text-[14px] ml-1">×{item.quantity}</span></span>
                                </div>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Coupon Code */}
                          {!showCouponInput && !isCouponApplied ? (
                            <div 
                              className="text-[13px] text-[#263228] font-medium cursor-pointer my-6 underline decoration-1 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                              onClick={() => setShowCouponInput(true)}
                            >
                              Have a coupon code?
                            </div>
                          ) : (
                            <div className="flex gap-2 my-6 animate-fade-in">
                              <input 
                                type="text" 
                                placeholder="Discount code" 
                                className="flex-1 bg-transparent border border-[#D8D4CC] rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#263228] uppercase transition-colors placeholder:normal-case placeholder:text-gray-400"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                disabled={isCouponApplied}
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  if (isCouponApplied) {
                                    setIsCouponApplied(false);
                                    setCouponCode('');
                                    setShowCouponInput(false);
                                  } else if (couponCode === 'FIRST100') {
                                    if (cartTotal < 999) {
                                      alert('The FIRST100 coupon is only valid for orders above ₹999.');
                                    } else {
                                      setIsCouponApplied(true);
                                    }
                                  } else if (couponCode.length > 2) {
                                    setIsCouponApplied(true);
                                  }
                                }}
                                className={`px-5 py-2.5 rounded-lg text-[13px] font-bold tracking-wide transition-all ${isCouponApplied ? 'bg-gray-100 border border-gray-300 text-gray-600' : 'bg-[#263228] text-white hover:bg-[#1a231c]'}`}
                              >
                                {isCouponApplied ? 'REMOVE' : 'APPLY'}
                              </button>
                            </div>
                          )}

                          <div className="space-y-2 mb-4 text-[14px] text-gray-500">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            {/* Removed prepaid discount display */}
                            {isCouponApplied && (
                              <div className="flex justify-between text-[#415a46]">
                                <span>Coupon Discount ({couponCode === 'FIRST100' ? '₹100 Off' : '10%'})</span>
                                <span>-₹{(couponCode === 'FIRST100' ? 100 : cartTotal * 0.10).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2">Shipping <span className="text-[9px] uppercase tracking-wider bg-[#E8E2D8]/50 text-[#263228] px-1.5 py-0.5 rounded-sm">Free over ₹499</span></span>
                              <span>{cartTotal >= 499 ? 'Free' : '₹99.00'}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-6 mt-2">
                            <span className="font-bold text-[18px] text-[#263228]">₹{(cartTotal + (cartTotal >= 499 ? 0 : 99) - (isCouponApplied ? (couponCode === 'FIRST100' ? 100 : cartTotal * 0.1) : 0)).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Minimalist Payment Method */}
                        <div className="pb-6">
                          <h3 className="font-serif text-[18px] text-gray-800 mb-4">Payment Method</h3>
                          
                          <div className="space-y-4">
                            <div 
                              onClick={() => setPaymentMethod('online')}
                              className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col gap-1.5 transition-all ${paymentMethod === 'online' ? 'border-[#82634F] bg-[#82634F]/5 shadow-md' : 'border-[#E8E2D8] bg-transparent hover:border-[#D8D4CC]'}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[15px] text-gray-900 font-medium tracking-wide flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'online' ? 'border-[#82634F] bg-[#82634F]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'online' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  <span className="flex items-center gap-2">
                                    Online Payment
                                  </span>
                                </span>
                                <Smartphone className={`w-5 h-5 ${paymentMethod === 'online' ? 'text-[#82634F]' : 'text-gray-400'}`} strokeWidth={1.5} />
                              </div>
                              <span className="text-[11px] font-bold text-gray-500 tracking-wider opacity-80 pl-7">UPI • QR CODE • NETBANKING</span>
                            </div>

                            <div 
                              onClick={() => setPaymentMethod('cod')}
                              className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col gap-1.5 transition-all ${paymentMethod === 'cod' ? 'border-[#82634F] bg-[#82634F]/5 shadow-md' : 'border-[#E8E2D8] bg-transparent hover:border-[#D8D4CC]'}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[15px] text-gray-900 font-medium tracking-wide flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-[#82634F] bg-[#82634F]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                  Cash on Delivery
                                </span>
                                <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#82634F]' : 'text-gray-400'}`} strokeWidth={1.5} />
                              </div>
                              <span className="text-[11px] font-bold text-gray-500 tracking-wider opacity-80 pl-7">PAY AT YOUR DOORSTEP</span>
                            </div>
                          </div>
                        </div>

                        {/* Branding & Trust */}
                        <div className="flex flex-col items-center justify-center pt-2 pb-20 gap-5 mt-2">
                          <div className="flex flex-col items-center gap-1.5 text-gray-500">
                            <p className="text-[12px] font-medium flex items-center gap-1.5">
                              <Lock className="w-3 h-3" /> 100% Secure Payment
                            </p>
                            <div className="flex flex-col items-center gap-1 opacity-90 mt-1">
                              <span className="text-[10px] tracking-wide uppercase text-gray-400">Accepted Payments</span>
                              <div className="flex gap-2 items-center">
                                <span className="text-[12px] font-sans font-extrabold tracking-tight text-[#0D2366]">BHIM UPI</span>
                                <span className="text-[10px] text-gray-300">&bull;</span>
                                <span className="text-[12px] font-sans font-extrabold tracking-tight text-[#0D2366]">BANK TRANSFER</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sticky Checkout Button */}
                  <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#F8F6F2] via-[#F8F6F2]/95 to-transparent pt-12 pb-6 px-5 z-20">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#82634F] text-white h-[64px] rounded-[18px] font-sans font-bold tracking-wide shadow-[0_8px_30px_rgba(130,99,79,0.3)] hover:bg-[#6A4E3D] transition-all flex justify-center items-center gap-3 group hover:-translate-y-1">
                      {isSubmitting ? 'PROCESSING...' : checkoutStep === 2 ? (
                        <>
                          <Lock className="w-4 h-4 text-white/80" /> Complete Order • ₹{(cartTotal + (cartTotal >= 499 ? 0 : 99) - (isCouponApplied ? (couponCode === 'FIRST100' ? 100 : cartTotal * 0.1) : 0)).toFixed(2)}
                        </>
                      ) : (
                        <>Continue to Payment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                      )}
                    </button>

                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {/* Track Order Full Screen Modal */}
        {isTrackOrderOpen && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8F6F2] z-30 flex flex-col pt-24 font-sans"
          >
            <div className="p-6 pb-4 flex flex-col bg-[#F8F6F2]/90 backdrop-blur sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-[38px] font-semibold tracking-tight text-[#263228] flex items-center gap-3">
                  <PackageSearch className="w-8 h-8 text-[#263228]" strokeWidth={1.5} />
                  Track Order
                </h1>
                <button onClick={() => { setIsTrackOrderOpen(false); setTrackResult(null); setTrackError(''); }} className="p-2 bg-transparent rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-6 h-6 text-[#263228]" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2 pb-32">
              <form onSubmit={handleTrackOrderSubmit} className="flex flex-col gap-4 mb-8">
                <input type="text" placeholder="Order ID (e.g. 19)" required className="w-full p-4 rounded-xl border border-[#E5E0D8] bg-white text-[#1A2E25] focus:outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] shadow-sm transition-all placeholder:text-[#8C7A6B]" value={trackOrderId} onChange={e => setTrackOrderId(e.target.value)} />
                <input type="email" placeholder="Billing Email" required className="w-full p-4 rounded-xl border border-[#E5E0D8] bg-white text-[#1A2E25] focus:outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] shadow-sm transition-all placeholder:text-[#8C7A6B]" value={trackOrderEmail} onChange={e => setTrackOrderEmail(e.target.value)} />
                <button type="submit" disabled={isTrackLoading} className="w-full bg-[#0A4736] hover:bg-[#073326] text-white py-4 rounded-full font-medium tracking-wide flex justify-center mt-2 shadow-sm transition-colors">
                  {isTrackLoading ? 'Searching...' : 'Track My Order'}
                </button>
              </form>
              
              {trackError && <p className="text-red-500 text-center p-4 bg-white border border-red-100 rounded-xl shadow-sm text-sm font-medium">{trackError}</p>}
              
              {trackResult && (
                <div className="bg-white border border-[#E5E0D8] p-6 rounded-[24px] flex flex-col items-center text-center shadow-sm mt-4">
                  <div className="w-16 h-16 bg-[#F8F6F2] rounded-full flex items-center justify-center mb-4 border border-[#E5E0D8]">
                    <PackageSearch className="w-8 h-8 text-[#0A4736]" />
                  </div>
                  <h3 className="font-serif text-[24px] font-bold text-[#1A2E25] mb-2">Order #{trackResult.id}</h3>
                  <p className="font-sans text-[15px] font-medium text-[#8C7A6B] mb-5">Placed on: {new Date(trackResult.date_created).toLocaleDateString()}</p>
                  <div className="bg-[#F8F6F2] text-[#1A2E25] px-5 py-2 rounded-lg font-bold tracking-wide uppercase text-[12px] border border-[#E5E0D8]">
                    Status: {trackResult.status}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile / Auth Overlay */}
        {isProfileOpen && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8F6F2] z-30 flex flex-col pt-24 font-sans"
          >
            <div className="p-6 pb-4 flex flex-col bg-[#F8F6F2]/90 backdrop-blur sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-[38px] font-semibold tracking-tight text-[#263228] flex items-center gap-3">
                  <User className="w-8 h-8 text-[#263228]" strokeWidth={1.5} />
                  {user ? 'My Account' : (isLoginMode ? 'Sign In' : 'Account')}
                </h1>
                <button onClick={() => setIsProfileOpen(false)} className="p-2 bg-transparent rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-6 h-6 text-[#263228]" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2 pb-32 flex flex-col">
              {user ? (
                <div className="flex flex-col items-center flex-1 text-center mt-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#E5E0D8]">
                    <User className="w-10 h-10 text-[#0A4736]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-[28px] font-bold text-[#1A2E25] mb-1">Welcome, {user.displayName || user.username}</h3>
                  <p className="font-sans text-[15px] text-[#8C7A6B] mb-8">{user.email}</p>
                  
                  <div className="w-full text-left mb-8 max-h-[40vh] overflow-y-auto pr-2">
                    <h4 className="font-serif text-[22px] font-bold text-[#1A2E25] mb-4">Your Recent Orders</h4>
                    {isLoadingOrders ? (
                      <p className="text-[15px] text-[#8C7A6B]">Loading orders...</p>
                    ) : userOrders.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userOrders.map(order => (
                          <div key={order.id} className="bg-white border border-[#E5E0D8] p-5 rounded-3xl shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                              <strong className="font-serif text-[18px] text-[#1A2E25]">Order #{order.id}</strong>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                order.status === 'completed' ? 'bg-[#E3F2E6] text-[#0A4736]' : 'bg-[#FFF3E0] text-[#D06C47]'
                              }`}>{order.status}</span>
                            </div>
                            <div className="text-[14px] text-[#8C7A6B] font-medium flex justify-between items-center">
                              <span>{new Date(order.date_created).toLocaleDateString()}</span>
                              <span className="text-[#1A2E25] font-bold">₹{order.total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D8] text-center shadow-sm">
                         <p className="text-[15px] font-medium text-[#8C7A6B]">You haven't placed any orders yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-auto">
                    <button onClick={() => logout()} className="w-full bg-white text-red-500 hover:bg-red-50 py-4 rounded-full font-bold tracking-wide border border-red-200 shadow-sm transition-colors uppercase text-[13px]">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 mb-8 mt-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-[32px] font-bold text-[#1A2E25] mb-2">{isLoginMode ? 'Welcome Back' : 'Join Clay & Craft'}</h3>
                    <p className="font-sans text-[#8C7A6B] text-[15px]">Enter your details to continue.</p>
                  </div>
                  
                  {isLoginMode ? (
                    <input type="email" name="username" placeholder="Email Address" required className="w-full p-4 rounded-xl border border-[#E5E0D8] bg-white text-[#1A2E25] focus:outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] shadow-sm transition-all placeholder:text-[#8C7A6B]" value={authForm.username} onChange={handleAuthChange} />
                  ) : (
                    <>
                      <input type="text" name="username" placeholder="Username" required className="w-full p-4 rounded-xl border border-[#E5E0D8] bg-white text-[#1A2E25] focus:outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] shadow-sm transition-all placeholder:text-[#8C7A6B]" value={authForm.username} onChange={handleAuthChange} />
                      <input type="email" name="email" placeholder="Email Address" required className="w-full p-4 rounded-xl border border-[#E5E0D8] bg-white text-[#1A2E25] focus:outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] shadow-sm transition-all placeholder:text-[#8C7A6B]" value={authForm.email} onChange={handleAuthChange} />
                    </>
                  )}
                  
                  <input type="password" name="password" placeholder="Password" required className="w-full p-4 rounded-xl border border-[#E5E0D8] bg-white text-[#1A2E25] focus:outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] shadow-sm transition-all placeholder:text-[#8C7A6B]" value={authForm.password} onChange={handleAuthChange} />
                  
                  {authError && <p className="text-red-500 text-sm font-medium text-center bg-white border border-red-100 p-4 rounded-xl shadow-sm">{authError}</p>}
                  
                  <button type="submit" disabled={isAuthLoading} className="w-full bg-[#0A4736] hover:bg-[#073326] text-white py-4 rounded-full font-bold tracking-wide flex justify-center mt-2 shadow-sm transition-colors uppercase text-[13px]">
                    {isAuthLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                  </button>
                  
                  <p className="text-center text-[14px] font-medium text-[#8C7A6B] mt-6">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }} className="text-[#0A4736] font-bold hover:underline transition-all">
                      {isLoginMode ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {/* Shop Collection Full Screen Modal */}
        {isShopOpen && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8F6F2] z-30 flex flex-col font-sans"
          >
            <div className="p-6 pb-3 flex flex-col bg-[#F8F6F2]/90 backdrop-blur sticky top-0 z-10">
              {/* Shop Modal Hero Banner */}
              <div className="relative w-[calc(100%+3rem)] -mx-6 -mt-6 h-[180px] overflow-hidden mb-3 flex flex-col items-center justify-center">
                <img src="/assets/homedecor.png" className="absolute inset-0 w-full h-full object-cover" alt="Shop Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                <button onClick={() => setIsShopOpen(false)} className="absolute top-14 right-6 p-2 z-20 opacity-80 hover:opacity-100 transition-opacity">
                  <X className="w-6 h-6 text-[#1A2E25]" />
                </button>
                <div className="relative z-10 text-center px-4 mt-10">
                  <h2 className="font-serif text-[22px] text-[#F8F6F2] mb-1 leading-tight">Handcrafted with Love</h2>
                  <p className="text-[#E6DEC8] text-[10px] uppercase tracking-[0.2em] font-medium">Explore the collection</p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex overflow-x-auto gap-3 scrollbar-hide pt-1 pb-1">
                <button 
                  id={selectedCategory === 'All' ? 'selected-category-pill' : undefined}
                  onClick={() => setSelectedCategory('All')}
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${selectedCategory === 'All' ? 'bg-[#0A4736] text-white border-[#0A4736]' : 'bg-white text-[#1A2E25] border-[#E5E0D8]'}`}
                >
                  All
                </button>
                {CATEGORIES.map((cat, i) => (
                  <button 
                    key={i}
                    id={selectedCategory === cat.name ? 'selected-category-pill' : undefined}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${selectedCategory === cat.name ? 'bg-[#0A4736] text-white border-[#0A4736]' : 'bg-white text-[#1A2E25] border-[#E5E0D8]'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div 
              className="flex-1 overflow-y-auto px-6 pb-40"
              onScroll={handleModalScroll}
            >
              <div className="grid grid-cols-2 gap-4">
                {products
                  .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
                  .map(product => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full group" onClick={() => setSelectedProduct(product)}>
                    <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:text-accent transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] text-[#8C7A6B] uppercase tracking-wider mb-1 font-medium">{product.category}</p>
                      <h3 className="font-serif text-[#1A2E25] text-sm leading-snug mb-1 line-clamp-2 flex-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-[#1A2E25]">₹{product.price}</span>
                        {(() => {
                          const qty = cart.find(c => c.id === product.id)?.quantity || 0;
                          return (
                            <motion.div 
                              layout
                              className={`overflow-hidden flex items-center h-8 rounded-full shadow-sm transition-all duration-300 ${qty > 0 ? 'bg-[#E8E0D5] text-[#1A2E25] w-[76px] justify-between px-1' : 'bg-[#F8F6F2] text-[#0A4736] hover:bg-[#0A4736] hover:text-white w-8 justify-center cursor-pointer'}`}
                              onClick={(e) => {
                                if (qty === 0) {
                                  e.stopPropagation();
                                  handleAddToCartAnim(product, e);
                                }
                              }}
                            >
                              <AnimatePresence mode="popLayout">
                                {qty > 0 ? (
                                  <motion.div
                                    key="stepper"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-between w-full"
                                  >
                                    <button 
                                      className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                      onClick={(e) => { e.stopPropagation(); if(navigator.vibrate) navigator.vibrate(50); decreaseQuantity(product.id); }}
                                    >
                                      <Minus className="w-3 h-3" strokeWidth={2} />
                                    </button>
                                    <span className="font-medium text-xs w-4 text-center">{qty}</span>
                                    <button 
                                      className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                      onClick={(e) => { e.stopPropagation(); handleAddToCartAnim(product); }}
                                    >
                                      <Plus className="w-3 h-3" strokeWidth={2} />
                                    </button>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="plus-only"
                                    initial={{ opacity: 0, scale: 0.8, rotate: 180 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, rotate: -180 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center w-full h-full"
                                  >
                                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {products.filter(product => selectedCategory === 'All' || product.category === selectedCategory).length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-[#8C7A6B]">No products found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Details Sheet */}
        {/* Product Details Full Screen */}
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto pb-40"
          >
            {/* Top Navigation */}
            <div className="sticky top-0 w-full bg-white/90 backdrop-blur-md z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <button onClick={() => setSelectedProduct(null)} className="p-2 -ml-2 text-gray-800 border-none outline-none bg-transparent">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="font-serif text-[1.35rem] font-light tracking-wide text-primary cursor-pointer" onClick={returnToHome}>Clay & Craft</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="p-2 text-gray-800 border-none outline-none bg-transparent"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${isInWishlist(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`}
                    strokeWidth={1.5}
                  />
                </button>
                <motion.button 
                  className="p-2 -mr-2 text-gray-800 relative border-none outline-none bg-transparent" 
                  onClick={() => { setSelectedProduct(null); setIsCartOpen(true); }}
                  animate={isAdding ? { scale: [1, 1.2, 1], y: [0, -5, 0] } : {}}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Fly to Cart Animation */}
            {isAdding && (
              <motion.div
                initial={{ opacity: 1, scale: 1, x: window.innerWidth / 2 - 20, y: window.innerHeight - 80 }}
                animate={{ opacity: 0, scale: 0.3, x: window.innerWidth - 40, y: 30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed z-[100] w-10 h-10 bg-[#415a46] rounded-full pointer-events-none"
              />
            )}

            {/* Image Slider */}
            <div className="px-4 pt-2">
              <div className="bg-[#F5F5F5] rounded-3xl w-full aspect-[4/5] relative overflow-hidden group">

                {/* Scrolling Images */}
                <div 
                  className="flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
                  onScroll={(e) => {
                    const scrollPosition = e.target.scrollLeft;
                    const containerWidth = e.target.clientWidth;
                    const newIndex = Math.round(scrollPosition / containerWidth);
                    setActiveImageIndex(newIndex);
                  }}
                >
                  {(selectedProduct.images || [selectedProduct.image]).map((img, i) => (
                    <div key={i} className="min-w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative overflow-hidden">
                       <img src={img} alt={selectedProduct.name} className="w-full h-full object-cover mix-blend-multiply pointer-events-none select-none" draggable={false} />
                    </div>
                  ))}
                </div>
                {/* Pagination Dots */}
                {(selectedProduct.images && selectedProduct.images.length > 1) && (
                  <div className="absolute bottom-4 flex gap-2 w-full justify-center pointer-events-none">
                    {selectedProduct.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeImageIndex === i ? 'bg-[#3F5B46]' : 'bg-gray-400/50'}`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 pt-6">
              {/* Product Name & Category Badge */}
              <div className="mb-1">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#8C7A6B] font-medium">{selectedProduct.category}</span>
              </div>
              <h2 className="font-serif text-[28px] leading-tight font-light text-[#1A2E25] mb-3">{selectedProduct.name}</h2>
              
              {/* Price Row - clean, no fake discount */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-sans text-[28px] font-medium tracking-tight text-[#0A4736]">₹{selectedProduct.price}</span>
                <span className="text-[13px] text-[#8C7A6B] font-medium">Incl. of all taxes</span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#E8E0D5] mb-6" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#8C7A6B] font-medium mb-3">About This Piece</h3>
                <p className="text-[#3D3029] text-[16px] leading-[1.6] font-normal">
                  {selectedProduct.description || selectedProduct.desc || 'A beautifully handcrafted piece made by skilled artisans using 100% natural terracotta clay. Each piece is unique — minor variations in texture and tone are a natural part of the handmade process.'}
                </p>
              </div>

              {/* Availability Badge */}
              <div className="flex items-center gap-2 text-sm text-[#0A4736] font-medium mb-8 bg-[#EDF5F0] px-4 py-3 rounded-xl w-fit">
                <CheckCircle className="w-4 h-4" />
                In Stock & Ready to Ship
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#E8E0D5] mb-6" />

              {/* Pottery Feature Icons — 2×2 Grid */}
              <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#8C7A6B] font-medium mb-4">Craft Highlights</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 bg-[#FAF7F4] rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Leaf className="w-4 h-4 text-[#0A4736]" />
                  </div>
                  <span className="text-[12px] font-medium text-[#3D3029] leading-tight">Natural Clay</span>
                </div>
                <div className="flex items-center gap-3 bg-[#FAF7F4] rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#0A4736]" />
                  </div>
                  <span className="text-[12px] font-medium text-[#3D3029] leading-tight">Food Safe</span>
                </div>
                <div className="flex items-center gap-3 bg-[#FAF7F4] rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <RotateCcw className="w-4 h-4 text-[#0A4736]" />
                  </div>
                  <span className="text-[12px] font-medium text-[#3D3029] leading-tight">Handmade</span>
                </div>
                <div className="flex items-center gap-3 bg-[#FAF7F4] rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Droplets className="w-4 h-4 text-[#0A4736]" />
                  </div>
                  <span className="text-[12px] font-medium text-[#3D3029] leading-tight">Eco-Friendly</span>
                </div>
              </div>
            </div>


            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm pb-8 pt-4 px-6 border-t border-[#E8E0D5] z-20">
              {cart.find(item => item.id === selectedProduct.id) ? (
                <div className="flex items-center justify-between w-full bg-[#F5F0EA] rounded-full py-2 px-6 mb-3 border border-[#D9CFC4]">
                  <button onClick={() => decreaseQuantity(selectedProduct.id)} className="p-3 text-[#1A2E25] hover:text-black hover:bg-[#E8E0D5] rounded-full transition-colors">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-serif font-light text-[20px] text-[#1A2E25] w-12 text-center">
                    {cart.find(item => item.id === selectedProduct.id).quantity}
                  </span>
                  <button onClick={(e) => handleAddToCartAnim(selectedProduct, e)} className="p-3 text-[#1A2E25] hover:text-black hover:bg-[#E8E0D5] rounded-full transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={(e) => handleAddToCartAnim(selectedProduct, e)}
                  className="w-full bg-[#0A4736] text-white py-4 rounded-full font-sans font-medium text-[15px] tracking-[0.08em] mb-3 hover:bg-[#0d5c46] active:scale-[0.98] transition-all duration-200"
                >
                  Add to Bag · ₹{selectedProduct.price}
                </button>
              )}
              <div className="flex items-center justify-center gap-2 text-[#8C7A6B] text-[11px] font-medium tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0A4736]" />
                Free Shipping on Orders Above ₹999
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Floating Bottom Navigation */}
      {!selectedProduct && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: (isScrolled || isModalScrolled) ? 150 : 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full py-4 px-8 z-40 flex justify-between items-center"
        >
          <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={returnToHome}>
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">Explore</span>
          </div>
          
          <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors relative" onClick={() => { setIsWishlistOpen(true); setIsTrackOrderOpen(false); setIsProfileOpen(false); setIsShopOpen(false); setSelectedProduct(null); }}>
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">Saved</span>
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                {wishlist.length}
              </span>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => { setIsShopOpen(true); setIsProfileOpen(false); setIsWishlistOpen(false); setIsTrackOrderOpen(false); setSelectedProduct(null); }}>
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">Shop</span>
          </div>
          
          <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">Bag</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                {cartItemCount}
              </span>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => { setIsProfileOpen(true); setIsWishlistOpen(false); setIsTrackOrderOpen(false); setIsShopOpen(false); setSelectedProduct(null); }}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">Profile</span>
          </div>
        </motion.div>
      )}

      {/* Flying Cart Item Animation */}
      <AnimatePresence>
        {flyingItem && (
          <motion.img
            src={flyingItem.image}
            initial={{ 
              x: flyingItem.startX - 30, 
              y: flyingItem.startY - 30, 
              scale: 1.2, 
              opacity: 1 
            }}
            animate={{ 
              x: window.innerWidth * 0.7 - 10, // 70% width for bag icon
              y: window.innerHeight - 40, // Bottom nav bag icon approx
              scale: 0.1, 
              opacity: 0.2 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.9,
              x: { type: "tween", ease: "linear" },
              y: { type: "tween", ease: "easeIn" },
              scale: { duration: 0.9, ease: "easeInOut" },
              opacity: { duration: 0.9, ease: "easeIn" }
            }}
            className="fixed z-[9999] w-16 h-16 rounded-full object-cover shadow-2xl border-2 border-white pointer-events-none"
            style={{ originX: 0.5, originY: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* QR Code Payment Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur text-white hover:bg-white/30 rounded-full z-10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="bg-[#82634F] text-white p-4 text-center pb-6">
                <h3 className="font-serif text-[20px] font-bold mb-1">Online Payment</h3>
                <p className="text-white/80 text-[13px]">Scan the QR code below to pay</p>
                <div className="text-[24px] font-bold mt-2 tracking-tight">
                  ₹{(cartTotal + (cartTotal >= 499 ? 0 : 99) - (isCouponApplied ? (couponCode === 'FIRST100' ? 100 : cartTotal * 0.1) : 0)).toFixed(2)}
                </div>
              </div>
              
              <form onSubmit={handleQrSubmit} className="p-4 pt-0 -mt-3 relative z-10">
                <div className="bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col mb-4">
                  <div className="w-full mb-3 bg-[#82634F]/10 border border-[#82634F]/20 text-[#82634F] p-2 rounded-lg text-xs text-center font-medium">
                    ⚠️ Please ensure the receiver name shows as <strong className="text-[#1A2E25]">Mamta kumari</strong> before paying.
                  </div>
                  
                  <div className="w-full mb-3">
                    <h4 className="font-bold text-[#1A2E25] text-[13px] mb-2 border-b pb-1">Option 1: Scan QR Code</h4>
                    <div className="flex justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=7209741066-2@ybl&pn=Mamta%20kumari&am=${(cartTotal + (cartTotal >= 499 ? 0 : 99) - (isCouponApplied ? (couponCode === 'FIRST100' ? 100 : cartTotal * 0.1) : 0)).toFixed(2)}&cu=INR`)}`}
                        alt="Payment QR Code" 
                        className="w-28 h-28 object-contain rounded-xl border border-gray-100"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = '/assets/qrcode.jpeg';
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full mb-3">
                    <h4 className="font-bold text-[#1A2E25] text-[13px] mb-2 border-b pb-1">Option 2: Pay via UPI ID</h4>
                    <div className="bg-[#f8f6f2] p-2 rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium text-[#1A2E25] border border-[#eee]">
                      <span>7209741066-2@ybl</span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          navigator.clipboard.writeText('7209741066-2@ybl');
                          const icon = e.currentTarget;
                          icon.style.color = '#0A4736';
                          setTimeout(() => icon.style.color = '#82634F', 2000);
                        }}
                        className="p-1 text-[#82634F] hover:text-[#0A4736] transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full">
                    <h4 className="font-bold text-[#1A2E25] text-[13px] mb-1 border-b pb-1">Option 3: Bank Transfer</h4>
                    <div className="bg-[#f8f6f2] p-2 rounded-xl text-[12px] leading-relaxed text-[#1A2E25] border border-[#eee]">
                      <div className="flex justify-between mb-1"><span className="text-gray-500">Name:</span> <span className="font-bold">Mamta kumari</span></div>
                      <div className="flex justify-between mb-1"><span className="text-gray-500">A/c No:</span> <span className="font-bold">39983163990</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">IFSC:</span> <span className="font-bold">SBIN0014280</span></div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Transaction ID / UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value);
                      setQrError('');
                    }}
                    placeholder="Enter 12-digit UTR number"
                    className="w-full px-4 py-3.5 bg-[#F8F6F2] border border-[#E8E0D5] rounded-xl text-[15px] focus:outline-none focus:border-[#82634F] focus:ring-1 focus:ring-[#82634F] transition-colors"
                  />
                  {qrError && (
                    <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {qrError}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !utrNumber.trim()}
                  className="w-full bg-[#1A2E25] text-white h-[56px] rounded-xl font-sans font-bold tracking-wide shadow-md hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Verifying...' : 'Confirm Payment'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
