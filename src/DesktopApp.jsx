import { useState, useEffect } from 'react';
import { useShop } from './ShopContext';
import { ArrowRight, Heart, Plus, ShoppingBag } from 'lucide-react';

function DesktopApp() {
  const { products, cart, addToCart, removeFromCart, cartTotal, submitOrder, trackOrder, fetchUserOrders, user, login, logout, register } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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
        <div className="logo" style={{ textTransform: 'none', fontWeight: 300, letterSpacing: '0.05em', fontSize: '1.5rem' }}>
          Clay & Craft
        </div>
        <ul className="nav-links">
          <li><a href="#shop">Shop</a></li>
          <li><a href="#collections">Collections</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); user ? setIsAuthOpen(true) : openTrackOrder(); }}>Track Order</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setIsAuthOpen(true); }}>{user ? 'My Account' : 'Sign In'}</a></li>
        </ul>
        <div className="cart-icon" onClick={toggleCart}>
          Cart ({cart.length})
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
                  <button className="remove-item" onClick={() => removeFromCart(idx)}>Remove</button>
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
                <h2>Complete Your Order</h2>
                <p>Total: ₹{cartTotal.toFixed(2)}</p>
              </div>
              <form onSubmit={handleCheckoutSubmit}>
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
                <button type="submit" className="btn-checkout" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                </button>
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
          <h1>Timeless<br/>Tradition</h1>
          <div className="hero-divider"></div>
          <p>Handcrafted clay pieces,<br/>rooted in culture,<br/>made for today.</p>
          <button className="btn-primary" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Collection <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Products Section */}
      <section className="products-section" id="shop">
        <div className="section-header">
          <h2>Featured Pieces</h2>
          <a href="#shop" style={{color: 'var(--color-accent)', textDecoration: 'none'}}>View All</a>
        </div>
        <div className="product-grid">
          {products.map(product => (
            <div 
              key={product.id} 
              className="cursor-pointer group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow pb-5"
            >
              <div className="w-full aspect-[4/5] relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="px-5 pt-4 flex flex-col gap-1.5">
                <h4 className="font-serif text-[18px] font-bold text-[#1A2E25] leading-snug truncate">{product.name}</h4>
                <p className="font-sans text-[13px] text-gray-500">Handcrafted ceramic piece</p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[17px] font-bold text-[#1A2E25]">
                      ₹{product.price}
                    </span>
                    <span className="font-sans text-[13px] text-gray-400 line-through">
                      ₹{Math.round(product.price * 1.2)}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="bg-[#0A4736] text-white p-2.5 rounded-full hover:bg-[#073326] transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
              <h3>Shop</h3>
              <ul>
                <li><a href="#">All Collections</a></li>
                <li><a href="#">Tableware</a></li>
                <li><a href="#">Vases</a></li>
                <li><a href="#">Gifts</a></li>
              </ul>
            </div>
            <div className="premium-footer-links">
              <h3>Support</h3>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); user ? setIsAuthOpen(true) : openTrackOrder(); }}>Track Order</a></li>
                <li><a href="#">Shipping & Returns</a></li>
                <li><a href="#">Care Guide</a></li>
                <li><a href="#">Contact Us</a></li>
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
