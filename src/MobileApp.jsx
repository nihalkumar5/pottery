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
  const { products, cart, addToCart, cartTotal, submitOrder, trackOrder } = useShop();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <div className="mobile-root font-sans bg-background text-primary min-h-screen relative overflow-hidden">
      {/* Sticky Top Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="flex items-center justify-between px-6">
          <Menu className="w-6 h-6 text-primary cursor-pointer" onClick={() => setIsMenuOpen(true)} />
          <h1 className="font-serif text-2xl tracking-widest font-bold">TIERRA</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center pt-20 pb-32 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img src="/assets/hero.png" alt="Pottery Artisan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
        
        <div className="relative z-10 px-8 text-white text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl leading-[1.1] tracking-tight mb-6"
          >
            Formed by Earth.<br />
            <span className="italic text-white/90 font-light">Finished by hand.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm font-light text-white/80 mb-10 max-w-sm mx-auto leading-relaxed tracking-wide"
          >
            Every piece is shaped by skilled artisans using natural clay and timeless techniques.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4 items-center"
          >
            <button 
              onClick={() => {
                const shopSection = document.getElementById('shop');
                if (shopSection) {
                  shopSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-primary py-4 px-10 rounded-full font-medium text-sm tracking-widest shadow-xl hover:scale-105 transition-transform uppercase"
            >
              Shop Collection
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
        <div className="flex flex-col gap-8">
          {products.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedProduct(item)}
              className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 cursor-pointer"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-background">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs text-secondary">{item.rating}</span>
                </div>
                <h4 className="font-serif text-lg leading-tight mb-1">{item.name}</h4>
                <p className="text-xs text-secondary mb-2 line-clamp-1">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">₹{item.price.toFixed(2)}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                    className="bg-primary text-white p-2 rounded-full shadow-md active:scale-90 transition-transform"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
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

      {/* Footer */}
      <footer className="bg-primary text-white/60 py-16 px-6 pb-20">
        <h2 className="font-serif text-2xl text-white tracking-widest font-bold mb-10">TIERRA</h2>
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <a href="#" className="hover:text-white transition-colors">Shop</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex flex-col gap-4">
            <a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); setIsTrackOrderOpen(true); }}>Track Order</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
        <p className="text-sm">© 2026 Tierra Ceramics. All rights reserved.</p>
      </footer>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Menu Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-serif text-2xl font-bold tracking-widest">MENU</h2>
              <X className="w-8 h-8 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex flex-col gap-8 text-2xl font-serif">
              <a href="#" className="hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Shop</a>
              <a href="#" className="hover:text-accent transition-colors" onClick={() => { setIsMenuOpen(false); setIsTrackOrderOpen(true); }}>Track Order</a>
              <a href="#" className="hover:text-accent transition-colors">Our Story</a>
            </div>
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
                  <p className="text-secondary mb-8">Thank you for shopping with Tierra. We will prepare your handcrafted ceramics shortly.</p>
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
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => setIsTrackOrderOpen(true)}>
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
        
        <div className="flex flex-col items-center gap-1 cursor-pointer text-primary hover:text-accent transition-colors" onClick={() => setIsMenuOpen(true)}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Profile</span>
        </div>
      </motion.div>
    </div>
  );
}
