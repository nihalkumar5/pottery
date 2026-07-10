import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

const MOCK_PRODUCTS = [
  { id: 1, name: 'Earthy Ceramic Vase', price: 2499.00, image: '/assets/vase.png' },
  { id: 2, name: 'Speckled Clay Bowls (Set of 2)', price: 1899.00, image: '/assets/vase.png' },
  { id: 3, name: 'Terracotta Handled Mug', price: 899.00, image: '/assets/vase.png' },
  { id: 4, name: 'Matte Charcoal Plate', price: 1199.00, image: '/assets/vase.png' }
];

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('tierra_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tierra_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tierra_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tierra_token') || null);

  // Fetch products on load
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
          image: wpProduct.images.length > 0 ? wpProduct.images[0].src : '/assets/vase.png',
          desc: wpProduct.short_description ? wpProduct.short_description.replace(/<[^>]*>?/gm, '') : 'Handcrafted ceramic piece',
          rating: wpProduct.average_rating || 5.0
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

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const decreaseQuantity = (productId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing.quantity === 1) {
        return prev.filter(item => item.id !== productId);
      }
      return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const cartItemCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);

  // Checkout API Call
  const submitOrder = async (formData) => {
    const orderData = {
      payment_method: 'cod',
      payment_method_title: 'Cash on Delivery',
      set_paid: false,
      status: 'processing',
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        country: 'IN',
        email: formData.email,
        phone: formData.phone,
      },
      line_items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity || 1
      }))
    };

    const response = await axios.post('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders', orderData, {
      params: {
        consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
        consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
      }
    });
    return response.data;
  };

  // Track Order API Call
  const trackOrder = async (orderId, email) => {
    const response = await axios.get(`https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders/${orderId}`, {
      params: {
        consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
        consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
      }
    });
    const order = response.data;
    if (order.billing.email.toLowerCase() === email.toLowerCase()) {
      return order;
    } else {
      throw new Error('Order found, but the email address does not match.');
    }
  };

  // Fetch Logged In User's Orders
  const fetchUserOrders = async (userEmail) => {
    try {
      // Use the 'search' parameter to find orders by email. 
      // This ensures we also find guest orders placed before the user created their account!
      const ordersRes = await axios.get('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/orders', {
        params: {
          search: userEmail,
          consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
          consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
        }
      });
      
      // Filter the results to make sure we only show orders where the billing email exactly matches
      const validOrders = ordersRes.data.filter(order => order.billing.email.toLowerCase() === userEmail.toLowerCase());
      
      return validOrders;
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      return [];
    }
  };

  // JWT Auth Methods
  const login = async (username, password) => {
    try {
      const response = await axios.post('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/jwt-auth/v1/token', {
        username,
        password
      });
      
      const { token, user_email, user_nicename, user_display_name } = response.data;
      
      const userData = {
        email: user_email,
        username: user_nicename,
        displayName: user_display_name
      };

      setToken(token);
      setUser(userData);
      
      localStorage.setItem('tierra_token', token);
      localStorage.setItem('tierra_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tierra_token');
    localStorage.removeItem('tierra_user');
  };

  const register = async (email, password, username) => {
    try {
      // Create user using WooCommerce Customers API (requires Consumer Keys)
      const response = await axios.post('https://lightskyblue-squirrel-970388.hostingersite.com/wp-json/wc/v3/customers', {
        email,
        password,
        username,
      }, {
        params: {
          consumer_key: import.meta.env.VITE_WC_CONSUMER_KEY,
          consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET
        }
      });
      
      // Auto-login after successful registration
      if (response.data.id) {
        await login(username, password);
        return true;
      }
    } catch (error) {
      console.error("Registration Error:", error);
      console.error("Error Response:", error.response);
      
      let errorMsg = 'Registration failed due to a network or CORS error.';
      if (error.response && error.response.data && error.response.data.message) {
        // Strip HTML tags from WordPress error messages
        errorMsg = error.response.data.message.replace(/<[^>]*>?/gm, '');
      }
      throw new Error(errorMsg);
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      setCart,
      addToCart,
      removeFromCart,
      decreaseQuantity,
      cartTotal,
      cartItemCount,
      submitOrder,
      trackOrder,
      fetchUserOrders,
      user,
      token,
      login,
      logout,
      register,
      wishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </ShopContext.Provider>
  );
};
