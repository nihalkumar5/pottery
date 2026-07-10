import React from 'react';
import { ArrowLeft } from 'lucide-react';

const policies = {
  'About Us': `Welcome to Clay & Craft.\n\nWe are dedicated to preserving the art of traditional pottery and bringing handcrafted elegance to your modern home. Every piece in our collection is carefully molded by skilled artisans who have inherited this craft through generations.\n\nOur mission is to celebrate natural materials, sustainable practices, and timeless design. Thank you for supporting authentic craftsmanship.`,
  'Privacy Policy': `We respect your privacy and are committed to protecting your personal data.\n\nInformation We Collect:\n- Personal details (name, email, shipping address) when you place an order.\n- Payment details (processed securely via our payment partners).\n- Usage data to improve our website experience.\n\nHow We Use Your Information:\n- To process and fulfill your orders.\n- To send you updates about your order status.\n- To communicate promotional offers (only if you opt-in).\n\nWe do not sell or share your personal information with third parties for marketing purposes.`,
  'Terms And Conditions': `By accessing and using our website, you accept and agree to be bound by these terms.\n\n- All products are handcrafted; minor variations in size, color, and texture are natural and part of the artisan charm.\n- Prices are subject to change without notice.\n- We reserve the right to refuse service to anyone for any reason.\n- You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.`,
  'Refund And Cancellation': `We offer a 7-day return policy for unused items in their original condition.\n\nReturns:\n- Items must be unused and in the same condition that you received them.\n- They must also be in the original packaging.\n- To initiate a return, please contact our support team within 7 days of delivery.\n\nRefunds:\n- Once your return is received and inspected, we will notify you of the approval or rejection of your refund.\n- Approved refunds will be processed automatically to your original method of payment within 5-7 business days.\n\nCancellations:\n- Orders can be cancelled within 24 hours of placement. Once shipped, orders cannot be cancelled.`,
  'Shipping And Delivery': `All orders are processed within 2-3 business days.\n\nShipping Rates:\n- Standard Shipping: ₹99 (Free on orders over ₹999)\n- Express Shipping: Available at checkout\n\nDelivery Time:\n- Metros: 3-5 business days\n- Non-Metros: 5-7 business days\n\nPlease note that delivery times may be affected by public holidays or unforeseen circumstances.`,
  'Contact Us': `We'd love to hear from you!\n\nEmail: support@clayandcraft.in\nPhone: +91 9876543210\n\nAddress:\nClay & Craft Studios\n123 Pottery Lane,\nCraftsmen Valley, 400001\nIndia\n\nBusiness Hours:\nMonday - Saturday: 10:00 AM - 6:00 PM (IST)`
};

export default function PolicyPage({ page, onBack, isMobile }) {
  const content = policies[page] || 'Page not found.';

  return (
    <div className={`min-h-screen bg-[#F8F6F2] ${isMobile ? 'pt-6 px-4 pb-12' : 'pt-20 px-20 pb-20'}`}>
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#82634F] hover:text-[#6A4E3D] transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Shop
        </button>

        <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-serif text-[#263228] mb-8 leading-tight`}>
          {page}
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E8E2D8]">
          <p className="text-[#5A544D] font-sans leading-relaxed whitespace-pre-line text-[15px] sm:text-[17px]">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
