import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Heart, ShoppingBag, User, ArrowRight, Star, X, CheckCircle, PackageSearch } from 'lucide-react';
import { useShop } from './ShopContext';

const CATEGORIES = [
  { name: 'Mugs', img: '/assets/vase.png' },
  { name: 'Bowls', img: '/assets/vase.png' },
  { name: 'Plates', img: '/assets/vase.png' },
  { name: 'Vases', img: '/assets/vase.png' },
  { name: 'Kitchen Essentials', img: '/assets/vase.png' },
];

const REVIEWS = [
  { id: 1, name: 'Sarah M.', text: 'The most beautiful mugs I own. The craftsmanship is incredible.', rating: 5 },
  { id: 2, name: 'James K.', text: 'Fast shipping and stunning quality. A premium unboxing experience.', rating: 5 },
  { id: 3, name: 'Elena R.', text: 'Perfectly balanced plates that make every dinner feel special.', rating: 5 },
];

export default function MobileApp() {
  const { products, cart, addToCart, cartTotal, submitOrder, trackOrder, fetchUserOrders, user, login, logout, register } = useShop();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', postcode: ''
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

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitOrder(formData);
      setOrderSuccess(true);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to place order: ' + errMsg);
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

  return (
    <div className="mobile-root font-sans bg-background text-primary min-h-screen relative overflow-hidden">
      {/* Sticky Top Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-4 text-primary' : 'bg-transparent py-6 text-white'}`}>
        <div className="flex items-center justify-between px-6">
          <Menu className={`w-6 h-6 cursor-pointer transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`} onClick={() => setIsMenuOpen(true)} />
          <h1 className="font-serif text-[1.35rem] font-light tracking-wide">Clay & Craft</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img src="/assets/hero-mobile.png" alt="Handcrafted Pottery" className="absolute inset-0 w-full h-full object-cover" />
        {/* Removed gradient overlay to keep it full opacity and natural */}
        
        <div className="relative z-10 px-8 pt-32 text-[#EAE6DF] text-left h-full flex flex-col justify-start">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-[9px] font-thin uppercase tracking-[0.35em] text-white/90 mb-3 block"
          >
            New Collection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="font-hero font-light text-[2.75rem] leading-[1.05] tracking-tight mb-5"
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
              className="bg-[#D3CAB6] text-[#3A332C] py-2.5 px-6 rounded-full font-medium text-[11px] tracking-[0.05em] hover:bg-[#c4baa4] transition-colors flex items-center gap-3"
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
              className="cursor-pointer group flex flex-col"
            >
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden mb-4 relative bg-white shadow-sm">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                  className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-primary p-2.5 rounded-full shadow hover:bg-white transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
              <div className="px-1 flex-1 flex flex-col mt-1">
                <h4 className="font-serif text-[0.95rem] leading-snug line-clamp-2 text-[#2C2A29] mb-1">{item.name}</h4>
                <div className="mt-auto">
                  <span className="font-sans text-[13px] tracking-wide text-[#2C2A29] font-medium">
                    ₹ {item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white text-center px-6">
        <div className="w-full h-80 rounded-[40px] overflow-hidden mb-10">
          <img src="/assets/hero.png" alt="Artisan working" className="w-full h-full object-cover" />
        </div>
        <h2 className="font-serif text-3xl mb-4">Made Slowly.<br/>Crafted with Purpose.</h2>
        <p className="text-secondary text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          We believe in the beauty of imperfection. Every piece in our collection is handcrafted in small batches using traditional wheel-throwing and hand-building techniques.
        </p>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-[90%] max-w-[400px] h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-serif text-2xl">Your Cart ({cart.length})</h2>
                <X className="w-6 h-6 cursor-pointer text-gray-500" onClick={() => setIsCartOpen(false)} />
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-secondary">
                    <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-background" />
                        <div className="flex-1">
                          <h4 className="font-serif text-lg">{item.name}</h4>
                          <p className="text-secondary font-medium">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-background/30">
                  <div className="flex justify-between font-serif text-xl mb-6">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full bg-primary text-white py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2"
                  >
                    Checkout Securely <ArrowRight className="w-5 h-5" />
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
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background">
              <h2 className="font-serif text-2xl">Checkout</h2>
              <X className="w-6 h-6 cursor-pointer text-gray-500" onClick={() => setIsCheckoutOpen(false)} />
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <CheckCircle className="w-16 h-16 text-accent mb-6" />
                  <h3 className="font-serif text-3xl mb-4">Order Placed!</h3>
                  <p className="text-secondary mb-8">Thank you for shopping with Clay & Craft. We will prepare your handcrafted ceramics shortly.</p>
                  <button 
                    className="w-full bg-primary text-white py-4 rounded-xl font-medium tracking-wide"
                    onClick={() => { setIsCheckoutOpen(false); setOrderSuccess(false); }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                  <div className="flex justify-between font-serif text-xl mb-6 pb-6 border-b border-gray-100">
                    <span>Total Amount:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <input type="text" name="firstName" placeholder="First Name" required className="w-1/2 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={formData.firstName} onChange={handleInputChange} />
                    <input type="text" name="lastName" placeholder="Last Name" required className="w-1/2 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                  <input type="email" name="email" placeholder="Email Address" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={formData.email} onChange={handleInputChange} />
                  <input type="text" name="address" placeholder="Shipping Address" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={formData.address} onChange={handleInputChange} />
                  <div className="flex gap-4">
                    <input type="text" name="city" placeholder="City" required className="w-2/3 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={formData.city} onChange={handleInputChange} />
                    <input type="text" name="postcode" placeholder="PIN" required className="w-1/3 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent" value={formData.postcode} onChange={handleInputChange} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-xl font-medium tracking-wide mt-4 flex justify-center">
                    {isSubmitting ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                  </button>
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
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full rounded-t-[40px] flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="relative h-72 w-full bg-background flex-shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-serif text-3xl">{selectedProduct.name}</h2>
                  <span className="font-medium text-xl">₹{selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{selectedProduct.rating} Rating</span>
                </div>
                <p className="text-secondary leading-relaxed mb-8">
                  {selectedProduct.desc}
                </p>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-8 bg-green-50 p-4 rounded-2xl">
                  <CheckCircle className="w-5 h-5" /> In Stock & Ready to Ship
                </div>
                
                <button 
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full bg-primary text-white py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </motion.div>
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
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => user ? setIsProfileOpen(true) : setIsTrackOrderOpen(true)}>
          <PackageSearch className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Track</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors relative" onClick={() => setIsCartOpen(true)}>
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Bag</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
              {cart.length}
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
