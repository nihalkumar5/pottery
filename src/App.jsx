import { useState, useEffect } from 'react';
import axios from 'axios';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Mate Plate', price: 80, image: '/assets/vase.png' },
  { id: 2, name: 'Temmoku', price: 80, image: '/assets/vase.png' },
  { id: 3, name: 'Calico', price: 80, image: '/assets/vase.png' },
  { id: 4, name: 'Tonmoi', price: 80, image: '/assets/vase.png' }
];

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  
  // Modals & Overlays
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  
  // Forms
  const [formData, setFormData] = useState({ firstName:'', lastName:'', email:'', address:'', city:'', postcode:'' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Track
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackOrderEmail, setTrackOrderEmail] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/products', {
          params: {
            consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
            consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
          }
        });
        const fetchedProducts = response.data.map(p => ({
          id: p.id, name: p.name, price: parseFloat(p.price || 0), 
          image: p.images.length > 0 ? p.images[0].src : '/assets/vase.png',
          description: p.description ? p.description.replace(/<[^>]+>/g, '') : 'Dinnerware plates keeps heat and all valuable properties of product.'
        }));
        if (fetchedProducts.length > 0) setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart]; newCart.splice(index, 1); setCart(newCart);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    const orderData = {
      payment_method: 'cod', payment_method_title: 'Cash on Delivery', set_paid: false, status: 'processing',
      billing: { first_name: formData.firstName, last_name: formData.lastName, address_1: formData.address, city: formData.city, postcode: formData.postcode, country: 'IN', email: formData.email },
      line_items: cart.map(item => ({ product_id: item.id, quantity: 1 }))
    };
    try {
      await axios.post('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders', orderData, {
        params: { consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY, consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET }
      });
      setOrderSuccess(true); setCart([]);
    } catch (error) {
      alert("Failed to place order.");
    } finally { setIsSubmitting(false); }
  };

  const handleTrackOrderSubmit = async (e) => {
    e.preventDefault(); setIsTrackLoading(true); setTrackResult(null);
    try {
      const response = await axios.get(`https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders/${trackOrderId}`, {
        params: { consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY, consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET }
      });
      const order = response.data;
      if (order.billing.email.toLowerCase() === trackOrderEmail.toLowerCase()) setTrackResult(order);
      else alert('Order found, but the email address does not match.');
    } catch (error) {
      alert('Order not found. Please check your Order ID.');
    } finally { setIsTrackLoading(false); }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  // Reusable Icons
  const MenuIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h8" /></svg>;
  const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
  const CartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
  const HeartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
  const BackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
  const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

  return (
    <>
      {/* SCREEN 1: SPLASH */}
      {currentScreen === 'splash' && (
        <div className="splash-screen">
          <div className="app-header">
            <div onClick={() => setIsTrackOrderOpen(true)}><MenuIcon /></div>
            <UserIcon />
          </div>
          <div className="splash-top-wave">
            <h1>Shape Inspired</h1>
            <p>by nature</p>
          </div>
          <div className="splash-bottom">
            <button className="btn-pill" onClick={() => setCurrentScreen('shop')}>START SHOP</button>
          </div>
        </div>
      )}

      {/* SCREEN 2: SHOP CATALOG */}
      {currentScreen === 'shop' && (
        <div className="shop-screen">
          <div className="app-header">
            <div onClick={() => setCurrentScreen('splash')}><MenuIcon /></div>
            <div style={{position:'relative'}} onClick={() => setIsCartOpen(true)}>
              <CartIcon />
              {cart.length > 0 && <span style={{position:'absolute', top:'-5px', right:'-5px', background:'red', color:'white', borderRadius:'50%', width:'16px', height:'16px', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>{cart.length}</span>}
            </div>
          </div>
          
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search" />
          </div>

          <div className="category-tabs">
            <div className="tab active">Mate Plate</div>
            <div className="tab">Glossy Cup</div>
            <div className="tab">Organic Ceramic</div>
          </div>

          <div className="grid">
            {products.map(product => (
              <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                <div className="card-img-wrap">
                  <img src={product.image} alt={product.name} />
                  <div className="heart-icon"><HeartIcon /></div>
                </div>
                <div className="card-info">
                  <h3>{product.name}</h3>
                  <span className="price">₹{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 3: PRODUCT DETAIL (Slides up/in) */}
      <div className={`product-detail-view ${selectedProduct ? 'open' : ''}`}>
        {selectedProduct && (
          <>
            <div className="detail-img-area">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <div className="detail-header">
                <button className="icon-btn" onClick={() => setSelectedProduct(null)}><BackIcon /></button>
                <button className="icon-btn"><HeartIcon /></button>
              </div>
            </div>
            <div className="detail-content">
              <div>
                <h1 className="detail-title">{selectedProduct.name}</h1>
                <p className="detail-category">Mate Plate</p>
                <div className="swatches">
                  <span>Colors</span>
                  <div className="swatch active" style={{background: '#F9F8F6'}}></div>
                  <div className="swatch" style={{background: '#E6D5C3'}}></div>
                  <div className="swatch" style={{background: '#8F8B88'}}></div>
                  <div className="swatch" style={{background: '#7B808F'}}></div>
                </div>
                <p className="detail-desc">{selectedProduct.description || 'Dinnerware plates keeps heat and all valuable properties of product.'}</p>
              </div>
              <div className="detail-bottom">
                <span className="detail-price">₹{selectedProduct.price}</span>
                <button className="btn-add" onClick={() => addToCart(selectedProduct)}>ADD TO CARD</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL: CART */}
      <div className={`slide-up-modal ${isCartOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => setIsCartOpen(false)}>&times;</button>
          <h2 className="modal-title">Your Cart</h2>
          {cart.length === 0 ? <p>Your cart is empty.</p> : (
            <>
              {cart.map((item, i) => (
                <div key={i} className="cart-item">
                  <img src={item.image} className="cart-item-img" alt={item.name}/>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>₹{item.price.toFixed(2)}</p>
                    <button className="cart-remove" onClick={() => removeFromCart(i)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <button className="btn-block" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>Proceed to Checkout</button>
            </>
          )}
        </div>
      </div>

      {/* MODAL: CHECKOUT */}
      <div className={`slide-up-modal ${isCheckoutOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => {setIsCheckoutOpen(false); setOrderSuccess(false);}}>&times;</button>
          {orderSuccess ? (
            <div className="order-success">
              <h2 className="modal-title" style={{color:'#8B5A2B'}}>Order Placed!</h2>
              <p>Your beautiful pottery is on its way. Track it anytime via the menu.</p>
            </div>
          ) : (
            <>
              <h2 className="modal-title">Checkout</h2>
              <form onSubmit={handleCheckoutSubmit}>
                <input type="text" className="form-input" placeholder="First Name" required name="firstName" onChange={e=>setFormData({...formData, firstName: e.target.value})} />
                <input type="email" className="form-input" placeholder="Email Address" required name="email" onChange={e=>setFormData({...formData, email: e.target.value})} />
                <input type="text" className="form-input" placeholder="Shipping Address" required name="address" onChange={e=>setFormData({...formData, address: e.target.value})} />
                <input type="text" className="form-input" placeholder="City" required name="city" onChange={e=>setFormData({...formData, city: e.target.value})} />
                <button type="submit" className="btn-block" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : `Place Order (₹${cartTotal})`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* MODAL: TRACK ORDER */}
      <div className={`slide-up-modal ${isTrackOrderOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => {setIsTrackOrderOpen(false); setTrackResult(null);}}>&times;</button>
          <h2 className="modal-title">Track Order</h2>
          <form onSubmit={handleTrackOrderSubmit}>
            <input type="text" className="form-input" placeholder="Order ID" required value={trackOrderId} onChange={e=>setTrackOrderId(e.target.value)} />
            <input type="email" className="form-input" placeholder="Email Address" required value={trackOrderEmail} onChange={e=>setTrackOrderEmail(e.target.value)} />
            <button type="submit" className="btn-block" disabled={isTrackLoading}>
              {isTrackLoading ? 'Searching...' : 'Track'}
            </button>
          </form>
          {trackResult && (
            <div className="track-result">
              <h4 style={{marginBottom: '0.5rem'}}>Order #{trackResult.id}</h4>
              <p>Placed: {new Date(trackResult.date_created).toLocaleDateString()}</p>
              <div className={`track-badge status-${trackResult.status}`}>Status: {trackResult.status}</div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}

export default App;
