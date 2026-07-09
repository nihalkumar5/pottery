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
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

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
      },
      line_items: cart.map(item => ({
        product_id: item.id,
        quantity: 1
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

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      setCart,
      addToCart,
      removeFromCart,
      cartTotal,
      submitOrder,
      trackOrder
    }}>
      {children}
    </ShopContext.Provider>
  );
};
