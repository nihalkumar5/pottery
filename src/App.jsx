import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Earthy Ceramic Vase', price: 2499.00, image: '/assets/vase.png' },
  { id: 2, name: 'Speckled Clay Bowls (Set of 2)', price: 1899.00, image: '/assets/bowls.png' },
  { id: 3, name: 'Terracotta Handled Mug', price: 899.00, image: '/assets/vase.png' },
  { id: 4, name: 'Matte Charcoal Plate', price: 1199.00, image: '/assets/bowls.png' }
];

function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/products', {
          params: {
            consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
            consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
          }
        });
        const fetchedProducts = response.data.map(wpProduct => ({
          id: wpProduct.id,
          name: wpProduct.name,
          price: parseFloat(wpProduct.price || 0),
          image: wpProduct.images.length > 0 ? wpProduct.images[0].src : '/assets/vase.png'
        }));
        
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.log("WooCommerce API fetch failed, using mock data.");
      }
    };
    fetchProducts();
  }, []);

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

    const orderData = {
      payment_method: 'cod',
      payment_method_title: 'Cash on Delivery',
      set_paid: false,
      status: 'processing', // This forces the order to show up in the "Orders awaiting processing" widget!
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        country: 'IN',
        email: formData.email,
      },
      line_items: cart.map(item => ({
        product_id: item.id,
        quantity: 1
      }))
    };

    try {
      const response = await axios.post('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders', orderData, {
        params: {
          consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
          consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
        }
      });
      console.log('Order created:', response.data);
      setOrderSuccess(true);
      setCart([]); // Empty cart on success
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error);
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to place order: ' + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

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
      const response = await axios.get(`https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders/${trackOrderId}`, {
        params: {
          consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
          consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
        }
      });
      
      const order = response.data;
      if (order.billing.email.toLowerCase() === trackOrderEmail.toLowerCase()) {
        setTrackResult(order);
      } else {
        setTrackError('Order found, but the email address does not match.');
      }
    } catch (error) {
      setTrackError('Order not found. Please check your Order ID.');
    } finally {
      setIsTrackLoading(false);
    }
  };

  return (
    <>
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
              <span>₹{cartTotal}</span>
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
                <p>Total: ₹{cartTotal}</p>
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

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <a href="#" className="bottom-nav-item active" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}) }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </a>
        <a href="#shop" className="bottom-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Shop</span>
        </a>
        <a href="#" className="bottom-nav-item" onClick={(e) => { e.preventDefault(); openTrackOrder(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Track</span>
        </a>
        <div className="bottom-nav-item" style={{position:'relative'}} onClick={toggleCart}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Cart</span>
          {cart.length > 0 && <span className="cart-badge-nav">{cart.length}</span>}
        </div>
      </nav>
    </>
  );
}

export default App;
