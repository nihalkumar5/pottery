import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';

export default function DesktopContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] overflow-hidden">
        <img src="/assets/contact_hero.png" alt="Artisan desk with letter and coffee" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-8 mt-16">
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6 font-light tracking-wide">Get in Touch</h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/90 max-w-xl">We'd love to hear from you. Whether you have a question about our pieces, custom orders, or just want to say hello.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-8 py-24 flex flex-col md:flex-row gap-16">
        
        <div className="flex-1 space-y-12 pr-8">
          <div>
            <h2 className="font-serif text-3xl text-[#263228] mb-6">Our Studio</h2>
            <p className="font-sans text-[16px] text-gray-600 leading-relaxed">
              We are a dedicated craft store located in the heart of Giridih, Jharkhand. We welcome visitors to explore our timeless terracotta collections.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#5C4D3C] mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h4 className="font-serif text-[18px] text-[#263228] mb-1">Address</h4>
                <p className="font-sans text-[15px] text-gray-600">BBC Rd, Jai Prakash Nagar<br/>Giridih, Jharkhand 815301</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#5C4D3C] mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h4 className="font-serif text-[18px] text-[#263228] mb-1">Email</h4>
                <p className="font-sans text-[15px] text-gray-600">hello@clayandcraft.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#5C4D3C] mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h4 className="font-serif text-[18px] text-[#263228] mb-1">Phone</h4>
                <p className="font-sans text-[15px] text-gray-600">084094 04599</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-[#5C4D3C] mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h4 className="font-serif text-[18px] text-[#263228] mb-1">Business Hours</h4>
                <p className="font-sans text-[15px] text-gray-600">Mon-Sun: 9:00 am onwards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Minimal Form */}
        <div className="flex-1 bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-[#EAE6DF]">
          <h3 className="font-serif text-3xl text-[#263228] mb-8">Send a Message</h3>
          
          {submitted ? (
            <div className="bg-[#E6DEC8]/50 p-6 rounded-2xl text-center border border-[#C5BBA4]/30">
              <h4 className="font-serif text-xl text-[#263228] mb-2">Thank You!</h4>
              <p className="text-[#5C4D3C] text-sm">Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[#D1C8BA] py-2 px-1 outline-none focus:border-[#1A2E25] transition-colors text-[#263228] text-[15px]" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[#D1C8BA] py-2 px-1 outline-none focus:border-[#1A2E25] transition-colors text-[#263228] text-[15px]" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#D1C8BA] py-2 px-1 outline-none focus:border-[#1A2E25] transition-colors text-[#263228] text-[15px]" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#D1C8BA] py-2 px-1 outline-none focus:border-[#1A2E25] transition-colors text-[#263228] text-[15px] resize-none" 
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="inline-flex items-center gap-2 bg-[#1A2E25] text-white px-8 py-3 rounded-full font-medium hover:bg-[#263228] transition-colors mt-4"
              >
                Send Message <Send size={16} strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
