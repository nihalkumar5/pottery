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
  { id: 1, name: 'Brick Pattern Terracotta Mug', category: 'Drinkware', price: 599.00, description: 'Handcrafted terracotta mug featuring a signature brick-textured design. Perfect for tea, coffee, and hot beverages while adding a rustic touch to your table.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p1-brick-mug.png' },
  { id: 2, name: 'Heritage Tall Coffee Mug', category: 'Drinkware', price: 699.00, description: 'A tall handcrafted terracotta mug with textured detailing and a glazed rim, designed for coffee lovers who appreciate artisan craftsmanship.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p2-tall-coffee-mug.png' },
  { id: 3, name: 'Terracotta Goblet Cup', category: 'Drinkware', price: 699.00, description: 'Elegant handcrafted goblet inspired by traditional Indian pottery. Suitable for serving tea, coffee, lassi, and festive beverages.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p3-goblet-cup.png' },
  { id: 4, name: 'Artisan Clay Glass', category: 'Drinkware', price: 399.00, description: 'Minimal handcrafted clay tumbler for water, juice, chaas, and traditional drinks.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p4-clay-glass.png' },
  { id: 5, name: 'Hand-Painted Terracotta Water Bottle', category: 'Water Bottles', price: 999.00, description: 'Beautiful hand-painted terracotta bottle designed for naturally cool drinking water while adding artistic charm.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p5-painted-bottle.png' },
  { id: 6, name: 'Leaf Carved Terracotta Bottle', category: 'Water Bottles', price: 899.00, description: 'Handmade engraved clay bottle featuring elegant leaf carvings and natural cooling properties.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p6-leaf-bottle.png' },
  { id: 7, name: 'Classic Terracotta Bottle', category: 'Water Bottles', price: 699.00, description: 'Minimal handcrafted earthen bottle designed for everyday hydration with natural cooling.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p7-classic-bottle.png' },
  { id: 8, name: 'Hand-Painted Water Dispenser', category: 'Water Storage', price: 2999.00, description: 'Traditional hand-painted terracotta water dispenser with tap, combining artisan craftsmanship and functional design.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p8-water-dispenser.png' },
  { id: 9, name: 'Heritage Terracotta Jug', category: 'Serveware', price: 1199.00, description: 'Rustic handcrafted clay jug for serving water, lemonade, chaas, and other beverages.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly', 'Reusable'], image: '/assets/p9-terracotta-jug.png' },
  { id: 14, name: 'Heritage Terracotta Drinkware (325g)', category: 'Drinkware', price: 249.00, description: 'Experience the essence of tradition with this heavyweight artisan drinkware. Perfectly crafted for a premium earthy feel.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p4-clay-glass.png' },
  { id: 15, name: 'Artisan Brick Pattern Mug', category: 'Drinkware', price: 199.00, description: 'A beautifully textured brick pattern mug. Lightweight at 225g and perfect for your daily coffee or tea ritual.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p1-brick-mug.png' },
  { id: 16, name: 'Rustic Tombol Coffee Mug', category: 'Drinkware', price: 229.00, description: 'Start your morning right with this earthy Tombol textured coffee mug. Elegantly crafted for comfort and style.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p2-tall-coffee-mug.png' },
  { id: 17, name: 'Classic Earthen Tea Cup Set (6 pcs)', category: 'Drinkware', price: 249.00, description: 'A complete set of 6 traditional terracotta tea cups. Perfect for hosting and serving authentic chai.', features: ['Handmade', 'Set of 6', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p3-goblet-cup.png' },
  { id: 18, name: 'Premium Terracotta Chai Set (6 pcs)', category: 'Drinkware', price: 249.00, description: 'Elevate your tea time with this premium set of 6 handcrafted cups. Smooth finish with a timeless appeal.', features: ['Handmade', 'Set of 6', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p3-goblet-cup.png' },
  { id: 19, name: 'Textured Brick Tea Cup Set (6 pcs)', category: 'Drinkware', price: 249.00, description: 'A stunning set of 6 tea cups featuring our signature brick texture for an enhanced grip and rustic charm.', features: ['Handmade', 'Set of 6', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p1-brick-mug.png' },
  { id: 20, name: 'Minimalist Terracotta Tea Set (6 pcs)', category: 'Drinkware', price: 249.00, description: 'Clean lines and a minimalist profile define this 6-piece tea cup set. Modern design meets ancient craft.', features: ['Handmade', 'Set of 6', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p3-goblet-cup.png' },
  { id: 21, name: 'Modern Earthen Tea Cups (6 pcs)', category: 'Drinkware', price: 249.00, description: 'A beautifully balanced 6-piece tea cup set designed for everyday elegance and a natural sip.', features: ['Handmade', 'Set of 6', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p3-goblet-cup.png' },
  { id: 22, name: 'Natural Cooling Terracotta Bottle', category: 'Water Bottles', price: 179.00, description: 'Stay hydrated naturally. This earthen bottle naturally cools your water while infusing it with earth\'s minerals.', features: ['Handmade', 'Food Safe', 'Natural Clay', 'Eco-Friendly'], image: '/assets/p7-classic-bottle.png' }
];

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tierra_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tierra_cart', JSON.stringify(cart));
  }, [cart]);
  
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
            consumer_secret: import.meta.env.VITE_WC_CONSUMER_SECRET,
            per_page: 100,
            _ts: Date.now()   // cache-buster: forces fresh data every load
          },
          headers: {
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache'
          }
        });
        const fetchedProducts = response.data.map(wpProduct => ({
          id: wpProduct.id,
          name: wpProduct.name,
          price: parseFloat(wpProduct.price || 0),
          regular_price: parseFloat(wpProduct.regular_price) || parseFloat(wpProduct.price || 0),
          image: wpProduct.images.length > 0 ? wpProduct.images[0].src : (
            wpProduct.name.includes('Drinkware') ? '/assets/p4-clay-glass.png' :
            wpProduct.name.includes('Surahi') ? '/assets/sc2.png' :
            wpProduct.name.includes('Bell') ? '/assets/sc2.png' :
            wpProduct.name.includes('Jug') ? '/assets/serb.png' :
            wpProduct.name.includes('Brick') ? '/assets/p1-brick-mug.png' :
            wpProduct.name.includes('Tombol') ? '/assets/p2-tall-coffee-mug.png' :
            wpProduct.name.includes('Tea Cup') || wpProduct.name.includes('Chai Set') || wpProduct.name.includes('Tea Cups') ? '/assets/drink.png' :
            wpProduct.name.includes('Bottle') ? '/assets/waterbottle.png' :
            '/assets/vase.png'
          ),
          images: wpProduct.images.length > 0 ? wpProduct.images.map(img => img.src) : ['/assets/vase.png'],
          description: wpProduct.short_description ? wpProduct.short_description.replace(/<[^>]*>?/gm, '') : (wpProduct.description ? wpProduct.description.replace(/<[^>]*>?/gm, '') : 'Handcrafted ceramic piece'),
          rating: wpProduct.average_rating || 5.0,
          category: wpProduct.categories && wpProduct.categories.length > 0 ? wpProduct.categories[0].name : 'Uncategorized'
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
