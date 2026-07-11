import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from './ShopContext';
import { ArrowRight, Heart, Plus, Minus, ShoppingBag, User, Truck, ShieldCheck, HandHeart, Leaf, Flower2, Star, Copy } from 'lucide-react';
import DesktopCollections from './DesktopCollections';
import DesktopAbout from './DesktopAbout';
import DesktopContact from './DesktopContact';

function DesktopApp({ setCurrentPage, currentPage }) {
  const { products, cart, addToCart, removeFromCart, decreaseQuantity, cartItemCount, cartTotal, submitOrder, trackOrder, fetchUserOrders, user, login, logout, register } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(() => sessionStorage.getItem('desktop_isCartOpen') === 'true');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Compute categories dynamically based on fetched products
  const CATEGORIES = useMemo(() => {
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

  // Auth States
  const [isAuthOpen, setIsAuthOpen] = useState(() => sessionStorage.getItem('desktop_isAuthOpen') === 'true');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [activeFaq, setActiveFaq] = useState(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => sessionStorage.getItem('desktop_isCheckoutOpen') === 'true');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [qrError, setQrError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('tierra_checkout_form');
    return saved ? JSON.parse(saved) : {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postcode: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('tierra_checkout_form', JSON.stringify(formData));
  }, [formData]);

  // Track Order States
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(() => sessionStorage.getItem('desktop_isTrackOrderOpen') === 'true');

  useEffect(() => { sessionStorage.setItem('desktop_isCartOpen', isCartOpen); }, [isCartOpen]);
  useEffect(() => { sessionStorage.setItem('desktop_isAuthOpen', isAuthOpen); }, [isAuthOpen]);
  useEffect(() => { sessionStorage.setItem('desktop_isCheckoutOpen', isCheckoutOpen); }, [isCheckoutOpen]);
  useEffect(() => { sessionStorage.setItem('desktop_isTrackOrderOpen', isTrackOrderOpen); }, [isTrackOrderOpen]);
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
    if (paymentMethod === 'online') {
      setIsQrModalOpen(true);
      return;
    }
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
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); window.scrollTo(0, 0); }}>Home</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('shop'); window.scrollTo(0, 0); }}>Collections</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); window.scrollTo(0, 0); }}>About</a></li>
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
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                        <label 
                          style={{
                            padding: '1rem', 
                            border: paymentMethod === 'online' ? '2px solid #82634F' : '1px solid #ccc', 
                            borderRadius: '8px', 
                            background: paymentMethod === 'online' ? '#82634F0A' : '#fff', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <input 
                            type="radio" 
                            checked={paymentMethod === 'online'} 
                            onChange={() => setPaymentMethod('online')}
                            style={{marginRight: '0.75rem', accentColor: '#82634F', width: '1.2rem', height: '1.2rem'}} 
                          /> 
                          Online Payment (UPI/QR)
                        </label>
                        <label 
                          style={{
                            padding: '1rem', 
                            border: paymentMethod === 'cod' ? '2px solid #82634F' : '1px solid #ccc', 
                            borderRadius: '8px', 
                            background: paymentMethod === 'cod' ? '#82634F0A' : '#fff', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <input 
                            type="radio" 
                            checked={paymentMethod === 'cod'} 
                            onChange={() => setPaymentMethod('cod')}
                            style={{marginRight: '0.75rem', accentColor: '#82634F', width: '1.2rem', height: '1.2rem'}} 
                          /> 
                          Cash on Delivery (COD)
                        </label>
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
          <h1>Artisan Drinkware</h1>
          <div className="hero-divider"></div>
          <p>Handcrafted terracotta mugs, cups, and bottles, designed to elevate your daily rituals.</p>
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

      {/* Offer Section */}
      <section className="desktop-offer" style={{ padding: '0 5%', marginBottom: '4rem', marginTop: '2rem' }}>
        <div style={{ backgroundColor: '#4A3B32', borderRadius: '32px', padding: '4rem 2rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(74, 59, 50, 0.15)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(/assets/desktop-hero.png)', opacity: 0.15, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem', display: 'block', fontWeight: 500, color: '#E6DEC8' }}>Exclusive Offer</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', marginBottom: '1rem', color: '#F8F6F2' }}>First Order above ₹999?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem', fontWeight: 300, color: '#EAE6DF' }}>Get ₹100 Off on your entire handcrafted purchase.</p>
            <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '14px 32px', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginRight: '16px' }}>Use Code:</span>
              <span style={{ fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '1.4rem' }}>FIRST100</span>
            </div>
          </div>
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
              <div className="w-full h-[320px] relative shrink-0">
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
                      ₹{product.regular_price}
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

      {/* Features Banner */}
      <section className="w-full bg-[#E6DEC8] py-14 my-16">
        <div className="max-w-[1000px] mx-auto px-8 flex justify-center items-center divide-x divide-[#C5BBA4]">
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <HandHeart className="w-10 h-10 text-[#5C4D3C]" strokeWidth={1.5} />
            <span className="font-serif text-[18px] text-[#5C4D3C] font-medium tracking-wide">Handcrafted</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <Leaf className="w-10 h-10 text-[#5C4D3C]" strokeWidth={1.5} />
            <span className="font-serif text-[18px] text-[#5C4D3C] font-medium tracking-wide">Eco-Friendly</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <Flower2 className="w-10 h-10 text-[#5C4D3C]" strokeWidth={1.5} />
            <span className="font-serif text-[18px] text-[#5C4D3C] font-medium tracking-wide">Timeless<br/>Tradition</span>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-[1200px] mx-auto px-8 mb-20 text-center">
        <h2 className="font-serif text-3xl text-[#263228] mb-12">Loved by Art Enthusiasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya S.", review: "The craftsmanship is simply unmatched. My terracotta vase adds such a warm, earthy feel to my living room. Best quality pottery I've ever bought." },
            { name: "Rahul M.", review: "I am amazed by the attention to detail. The drinking cups are perfectly weighted and the texture feels so authentic. Highly recommended!" },
            { name: "Anjali K.", review: "Beautiful, sustainable, and timeless. It's rare to find such dedication to traditional pottery techniques. The packaging was also completely eco-friendly." }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#EAE6DF] flex flex-col items-center text-center">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-[#C5BBA4] text-[#C5BBA4]" />)}
              </div>
              <p className="font-sans text-[14px] text-gray-600 mb-6 italic">"{testimonial.review}"</p>
              <h4 className="font-serif text-[16px] font-bold text-[#1A2E25] mt-auto">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>



      {/* Instagram Community Section */}
      <section className="max-w-[1200px] mx-auto px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-[#1A2E25] mb-3">#ClayAndCraft</h2>
          <p className="text-[#60554E]">Join our growing community of terracotta lovers on Instagram</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="aspect-square rounded-[20px] overflow-hidden group relative cursor-pointer">
            <img src="/assets/about_story.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Community 1" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">@clayandcraft</span>
            </div>
          </div>
          <div className="aspect-square rounded-[20px] overflow-hidden group relative cursor-pointer">
            <img src="/assets/sc1.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Community 2" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">@clayandcraft</span>
            </div>
          </div>
          <div className="aspect-square rounded-[20px] overflow-hidden group relative cursor-pointer">
            <img src="/assets/p11-painted-vase.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Community 3" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">@clayandcraft</span>
            </div>
          </div>
          <div className="aspect-square rounded-[20px] overflow-hidden group relative cursor-pointer">
            <img src="/assets/serve.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Community 4" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">@clayandcraft</span>
            </div>
          </div>
        </div>
      </section>
        </>
      ) : currentPage === 'shop' ? (
        <DesktopCollections initialCategory={selectedCategory || 'All'} />
      ) : currentPage === 'about' || currentPage === 'About Us' ? (
        <DesktopAbout onShopClick={() => { setCurrentPage('shop'); window.scrollTo(0, 0); }} />
      ) : currentPage === 'Contact Us' ? (
        <DesktopContact />
      ) : null}

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="premium-footer-top">
          <div className="premium-footer-newsletter">
            <h2>Join our community</h2>
            <p>Subscribe to receive updates on new collections, exclusive offers, and the stories behind our craft.</p>
            <div className="newsletter-input-group">
              <input 
                type="email" 
                placeholder="Your email address" 
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                disabled={isSubscribed}
              />
              <button
                onClick={() => {
                  if (subscribeEmail) {
                    setIsSubscribed(true);
                    setTimeout(() => {
                      setSubscribeEmail('');
                      setIsSubscribed(false);
                    }, 3000);
                  }
                }}
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
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

      {/* QR Code Payment Modal for Desktop */}
      {isQrModalOpen && (
        <div className="checkout-modal-overlay open" style={{zIndex: 1000}}>
          <div className="checkout-modal" style={{maxWidth: '400px', padding: 0, overflow: 'hidden'}}>
            <button 
              className="close-modal" 
              onClick={() => setIsQrModalOpen(false)}
              style={{background: 'rgba(255,255,255,0.2)', color: '#fff', top: '15px', right: '15px'}}
            >
              &times;
            </button>
            
            <div style={{background: '#82634F', color: '#fff', padding: '2rem 1.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.5rem', margin: '0 0 0.5rem 0'}}>Online Payment</h3>
              <p style={{margin: 0, opacity: 0.9}}>Scan the QR code below to pay</p>
              <div style={{fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem'}}>
                ₹{(cartTotal + (cartTotal >= 499 ? 0 : 99) - (isCouponApplied ? (couponCode === 'FIRST100' ? 100 : cartTotal * 0.1) : 0)).toFixed(2)}
              </div>
            </div>
            
            <form onSubmit={handleQrSubmit} style={{padding: '1.5rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', marginBottom: '1.5rem'}}>
                <div style={{width: '100%', marginBottom: '1rem', background: 'rgba(130, 99, 79, 0.1)', border: '1px solid rgba(130, 99, 79, 0.2)', color: '#82634F', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500'}}>
                  ⚠️ Please ensure the receiver name shows as <strong style={{color: '#1A2E25'}}>Mamta kumari</strong> before paying.
                </div>
                
                <div style={{marginBottom: '1rem'}}>
                  <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1A2E25', borderBottom: '1px solid #eee', paddingBottom: '0.25rem'}}>Option 1: Scan QR Code</h4>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=7209741066-2@ybl&pn=Mamta%20kumari&am=${(cartTotal + (cartTotal >= 499 ? 0 : 99) - (isCouponApplied ? (couponCode === 'FIRST100' ? 100 : cartTotal * 0.1) : 0)).toFixed(2)}&cu=INR`)}`}
                      alt="Payment QR Code" 
                      style={{width: '180px', height: '180px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '12px'}}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/assets/qrcode.jpeg';
                      }}
                    />
                  </div>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1A2E25', borderBottom: '1px solid #eee', paddingBottom: '0.25rem'}}>Option 2: Pay via UPI ID</h4>
                  <div style={{background: '#f8f6f2', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#1A2E25', border: '1px solid #eee'}}>
                    <span>7209741066-2@ybl</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        navigator.clipboard.writeText('7209741066-2@ybl');
                        const icon = e.currentTarget;
                        icon.style.color = '#0A4736';
                        setTimeout(() => icon.style.color = '#82634F', 2000);
                      }}
                      style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#82634F', transition: 'color 0.3s'}}
                      title="Copy UPI ID"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1A2E25', borderBottom: '1px solid #eee', paddingBottom: '0.25rem'}}>Option 3: Bank Transfer</h4>
                  <div style={{background: '#f8f6f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.6', color: '#1A2E25', border: '1px solid #eee'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Name:</span> <strong>Mamta kumari</strong></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>A/c No:</span> <strong>39983163990</strong></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>IFSC:</span> <strong>SBIN0014280</strong></div>
                  </div>
                </div>
              </div>
              
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label style={{fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                  Transaction ID / UTR Number <span style={{color: '#e53e3e'}}>*</span>
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
                  className="form-input"
                  style={{background: '#f8f6f2'}}
                />
                {qrError && (
                  <p style={{color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.5rem', margin: 0}}>
                    {qrError}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !utrNumber.trim()}
                className="btn-checkout"
                style={{width: '100%', opacity: (isSubmitting || !utrNumber.trim()) ? 0.6 : 1}}
              >
                {isSubmitting ? 'Verifying...' : 'Confirm Payment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesktopApp;
