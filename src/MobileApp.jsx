import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Heart, ShoppingBag, User, ArrowRight, Star } from 'lucide-react';

const CATEGORIES = [
  { name: 'Mugs', img: '/assets/vase.png' },
  { name: 'Bowls', img: '/assets/vase.png' },
  { name: 'Plates', img: '/assets/vase.png' },
  { name: 'Vases', img: '/assets/vase.png' },
  { name: 'Kitchen Essentials', img: '/assets/vase.png' },
];

const BEST_SELLERS = [
  { id: 1, name: 'Mate Plate', desc: 'Matte White Glaze', rating: 4.9, price: 80, image: '/assets/vase.png' },
  { id: 2, name: 'Temmoku Bowl', desc: 'Dark Earth Finish', rating: 4.8, price: 120, image: '/assets/vase.png' },
  { id: 3, name: 'Artisan Mug', desc: 'Hand-thrown Ceramic', rating: 5.0, price: 45, image: '/assets/vase.png' },
];

const REVIEWS = [
  { id: 1, name: 'Sarah M.', text: 'The most beautiful mugs I own. The craftsmanship is incredible.', rating: 5 },
  { id: 2, name: 'James K.', text: 'Fast shipping and stunning quality. A premium unboxing experience.', rating: 5 },
  { id: 3, name: 'Elena R.', text: 'Perfectly balanced plates that make every dinner feel special.', rating: 5 },
];

export default function MobileApp() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="mobile-root font-sans bg-background text-primary min-h-screen">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="flex items-center justify-between px-6">
          <Menu className="w-6 h-6 text-primary cursor-pointer" />
          <h1 className="font-serif text-2xl tracking-widest font-bold">TIERRA</h1>
          <div className="flex gap-4">
            <Search className="w-5 h-5 text-primary cursor-pointer" />
            <ShoppingBag className="w-5 h-5 text-primary cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-end pb-24 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img src="/assets/hero.png" alt="Pottery Artisan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </motion.div>
        
        <div className="relative z-10 px-6 text-white text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl leading-tight mb-4"
          >
            Handcrafted Pottery<br />That Brings Warmth Home
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm font-light text-white/90 mb-8 max-w-sm mx-auto"
          >
            Every bowl, mug, and vase is shaped by skilled artisans using natural clay and timeless techniques.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4"
          >
            <button className="bg-white text-primary py-4 px-8 rounded-full font-semibold text-sm tracking-wide shadow-lg w-full">Shop Collection</button>
            <button className="bg-transparent text-white border border-white/50 py-4 px-8 rounded-full font-semibold text-sm tracking-wide w-full backdrop-blur-sm">Our Story</button>
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
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/50">
            <ShoppingBag className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-serif text-xl mb-2">Worldwide Shipping</h3>
            <p className="text-secondary text-sm">Delivered safely to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 pl-6">
        <h2 className="font-serif text-3xl mb-8 pr-6">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-8 pr-6 scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={i} 
              className="min-w-[200px] flex-shrink-0 cursor-pointer group"
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

      {/* Best Sellers */}
      <section className="py-16 px-6 bg-background">
        <h2 className="font-serif text-3xl mb-8">Best Sellers</h2>
        <div className="flex flex-col gap-8">
          {BEST_SELLERS.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-background">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs text-secondary">{item.rating}</span>
                </div>
                <h4 className="font-serif text-lg leading-tight mb-1">{item.name}</h4>
                <p className="text-xs text-secondary mb-2">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">${item.price}</span>
                  <button className="bg-primary text-white p-2 rounded-full shadow-md">
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
        <button className="border-b border-primary pb-1 font-medium text-sm">Read Our Story</button>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-background pl-6">
        <h2 className="font-serif text-3xl mb-8 pr-6">Loved by Customers</h2>
        <div className="flex gap-6 overflow-x-auto pb-8 pr-6 scrollbar-hide">
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

      {/* Newsletter */}
      <section className="py-24 px-6 text-center bg-white">
        <h2 className="font-serif text-3xl mb-4">Join Our Journey</h2>
        <p className="text-secondary text-sm mb-8">Receive stories, new collections and exclusive releases.</p>
        <div className="flex flex-col gap-4">
          <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-accent font-sans" />
          <button className="w-full bg-primary text-white py-4 rounded-xl font-medium tracking-wide">Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white/60 py-16 px-6 pb-32">
        <h2 className="font-serif text-2xl text-white tracking-widest font-bold mb-10">TIERRA</h2>
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <a href="#" className="hover:text-white transition-colors">Shop</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-4">
            <a href="#" className="hover:text-white transition-colors">Shipping</a>
            <a href="#" className="hover:text-white transition-colors">Returns</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
        <p className="text-sm">© 2026 Tierra Ceramics. All rights reserved.</p>
      </footer>
    </div>
  );
}
