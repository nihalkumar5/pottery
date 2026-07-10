import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Heart, ShoppingBag, Plus, Minus, User, ArrowRight, Star, X, CheckCircle, Check, PackageSearch, ArrowLeft, Snowflake, Droplets, Leaf, ShieldCheck, Lock, Truck, RotateCcw, Smartphone, Banknote } from 'lucide-react';
import { useShop } from './ShopContext';

const CATEGORIES = [
  { name: 'Drinkware', img: '/assets/vase.png' },
  { name: 'Water Storage', img: '/assets/vase.png' },
  { name: 'Traditional Bottles', img: '/assets/vase.png' },
  { name: 'Serveware', img: '/assets/vase.png' },
  { name: 'Decorative Collection', img: '/assets/vase.png' },
  { name: 'Featured Collections', img: '/assets/vase.png' },
];

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

export default function MobileApp() {
  const { products, cart, addToCart, removeFromCart, decreaseQuantity, cartTotal, cartItemCount, submitOrder, trackOrder, fetchUserOrders, user, login, logout, register, toggleWishlist, isInWishlist } = useShop();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCartAnim = (product) => {
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
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
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postcode: ''
  });

  // Mobile Track Order States
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackOrderEmail, setTrackOrderEmail] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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
    setIsSubmitting(true);

    if (paymentMethod === 'upi') {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        alert('Payment gateway failed to load. Please check your connection.');
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: 'rzp_test_YOUR_TEST_KEY', // Dummy key for UI test mode
        amount: Math.round(cartTotal * 100), // Amount in paise
        currency: 'INR',
        name: 'Clay & Craft',
        description: 'Premium Handcrafted Ceramics',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80',
        handler: async function (response) {
          // Success callback
          try {
            await submitOrder(formData);
            setOrderSuccess(true);
          } catch (error) {
            alert('Failed to save order details. Error: ' + error.message);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#415a46',
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      // Handle when modal is closed without payment
      paymentObject.on('payment.failed', function (response) {
        alert('Payment failed or cancelled.');
      });
      
      paymentObject.open();
      setIsSubmitting(false); // Modal takes over
    } else {
      // Cash on Delivery Flow
      try {
        await submitOrder(formData);
        setOrderSuccess(true);
      } catch (error) {
        const errMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Failed to place order: ' + errMsg);
      } finally {
        setIsSubmitting(false);
      }
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

  return (
    <div className="mobile-root font-sans bg-background text-primary min-h-screen relative overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-4 text-primary' : 'bg-transparent py-6 text-white'}`}>
        <div className="flex items-center justify-between px-6">
          <Menu className={`w-6 h-6 cursor-pointer transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} onClick={() => setIsMenuOpen(true)} />
          <h1 className="font-serif text-[1.35rem] font-light tracking-wide">Clay & Craft</h1>
          <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className={`w-6 h-6 transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </nav>

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
            Timeless<br />Tradition
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
      <section className="py-16 px-6 bg-white">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50">
            <User className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-serif text-xl mb-2">Handmade by Skilled Artisans</h3>
            <p className="text-secondary text-sm">Crafted with precision and years of heritage.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50">
            <Heart className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-serif text-xl mb-2">Sustainable Natural Clay</h3>
            <p className="text-secondary text-sm">Sourced ethically from the earth.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 pl-6">
        <h2 className="font-serif text-3xl mb-8 pr-6">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-8 pr-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div whileHover={{ y: -5 }} key={i} className="min-w-[200px] flex-shrink-0 cursor-pointer group">
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

      {/* WooCommerce Products */}
      <section id="shop" className="py-16 px-6 bg-background">
        <h2 className="font-serif text-3xl mb-8">Our Collection</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {products.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedProduct(item)}
              className="cursor-pointer group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm pb-4"
            >
              <div className="w-full aspect-[4/5] relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="px-4 pt-3 flex flex-col gap-1">
                <h4 className="font-serif text-[16px] font-bold text-[#1A2E25] leading-snug truncate">{item.name}</h4>
                <p className="font-sans text-[11px] text-gray-500">Handcrafted ceramic piece</p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[15px] font-bold text-[#1A2E25]">
                      ₹{item.price}
                    </span>
                    <span className="font-sans text-[11px] text-gray-400 line-through">
                      ₹{Math.round(item.price * 1.2)}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                    className="bg-[#0A4736] text-white p-2 rounded-full hover:bg-[#073326] transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                  </button>
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

      {/* Reviews */}
      <section className="py-16 bg-background pl-6">
        <h2 className="font-serif text-3xl mb-8 pr-6">Loved by Customers</h2>
        <div className="flex gap-6 overflow-x-auto pb-8 pr-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {REVIEWS.map((review) => (
            <div key={review.id} className="min-w-[280px] bg-white p-6 rounded-3xl shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-primary text-sm italic mb-6">"{review.text}"</p>
              <h4 className="font-serif text-lg">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#82634F] text-white pt-16 pb-32 px-8 rounded-t-3xl mt-4">
        <div className="mb-14">
          <h2 className="font-serif text-3xl mb-3">Join our community</h2>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">Subscribe to receive updates on new collections, exclusive offers, and stories behind our craft.</p>
          <div className="relative w-full max-w-[400px]">
            <input type="email" placeholder="Your email address" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-colors text-sm appearance-none" />
            <button className="absolute right-2 top-2 bottom-2 bg-white text-[#82634F] font-semibold tracking-widest uppercase text-xs px-6 rounded-full hover:bg-white/90 transition-colors">Subscribe</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-white/50">Shop</h3>
            <ul className="flex flex-col gap-4 text-sm list-none p-0 m-0">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">All Collections</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">Tableware</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">Vases</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">Gifts</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-white/50">Support</h3>
            <ul className="flex flex-col gap-4 text-sm list-none p-0 m-0">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light" onClick={(e) => { e.preventDefault(); user ? setIsProfileOpen(true) : setIsTrackOrderOpen(true); }}>Track Order</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">Shipping & Returns</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">Care Guide</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors no-underline font-light">Contact Us</a></li>
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
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex flex-col gap-10 mt-8">
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                href="#" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">01</span>
                Shop
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                href="#" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); user ? setIsProfileOpen(true) : setIsTrackOrderOpen(true); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">02</span>
                Track Order
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                href="#" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">03</span>
                Our Story
              </motion.a>
              <motion.a 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                href="#" 
                className="font-serif text-5xl text-white no-underline hover:text-accent hover:translate-x-4 transition-all duration-300 flex items-center gap-4 group" 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
              >
                <span className="text-sm font-sans text-white/30 group-hover:text-accent transition-colors">04</span>
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

        {/* Checkout Full Screen Modal */}
        {isCheckoutOpen && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8F6F2] z-50 flex flex-col font-sans"
          >
            <div className="p-6 pb-2 flex flex-col bg-[#F8F6F2]/90 backdrop-blur sticky top-0 z-10">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-serif text-[38px] font-semibold tracking-tight text-[#263228] flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#263228] text-[#F8F6F2] rounded-full flex items-center justify-center">
                    <Leaf className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </div>
                  Checkout
                </h1>
                <button onClick={() => { setIsCheckoutOpen(false); setCheckoutStep(1); }} className="p-2 bg-transparent rounded-full hover:bg-black/5 transition-colors">
                  <X className="w-5 h-5 text-[#263228]" />
                </button>
              </div>
              
              {/* Minimalist Stepper */}
              {!orderSuccess && (
                <div className="flex items-center justify-center px-4 mt-2 gap-3 mb-2">
                  <div className="flex items-center gap-2">
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
            </div>
            
            <div className="flex-1 overflow-y-auto pb-32">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center p-6 pt-12">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-24 h-24 bg-[#415a46] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#415a46]/20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <Check className="w-12 h-12 text-white" strokeWidth={3} />
                    </motion.div>
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
                      <div className="space-y-10 animate-fade-in pb-4 px-2">
                        <section>
                          <h3 className="font-serif text-[22px] text-[#263228] mb-8 border-b border-[#E8E2D8] pb-3">Contact Information</h3>
                          <div className="flex flex-col gap-10">
                            <div className="relative group">
                              <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">Email</label>
                              <input type="email" name="email" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="relative group">
                              <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">Phone Number</label>
                              <input type="tel" name="phone" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.phone} onChange={handleInputChange} />
                            </div>
                          </div>
                        </section>
                        
                        <section className="pt-4">
                          <h3 className="font-serif text-[22px] text-[#263228] mb-8 border-b border-[#E8E2D8] pb-3">Shipping Address</h3>
                          <div className="flex flex-col gap-10">
                            <div className="flex gap-6">
                              <div className="relative group w-1/2">
                                <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">First Name</label>
                                <input type="text" name="firstName" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.firstName} onChange={handleInputChange} />
                              </div>
                              <div className="relative group w-1/2">
                                <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">Last Name</label>
                                <input type="text" name="lastName" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.lastName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div className="relative group">
                              <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">Address Line 1</label>
                              <input type="text" name="address" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="relative group">
                              <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">Address Line 2 <span className="text-[#A39D96] normal-case tracking-normal">(Optional)</span></label>
                              <input type="text" name="address2" className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.address2 || ''} onChange={handleInputChange} />
                            </div>
                            <div className="flex gap-6">
                              <div className="relative group w-2/3">
                                <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">City</label>
                                <input type="text" name="city" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.city} onChange={handleInputChange} />
                              </div>
                              <div className="relative group w-1/3">
                                <label className="text-[13px] font-medium text-[#7A746D] block mb-2 transition-colors group-focus-within:text-[#263228] uppercase tracking-wider">PIN</label>
                                <input type="text" name="postcode" required className="w-full bg-transparent border-0 border-b border-[#E8E2D8] px-0 pb-2 focus:ring-0 focus:border-[#263228] transition-all text-[16px] text-[#263228] shadow-none" value={formData.postcode} onChange={handleInputChange} />
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    )}

                    {/* Step 2: Payment */}
                    {checkoutStep === 2 && (
                      <div className="space-y-6 animate-fade-in pb-4">
                        {/* Minimalist Order Summary */}
                        <div className="border-b border-[#D8D4CC] pb-6">
                          <h3 className="font-serif text-[18px] text-gray-800 mb-4">Order Summary</h3>
                          
                          <div className="space-y-3 mb-4">
                            {cart.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[15px] text-gray-900">
                                <span>{item.name} ×{item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2 mb-4 text-[14px] text-gray-500">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>Free</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-[#D8D4CC]">
                            <span className="font-medium text-gray-900 text-[16px]">Total</span>
                            <span className="font-medium text-[16px] text-[#415a46]">₹{cartTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Minimalist Payment Method */}
                        <div className="border-b border-[#D8D4CC] pb-6">
                          <h3 className="font-serif text-[18px] text-gray-800 mb-4">Payment Method</h3>
                          
                          <div className="space-y-4">
                            <div 
                              onClick={() => setPaymentMethod('upi')}
                              className="cursor-pointer group flex flex-col gap-2"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'upi' ? 'border-[#415a46]' : 'border-gray-400 group-hover:border-gray-600'}`}>
                                  {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-[#415a46] rounded-full"></div>}
                                </div>
                                <span className="text-[15px] text-gray-900 font-medium">UPI</span>
                              </div>
                              {paymentMethod === 'upi' && (
                                <div className="pl-8 flex items-center gap-2 opacity-70">
                                  <span className="text-[11px] font-bold text-gray-600 tracking-wider">GPay</span>
                                  <span className="text-[11px] text-gray-400">•</span>
                                  <span className="text-[11px] font-bold text-gray-600 tracking-wider">PhonePe</span>
                                  <span className="text-[11px] text-gray-400">•</span>
                                  <span className="text-[11px] font-bold text-gray-600 tracking-wider">Paytm</span>
                                </div>
                              )}
                            </div>

                            <div 
                              onClick={() => setPaymentMethod('cod')}
                              className="cursor-pointer group flex items-center gap-3"
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'cod' ? 'border-[#415a46]' : 'border-gray-400 group-hover:border-gray-600'}`}>
                                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#415a46] rounded-full"></div>}
                              </div>
                              <span className="text-[15px] text-gray-900 font-medium">Cash on Delivery</span>
                            </div>
                          </div>
                        </div>

                        {/* Minimalist Trust */}
                        <div className="flex items-center justify-center pt-2">
                          <p className="text-[13px] text-gray-500 font-medium flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Secure payment • Free shipping • Easy returns
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sticky Checkout Button */}
                  <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#F8F6F2] via-[#F8F6F2]/95 to-transparent pt-12 pb-6 px-5 z-20">
                    <div className="flex gap-3">
                      {checkoutStep > 1 && (
                        <button type="button" onClick={() => setCheckoutStep(prev => prev - 1)} className="px-6 bg-transparent border border-[#E8E2D8] text-[#263228] h-[60px] rounded-full font-sans font-medium tracking-wide hover:bg-black/5 transition-colors">
                          BACK
                        </button>
                      )}
                      <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#263228] text-white h-[60px] rounded-full font-sans font-medium tracking-wide shadow-xl shadow-[#263228]/20 hover:bg-[#1a231c] transition-all flex justify-center items-center gap-2 group hover:-translate-y-0.5">
                        {isSubmitting ? 'PROCESSING...' : checkoutStep === 2 ? (
                          `Complete Order ₹${cartTotal.toFixed(2)}`
                        ) : (
                          <>Continue to Payment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                        )}
                      </button>
                    </div>
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
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background">
              <h2 className="font-serif text-2xl">Track Order</h2>
              <X className="w-6 h-6 cursor-pointer text-gray-500" onClick={() => { setIsTrackOrderOpen(false); setTrackResult(null); setTrackError(''); }} />
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <form onSubmit={handleTrackOrderSubmit} className="flex flex-col gap-4 mb-8">
                <input type="text" placeholder="Order ID (e.g. 19)" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={trackOrderId} onChange={e => setTrackOrderId(e.target.value)} />
                <input type="email" placeholder="Billing Email" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={trackOrderEmail} onChange={e => setTrackOrderEmail(e.target.value)} />
                <button type="submit" disabled={isTrackLoading} className="w-full bg-accent text-white py-4 rounded-xl font-medium tracking-wide flex justify-center">
                  {isTrackLoading ? 'Searching...' : 'Track My Order'}
                </button>
              </form>
              
              {trackError && <p className="text-red-500 text-center p-4 bg-red-50 rounded-xl">{trackError}</p>}
              
              {trackResult && (
                <div className="bg-background p-6 rounded-2xl flex flex-col items-center text-center">
                  <PackageSearch className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Order #{trackResult.id}</h3>
                  <p className="text-secondary mb-6">Placed on: {new Date(trackResult.date_created).toLocaleDateString()}</p>
                  <div className="bg-white px-6 py-2 rounded-full shadow-sm text-primary font-medium tracking-wide uppercase text-sm border border-gray-100">
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
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background">
              <h2 className="font-serif text-2xl">{user ? 'My Account' : (isLoginMode ? 'Sign In' : 'Create Account')}</h2>
              <X className="w-6 h-6 cursor-pointer text-gray-500" onClick={() => setIsProfileOpen(false)} />
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col">
              {user ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                    <User className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="font-serif text-3xl mb-2">Welcome, {user.displayName || user.username}</h3>
                  <p className="text-secondary mb-8">{user.email}</p>
                  
                  <div className="w-full text-left mb-8 max-h-[40vh] overflow-y-auto">
                    <h4 className="font-serif text-xl mb-4">Your Recent Orders</h4>
                    {isLoadingOrders ? (
                      <p className="text-sm text-secondary">Loading orders...</p>
                    ) : userOrders.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {userOrders.map(order => (
                          <div key={order.id} className="bg-[#fdfbf9] border border-gray-100 p-4 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                              <strong className="font-serif">Order #{order.id}</strong>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>{order.status}</span>
                            </div>
                            <div className="text-xs text-secondary flex justify-between">
                              <span>{new Date(order.date_created).toLocaleDateString()}</span>
                              <span>₹{order.total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-secondary">You haven't placed any orders yet.</p>
                    )}
                  </div>

                  <div className="w-full max-w-sm flex flex-col gap-3">
                    <button onClick={() => logout()} className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-medium tracking-wide border border-red-100">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 mb-8 mt-10">
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-3xl mb-2">{isLoginMode ? 'Welcome Back' : 'Join Clay & Craft'}</h3>
                    <p className="text-secondary">Enter your details to continue.</p>
                  </div>
                  
                  {isLoginMode ? (
                    <input type="email" name="username" placeholder="Email Address" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={authForm.username} onChange={handleAuthChange} />
                  ) : (
                    <>
                      <input type="text" name="username" placeholder="Username" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={authForm.username} onChange={handleAuthChange} />
                      <input type="email" name="email" placeholder="Email Address" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={authForm.email} onChange={handleAuthChange} />
                    </>
                  )}
                  
                  <input type="password" name="password" placeholder="Password" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={authForm.password} onChange={handleAuthChange} />
                  
                  {authError && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{authError}</p>}
                  
                  <button type="submit" disabled={isAuthLoading} className="w-full bg-primary text-white py-4 rounded-xl font-medium tracking-wide flex justify-center mt-4">
                    {isAuthLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                  </button>
                  
                  <p className="text-center text-sm text-secondary mt-6">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }} className="text-accent font-medium hover:underline">
                      {isLoginMode ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </form>
              )}
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
              <h1 className="font-serif text-[1.35rem] font-light tracking-wide text-primary">Clay & Craft</h1>
              <motion.button 
                className="p-2 -mr-2 text-gray-800 relative border-none outline-none bg-transparent" 
                onClick={() => { setSelectedProduct(null); setIsCartOpen(true); }}
                animate={isAdding ? { scale: [1, 1.2, 1], y: [0, -5, 0] } : {}}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full"></span>
                )}
              </motion.button>
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
              <div className="bg-[#F5F5F5] rounded-3xl w-full aspect-[4/5] relative overflow-hidden flex flex-col items-center justify-center snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                {/* Simulated multiple images to allow scrolling */}
                <div className="flex w-full h-full">
                  {[selectedProduct.image, selectedProduct.image, selectedProduct.image].map((img, i) => (
                    <div key={i} className="min-w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative">
                       <img src={img} alt={selectedProduct.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  ))}
                </div>
                {/* Pagination Dots */}
                <div className="absolute bottom-4 flex gap-2 w-full justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#3F5B46]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </div>
            
            <div className="px-6 pt-8">
              <h2 className="font-sans text-[26px] leading-tight font-semibold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 text-[15px] mb-4">Insulated. Leakproof. Built for everyday.</p>
              
              <div className="mt-8 mb-8">
                <h3 className="font-serif font-semibold text-gray-800 mb-2 text-xl">Product Details</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed max-w-[95%]">
                  {selectedProduct.desc || 'A beautiful, handcrafted piece designed to elevate your everyday living. Made with premium materials and sustainable practices.'}
                </p>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium mt-4 bg-green-50 p-4 rounded-2xl w-fit">
                  <CheckCircle className="w-4 h-4" /> In Stock & Ready to Ship
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 mb-6">
                <div className="flex text-[#3F5B46]">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-1">4.8 (1,247 reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-10">
                <span className="font-sans text-[24px] font-semibold text-[#3F5B46]">₹{selectedProduct.price}</span>
                <span className="font-sans text-[16px] text-gray-400 line-through">₹{(selectedProduct.price * 1.5).toFixed(2)}</span>
                <span className="bg-[#E7F0E9] text-[#3F5B46] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Save 33%</span>
              </div>

              {/* Horizontal Scrollable Features */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
                <div className="flex flex-col items-center text-center min-w-[90px]">
                  <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3 text-[#3F5B46]">
                    <Snowflake className="w-6 h-6" />
                  </div>
                  <span className="text-[12px] font-medium text-gray-700 leading-tight">Keeps Drinks<br/>Cold 24 Hrs</span>
                </div>
                <div className="flex flex-col items-center text-center min-w-[90px]">
                  <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3 text-gray-700">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <span className="text-[12px] font-medium text-gray-700 leading-tight">Leakproof<br/>Design</span>
                </div>
                <div className="flex flex-col items-center text-center min-w-[90px]">
                  <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3 text-[#3F5B46]">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <span className="text-[12px] font-medium text-gray-700 leading-tight">BPA-Free<br/>Materials</span>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white pb-6 pt-4 px-6 border-t border-gray-100 z-20">
              {cart.find(item => item.id === selectedProduct.id) ? (
                <div className="flex items-center justify-between w-full bg-[#F5F5F5] rounded-full py-2 px-6 mb-3 border border-gray-200">
                  <button onClick={() => decreaseQuantity(selectedProduct.id)} className="p-3 text-gray-800 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-sans font-bold text-[18px] text-gray-900 w-12 text-center">
                    {cart.find(item => item.id === selectedProduct.id).quantity}
                  </span>
                  <button onClick={() => handleAddToCartAnim(selectedProduct)} className="p-3 text-gray-800 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleAddToCartAnim(selectedProduct)}
                  className="w-full bg-[#415a46] text-white py-4 rounded-full font-sans font-bold text-[15px] tracking-wide mb-3 hover:bg-[#2f4233] transition-colors"
                >
                  ADD TO CART • ₹{selectedProduct.price}
                </button>
              )}
              <div className="flex items-center justify-center gap-2 text-gray-600 text-[12px] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#415a46]" />
                Free Shipping on Orders Above ₹999
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Floating Bottom Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full py-4 px-8 z-40 flex justify-between items-center"
      >
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Explore</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors">
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Saved</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => user ? setIsProfileOpen(true) : setIsTrackOrderOpen(true)}>
          <PackageSearch className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Track</span>
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
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => setIsProfileOpen(true)}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Profile</span>
        </div>
      </motion.div>
    </div>
  );
}
