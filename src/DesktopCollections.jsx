import React, { useState } from 'react';
import { useShop } from './ShopContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function DesktopCollections({ initialCategory = 'All' }) {
  const { products, cartItemCount, addToCart } = useShop();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  React.useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const CATEGORIES = React.useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.category).filter(Boolean))].filter(c => c !== 'Glasses & Tumblers' && c !== 'Glasses &amp; Tumblers');
    return ['All', ...uniqueCats];
  }, [products]);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="desktop-collections-page bg-[#F8F6F2]">
      
      {/* Minimal Hero Section with Image */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img 
          src="/hero-banner.png" 
          alt="Our Collections" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-5xl text-white mb-4 tracking-wide mt-16">Our Collections</h1>
          <p className="text-white/90 font-medium tracking-widest uppercase text-sm">Explore our handcrafted, sustainable clay pieces</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-16">
        <div className="grid grid-cols-[240px_1fr] gap-16 items-start">
          
          {/* Sidebar Navigation (Sticky) */}
          <aside className="sticky top-[120px]">
            <h3 className="font-serif text-xl text-[#263228] mb-6 border-b border-[#D1C8BA] pb-4">Categories</h3>
            <ul className="flex flex-col gap-4 pl-0 list-none">
              {CATEGORIES.map(cat => (
                <li key={cat} className="list-none">
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-sm uppercase tracking-widest transition-all duration-300 border-none outline-none bg-transparent m-0 p-0
                      ${selectedCategory === cat 
                        ? 'font-bold text-[#1A2E25]' 
                        : 'font-medium text-[#82634F] hover:text-[#1A2E25]'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Product Grid */}
          <main>
            <div className="flex justify-between items-end mb-8 border-b border-[#D1C8BA] pb-4">
              <h2 className="font-serif text-3xl text-[#263228]">{selectedCategory === 'All' ? 'All Pieces' : selectedCategory}</h2>
              <span className="text-[#82634F] text-sm uppercase tracking-widest">{filteredProducts.length} Products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {filteredProducts.map(product => (
                <div key={product.id} className="collection-product-card group cursor-pointer">
                  <div className="product-image-wrapper relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-white/50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#263228] px-6 py-3 rounded-full text-sm font-semibold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg whitespace-nowrap hover:bg-[#263228] hover:text-white"
                    >
                      Add to Cart - ₹{product.price}
                    </button>
                  </div>
                  <div className="product-info flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-[#82634F]/70">{product.category}</span>
                    <h3 className="font-serif text-xl text-[#263228] leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#82634F]">₹{product.price.toFixed(2)}</span>
                      {product.regular_price > product.price && (
                        <span className="text-[#A3968B] line-through text-[0.85em] font-normal">
                          ₹{product.regular_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-serif text-[#263228] mb-2">No products found</h3>
                <p className="text-[#82634F]">Check back later for new arrivals in this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
