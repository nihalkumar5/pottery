import React, { useState } from 'react';
import { useShop } from './ShopContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function DesktopCollections({ onBack }) {
  const { products, cartItemCount, addToCart } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    'All',
    'Drinkware',
    'Water Bottles',
    'Water Storage',
    'Serveware',
    'Home Decor',
    'Planters',
    'Cookware',
    'Dinnerware'
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="desktop-collections-page min-h-screen bg-[#F8F6F2]">
      {/* Header */}
      <header className="collections-header pt-10 px-12">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#82634F] hover:text-[#6A4E3D] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          
          <h1 className="font-serif text-4xl text-[#263228]">Our Collections</h1>
          
          <div className="flex items-center gap-2 text-[#82634F]">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Cart ({cartItemCount})</span>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="category-nav-wrapper overflow-x-auto pb-4 mb-8 border-b border-[#E8E2D8]">
          <div className="flex gap-8 min-w-max">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pb-4 px-2 text-sm uppercase tracking-wider font-semibold transition-colors relative
                  ${selectedCategory === cat ? 'text-[#263228]' : 'text-[#82634F]/60 hover:text-[#82634F]'}`}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#263228]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="px-12 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
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
                <span className="font-medium text-[#82634F]">₹{product.price.toFixed(2)}</span>
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
  );
}
