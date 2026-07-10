import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function DesktopAbout({ onShopClick }) {
  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[550px] overflow-hidden">
        <img src="/assets/about_hero.png" alt="Artisan shaping clay" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-8 pt-20">
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6 font-light leading-tight">Rooted in Earth,<br/>Crafted with Soul.</h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/90 max-w-2xl">Every piece of Clay & Craft tells a story. From the wet clay to the final glaze, we believe in the beauty of imperfection and the warmth of handmade art.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <img src="/assets/about_story.png" alt="Raw terracotta waiting for the kiln" className="w-full h-[400px] md:h-[600px] object-cover rounded-2xl shadow-md" />
          </div>
          <div className="flex-1 md:pr-12 mt-8 md:mt-0">
            <h2 className="font-serif text-3xl md:text-4xl text-[#263228] mb-6">Our Journey</h2>
            <p className="font-sans text-[16px] text-gray-600 mb-6 leading-relaxed">It started with a simple wheel and a love for the tactile nature of clay. We wanted to bring the organic, grounding feeling of earth back into the modern home. What began in a small backyard studio has blossomed into a collective of passionate artisans.</p>
            <p className="font-sans text-[16px] text-gray-600 leading-relaxed">We honor traditional techniques while embracing contemporary aesthetics. We don't believe in mass production. Instead, we pour our heart into small batches, ensuring every single mug, bowl, and vase carries a distinct fingerprint of its maker.</p>
          </div>
        </div>
      </section>

      {/* The Studio */}
      <section className="bg-[#E6DEC8] py-24">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1 w-full">
            <img src="/assets/about_studio.png" alt="Our sunlit pottery studio" className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-md" />
          </div>
          <div className="flex-1 md:pl-12 mt-8 md:mt-0">
            <h2 className="font-serif text-4xl text-[#5C4D3C] mb-6">Inside the Studio</h2>
            <p className="font-sans text-[16px] text-[#5C4D3C] mb-6 leading-relaxed">Our studio is a place of quiet focus and joyful creation. Filled with natural light and the scent of damp earth, it's where raw materials transform into functional art.</p>
            <p className="font-sans text-[16px] text-[#5C4D3C] leading-relaxed">We source our clay locally and mix our glazes by hand. The slow pace of the wheel and the heat of the kiln dictate our schedule. It's a messy, beautiful process that we wouldn't trade for anything.</p>
          </div>
        </div>
      </section>

      {/* Values & Sustainability */}
      <section className="bg-[#F8F6F2] py-24">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col items-center text-center">
          <h2 className="font-serif text-4xl text-[#263228] mb-12">Commitment to the Earth</h2>
          <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg mb-12">
            <img src="/assets/about_values.png" alt="Eco-friendly packaging" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-3xl">
            <p className="font-sans text-[16px] text-gray-600 leading-relaxed">Because our medium comes directly from the earth, we feel a deep responsibility to protect it. Our kilns are energy-efficient, our water is recycled, and our packaging is 100% plastic-free, using biodegradable kraft paper and natural jute.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#E6DEC8] py-24">
        <div className="max-w-[800px] mx-auto px-8 text-center text-[#263228]">
          <h2 className="font-serif text-4xl mb-6">Bring the Earth Home</h2>
          <p className="font-sans text-[16px] text-[#5C4D3C] mb-10">Explore our latest collection of handcrafted ceramics and find the perfect piece for your daily rituals.</p>
          <button 
            onClick={onShopClick}
            className="inline-flex items-center gap-2 bg-[#1A2E25] text-white px-8 py-4 rounded-full font-bold hover:bg-[#263228] transition-colors"
          >
            Shop the Collection <ArrowRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </section>
    </div>
  );
}
