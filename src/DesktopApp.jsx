import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from './ShopContext';
import { ArrowRight, Heart, Plus, Minus, ShoppingBag, User, Truck, ShieldCheck } from 'lucide-react';
import DesktopCollections from './DesktopCollections';

function DesktopApp({ setCurrentPage, currentPage }) {
  const { products, cart, addToCart, removeFromCart, decreaseQuantity, cartItemCount, cartTotal, submitOrder, trackOrder, fetchUserOrders, user, login, logout, register } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Compute categories dynamically based on fetched products
  const CATEGORIES = useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.category).filter(Boolean))];
    const spiritualIndex = uniqueCats.indexOf('Spiritual Collection');
    if (spiritualIndex > -1) {
      uniqueCats.splice(spiritualIndex, 1);
      uniqueCats.push('Spiritual Collection');
    }
    
    const customImages = {
      'Home Decor': '/assets/home.png',
      'Water Bottles': '/assets/botle.png',
      'Water Storage': '/assets/water.png',
      'Spiritual Collection': '/assets/sc2.png',
      'Serveware': '/assets/serb.png',
      'Drinkware': '/assets/d2.png'
    };

    return uniqueCats.map(name => {
      const firstProduct = products.find(p => p.category === name);
      return { 
        name, 
        img: customImages[name] || (firstProduct ? firstProduct.image : '/assets/vase.png') 
      };
    });
  }, [products]);

  // Auth States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [products]);

  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postcode: ''
  });

  // Track Order States
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackOrderEmail, setTrackOrderEmail] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  
  // User Orders
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (user && isAuthOpen) {
      setIsLoadingOrders(true);
      fetchUserOrders(user.email).then(orders => {
        setUserOrders(orders);
        setIsLoadingOrders(false);
      });
    }
  }, [user, isAuthOpen]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const openCheckout = () => {
    setIsCartOpen(false);
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const openTrackOrder = () => setIsTrackOrderOpen(true);
  
  const closeTrackOrder = () => {
    setIsTrackOrderOpen(false);
    setTrackResult(null);
    setTrackError('');
    setTrackOrderId('');
    setTrackOrderEmail('');
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
      setIsAuthOpen(false); // close after success
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  return (
    <div className="desktop-root">
      <nav className={`navbar ${!isScrolled ? 'transparent' : ''}`}>
        <div 
          className="logo" 
          style={{ textTransform: 'none', fontWeight: 300, letterSpacing: '0.05em', fontSize: '1.5rem', cursor: 'pointer' }}
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo(0, 0);
          }}
        >
          Clay & Craft
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(null); setCurrentPage('shop'); window.scrollTo(0, 0); }}>Shop</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('shop'); window.scrollTo(0, 0); }}>Collections</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); user ? setIsAuthOpen(true) : openTrackOrder(); }}>Track Order</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setIsAuthOpen(true); }}>{user ? 'My Account' : 'Sign In'}</a></li>
        </ul>
        <div className="cart-icon" onClick={toggleCart} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <ShoppingBag size={20} strokeWidth={1.5} />
          {cartItemCount > 0 && <span style={{ background: '#1A2E25', color: '#F8F6F2', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.75rem', fontWeight: 'bold', minWidth: '1.2rem', textAlign: 'center' }}>{cartItemCount}</span>}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={toggleCart}>&times;</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div className="cart-item" key={`${item.id}-${idx}`}>
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="product-price">₹{item.price.toFixed(2)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #eee', padding: '4px 12px', borderRadius: '4px' }}>
                      <button onClick={() => decreaseQuantity(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="remove-item" onClick={() => removeFromCart(item.id)} style={{ marginTop: 0 }}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn-checkout" onClick={openCheckout}>Checkout Securely</button>
          </div>
        )}
      </div>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>

      {/* Checkout Modal */}
      <div className={`checkout-modal-overlay ${isCheckoutOpen ? 'open' : ''}`}>
        <div className="checkout-modal">
          <button className="close-modal" onClick={closeCheckout}>&times;</button>
          
          {orderSuccess ? (
            <div className="order-success">
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for shopping with Clay & Craft. We will prepare your handcrafted ceramics shortly.</p>
              <button className="btn-primary" onClick={closeCheckout} style={{marginTop: '2rem'}}>Continue Shopping</button>
            </div>
          ) : (
            <>
              <div className="checkout-header">
                <h2>{checkoutStep === 1 ? 'Shipping Details' : 'Payment Details'}</h2>
                <p>Total: ₹{cartTotal.toFixed(2)}</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (checkoutStep === 1) {
                  setCheckoutStep(2);
                } else {
                  handleCheckoutSubmit(e);
                }
              }}>
                {checkoutStep === 1 ? (
                  <>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <div className="form-group" style={{flex: 1}}>
                        <label>First Name</label>
                        <input type="text" name="firstName" required className="form-input" value={formData.firstName} onChange={handleInputChange} />
                      </div>
                      <div className="form-group" style={{flex: 1}}>
                        <label>Last Name</label>
                        <input type="text" name="lastName" required className="form-input" value={formData.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" required className="form-input" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Shipping Address</label>
                      <input type="text" name="address" required className="form-input" value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <div className="form-group" style={{flex: 2}}>
                        <label>City</label>
                        <input type="text" name="city" required className="form-input" value={formData.city} onChange={handleInputChange} />
                      </div>
                      <div className="form-group" style={{flex: 1}}>
                        <label>PIN Code</label>
                        <input type="text" name="postcode" required className="form-input" value={formData.postcode} onChange={handleInputChange} />
                      </div>
                    </div>
                    <button type="submit" className="btn-checkout">
                      Continue to Payment
                    </button>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Payment Method</label>
                      <div style={{padding: '1rem', border: '1px solid #1A2E25', borderRadius: '8px', background: '#f8f6f2', fontWeight: 600}}>
                        <input type="radio" checked readOnly style={{marginRight: '0.5rem'}} /> 
                        Cash on Delivery (COD)
                      </div>
                    </div>
                    
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep(1)} 
                        style={{flex: 1, padding: '0.8rem', border: '1px solid #1A2E25', background: 'transparent', color: '#1A2E25', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}
                      >
                        Back
                      </button>
                      <button type="submit" className="btn-checkout" disabled={isSubmitting} style={{flex: 2}}>
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div style={{marginTop: '1.5rem', textAlign: 'center', opacity: 0.8}}>
                      <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                        <div style={{padding: '0.25rem 0.5rem', background: '#fff', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{height: '14px', objectFit: 'contain'}} />
                        </div>
                        <div style={{padding: '0.25rem 0.5rem', background: '#fff', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{height: '14px', objectFit: 'contain'}} />
                        </div>
                        <div style={{padding: '0.25rem 0.5rem', background: '#fff', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{height: '14px', objectFit: 'contain'}} />
                        </div>
                        <div style={{padding: '0.25rem 0.5rem', background: '#fff', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" style={{height: '14px', objectFit: 'contain'}} />
                        </div>
                      </div>
                      <p style={{fontSize: '0.75rem', color: '#666', margin: 0}}>Guarantee Safe and Secure Payment Checkout</p>
                    </div>
                  </>
                )}
              </form>
            </>
          )}
        </div>
      </div>

      {/* Track Order Modal */}
      <div className={`checkout-modal-overlay ${isTrackOrderOpen ? 'open' : ''}`}>
        <div className="checkout-modal">
          <button className="close-modal" onClick={closeTrackOrder}>&times;</button>
          
          <div className="checkout-header">
            <h2>Track Your Order</h2>
            <p>Enter your Order ID and Email to view the real-time status.</p>
          </div>
          
          <form onSubmit={handleTrackOrderSubmit}>
            <div className="form-group">
              <label>Order ID (e.g. 19)</label>
              <input type="text" required className="form-input" value={trackOrderId} onChange={e => setTrackOrderId(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Billing Email</label>
              <input type="email" required className="form-input" value={trackOrderEmail} onChange={e => setTrackOrderEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn-checkout" disabled={isTrackLoading}>
              {isTrackLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {trackError && <p style={{color: 'red', marginTop: '1rem'}}>{trackError}</p>}
          
          {trackResult && (
            <div className="track-result">
              <h3>Order #{trackResult.id}</h3>
              <p>Placed on: {new Date(trackResult.date_created).toLocaleDateString()}</p>
              <div className={`track-status-badge status-${trackResult.status}`}>
                Status: {trackResult.status}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <div className={`checkout-modal-overlay ${isAuthOpen ? 'open' : ''}`}>
        <div className="checkout-modal">
          <button className="close-modal" onClick={() => setIsAuthOpen(false)}>&times;</button>
          
          {user ? (
            <div className="order-success" style={{textAlign: 'center', padding: '2rem 0', maxHeight: '70vh', overflowY: 'auto'}}>
              <h3>Welcome, {user.displayName || user.username}</h3>
              <p style={{color: 'var(--color-secondary)'}}>{user.email}</p>
              
              <div style={{textAlign: 'left', margin: '2rem 0'}}>
                <h4>Your Recent Orders</h4>
                {isLoadingOrders ? (
                  <p style={{marginTop: '1rem'}}>Loading orders...</p>
                ) : userOrders.length > 0 ? (
                  <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                    {userOrders.map(order => (
                      <li key={order.id} style={{padding: '1.5rem', border: '1px solid #eee', marginBottom: '1rem', borderRadius: '8px', background: '#fdfbf9'}}>
                        <strong>Order #{order.id}</strong> - {new Date(order.date_created).toLocaleDateString()}
                        <span className={`track-status-badge status-${order.status}`} style={{float: 'right', fontSize: '12px'}}>{order.status}</span>
                        <div style={{marginTop: '0.5rem', fontSize: '14px', color: 'var(--color-secondary)'}}>
                          Total: ₹{order.total} | Payment: {order.payment_method_title}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{marginTop: '1rem'}}>You haven't placed any orders yet.</p>
                )}
              </div>
              
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button className="btn-checkout" style={{background: '#8A6545'}} onClick={() => logout()}>Sign Out</button>
              </div>
            </div>
          ) : (
            <>
              <div className="checkout-header">
                <h2>{isLoginMode ? 'Sign In' : 'Create Account'}</h2>
                <p>{isLoginMode ? 'Welcome back to Clay & Craft' : 'Join our community'}</p>
              </div>
              <form onSubmit={handleAuthSubmit}>
                {isLoginMode ? (
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="username" required className="form-input" value={authForm.username} onChange={handleAuthChange} />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Username</label>
                      <input type="text" name="username" required className="form-input" value={authForm.username} onChange={handleAuthChange} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" required className="form-input" value={authForm.email} onChange={handleAuthChange} />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" required className="form-input" value={authForm.password} onChange={handleAuthChange} />
                </div>
                
                {authError && <p style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{authError}</p>}
                
                <button type="submit" className="btn-checkout" disabled={isAuthLoading}>
                  {isAuthLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Register')}
                </button>
                
                <p style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-secondary)'}}>
                  {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }} style={{background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 'bold'}}>
                    {isLoginMode ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
      <header className="hero">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-subtitle">New Collection</span>
          <h1>Timeless Tradition</h1>
          <div className="hero-divider"></div>
          <p>Handcrafted clay pieces, rooted in culture, made for today.</p>
          <button className="btn-primary" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Collection <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="desktop-features">
        <div className="feature-card">
          <User className="feature-icon" />
          <h3>Handmade by Artisans</h3>
          <p>Crafted with precision & heritage.</p>
        </div>
        <div className="feature-card">
          <Heart className="feature-icon" />
          <h3>Sustainable Clay</h3>
          <p>Sourced ethically from the earth.</p>
        </div>
        <div className="feature-card">
          <Truck className="feature-icon" />
          <h3>Secure Shipping</h3>
          <p>Safely delivered to your door.</p>
        </div>
        <div className="feature-card">
          <ShieldCheck className="feature-icon" />
          <h3>Secure Payments</h3>
          <p>100% safe & trusted.</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="desktop-categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <div 
              key={i} 
              className="category-card"
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentPage('shop');
                window.scrollTo(0, 0);
              }}
            >
              <div className="category-image">
                <img src={cat.img} alt={cat.name} />
                <div className="category-overlay"></div>
              </div>
              <div className="category-info">
                <h3>{cat.name}</h3>
                <ArrowRight size={20} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="shop">
        <div className="section-header">
          <h2>Featured Pieces</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('shop'); window.scrollTo(0, 0); }} style={{color: 'var(--color-accent)', textDecoration: 'none'}}>View All</a>
        </div>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <div 
              key={product.id} 
              className="cursor-pointer group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow pb-5 h-full"
              onClick={() => {
                // optional: go to product detail if we had one
                // for now just add to cart or keep as is
              }}
            >
              <div className="w-full aspect-[4/5] relative shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="px-5 pt-4 flex flex-col flex-grow gap-1.5 justify-between">
                <div>
                  <h4 className="font-serif text-[18px] font-bold text-[#1A2E25] leading-snug line-clamp-2">{product.name}</h4>
                  <p className="font-sans text-[13px] text-gray-500">Handcrafted ceramic piece</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[17px] font-bold text-[#1A2E25]">
                      ₹{product.price}
                    </span>
                    <span className="font-sans text-[13px] text-gray-400 line-through">
                      ₹{Math.round(product.price * 1.2)}
                    </span>
                  </div>
                  {(() => {
                    const cartItem = cart.find(item => item.id === product.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    
                    const animateToCart = (e) => {
                      const button = e.currentTarget;
                      const cartIcon = document.querySelector('.cart-icon');
                      if (!cartIcon || !button) return;

                      const btnRect = button.getBoundingClientRect();
                      const cartRect = cartIcon.getBoundingClientRect();

                      const flyImg = document.createElement('img');
                      flyImg.src = product.image;
                      flyImg.style.position = 'fixed';
                      flyImg.style.width = '40px';
                      flyImg.style.height = '40px';
                      flyImg.style.borderRadius = '50%';
                      flyImg.style.objectFit = 'cover';
                      flyImg.style.zIndex = '9999';
                      flyImg.style.top = `${btnRect.top}px`;
                      flyImg.style.left = `${btnRect.left}px`;
                      flyImg.style.transition = 'all 0.6s cubic-bezier(0.2, 1, 0.3, 1)';
                      flyImg.style.pointerEvents = 'none';

                      document.body.appendChild(flyImg);

                      requestAnimationFrame(() => {
                        flyImg.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
                        flyImg.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
                        flyImg.style.transform = 'scale(0.3)';
                        flyImg.style.opacity = '0';
                      });

                      setTimeout(() => {
                        if (document.body.contains(flyImg)) {
                          document.body.removeChild(flyImg);
                        }
                      }, 600);
                    };
                    
                    return qty === 0 ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); animateToCart(e); addToCart(product); }}
                        className="bg-[#0A4736] text-white p-2.5 rounded-full hover:bg-[#073326] transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    ) : (
                      <div className="flex items-center bg-[#F0EBE1] rounded-full p-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => decreaseQuantity(product.id)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-[#1A2E25] transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-[#1A2E25]">{qty}</span>
                        <button onClick={(e) => { animateToCart(e); addToCart(product); }} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-[#1A2E25] transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
        </>
      ) : currentPage === 'shop' ? (
        <DesktopCollections initialCategory={selectedCategory || 'All'} />
      ) : null}

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="premium-footer-top">
          <div className="premium-footer-newsletter">
            <h2>Join our community</h2>
            <p>Subscribe to receive updates on new collections, exclusive offers, and the stories behind our craft.</p>
            <div className="newsletter-input-group">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
          <div className="premium-footer-links-wrapper">
            <div className="premium-footer-links">
              <h3>Legal</h3>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Privacy Policy'); window.scrollTo(0, 0); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Terms And Conditions'); window.scrollTo(0, 0); }}>Terms & Conditions</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Refund And Cancellation'); window.scrollTo(0, 0); }}>Refund & Cancellation</a></li>
              </ul>
            </div>
            <div className="premium-footer-links">
              <h3>Support</h3>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); user ? setIsAuthOpen(true) : openTrackOrder(); }}>Track Order</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Shipping And Delivery'); window.scrollTo(0, 0); }}>Shipping & Delivery</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('About Us'); window.scrollTo(0, 0); }}>About Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('Contact Us'); window.scrollTo(0, 0); }}>Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="premium-footer-bottom">
          <h2 className="premium-footer-brand">CLAY & CRAFT</h2>
          <div className="premium-footer-socials">
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Journal</a>
          </div>
          <p className="premium-footer-copyright">© 2026 Clay & Craft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default DesktopApp;
