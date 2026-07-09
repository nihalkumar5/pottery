import { useState } from 'react';
import { useShop } from './ShopContext';

function DesktopApp() {
  const { products, cart, addToCart, removeFromCart, cartTotal, submitOrder, trackOrder } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);

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

  return (
    <div className="desktop-root">
      <nav className="navbar">
        <div className="logo">TIERRA</div>
        <ul className="nav-links">
          <li><a href="#shop">Shop</a></li>
          <li><a href="#collections">Collections</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); openTrackOrder(); }}>Track Order</a></li>
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
              <p>Thank you for shopping with Tierra. We will prepare your handcrafted ceramics shortly.</p>
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

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Formed by Earth.<br/>Finished by Hand.</h1>
          <p>Discover our new collection of minimalist, handcrafted ceramics designed to elevate your everyday rituals.</p>
          <button className="btn-primary">Shop the Collection</button>
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
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  Add to Cart — ₹{product.price.toFixed(2)}
                </button>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">₹{product.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h3>TIERRA</h3>
            <p>Earthy, premium pottery crafted with intention.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#">All Products</a></li>
              <li><a href="#">Vases</a></li>
              <li><a href="#">Tableware</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Pottery Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default DesktopApp;
