import React from 'react';
import { Instagram, Linkedin, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cream text-black border-t border-black/10 relative z-10 pt-20 pb-10">
      
      {/* Top Section: Branding & Slogan */}
      <div className="max-w-[1440px] mx-auto px-6 mb-20 border-b border-black/10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                  <span className="block text-teal text-sm font-bold uppercase tracking-[0.3em] mb-6">StayOs • Premium Rental Operating System</span>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tighter mb-8">
                      StayOs<span className="text-teal">.</span>
                  </h2>
                  <p className="text-lg md:text-2xl font-serif italic text-black/60 max-w-2xl leading-relaxed">
                      "Why rent a room when you can subscribe to a lifestyle? Fully furnished homes, automated management, and zero brokerage."
                  </p>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end">
                  <div className="border border-black/20 p-8 w-full max-w-sm hover:bg-clay hover:text-white transition-colors group cursor-pointer bg-white">
                      <h3 className="text-2xl font-serif mb-2">Property Owners</h3>
                      <p className="text-sm opacity-60 mb-6 group-hover:opacity-100">Maximize rental yield with our management OS. List your property today.</p>
                      <div className="flex justify-between items-center border-t border-current pt-4">
                          <span className="text-xs font-bold uppercase tracking-widest">Partner With Us</span>
                          <ArrowUpRight size={16} />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Middle Section: Links Grid (Newspaper Columns) */}
      <div className="max-w-[1440px] mx-auto px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-l border-black/10">
              
              {/* Column 1 - Core Pages */}
              <div className="pl-8 border-r border-black/10 min-h-[200px]">
                  <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-black/40">Explore</h4>
                  <ul className="space-y-4">
                      <li><Link to="/listings" className="hover:text-teal font-serif text-xl transition-colors">Browse Listings</Link></li>
                      <li><Link to="/operating-system" className="hover:text-teal font-serif text-xl transition-colors">The Operating System</Link></li>
                      <li><Link to="/zero-brokerage" className="hover:text-teal font-serif text-xl transition-colors">Zero Brokerage Policy</Link></li>
                      <li><Link to="/manifesto" className="hover:text-teal font-serif text-xl transition-colors">Our Manifesto</Link></li>
                  </ul>
              </div>

              {/* Column 2 - Resources */}
              <div className="pl-8 border-r border-black/10 min-h-[200px]">
                  <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-black/40">Resources</h4>
                  <ul className="space-y-4">
                      <li><Link to="/journal" className="hover:text-teal font-serif text-xl transition-colors">Rental Journal</Link></li>
                      <li><Link to="/careers" className="hover:text-teal font-serif text-xl transition-colors">Careers at StayOs</Link></li>
                      <li><a href="#" className="hover:text-teal font-serif text-xl transition-colors">Press & Media</a></li>
                      <li><Link to="/apply" className="hover:text-teal font-serif text-xl transition-colors">Apply for Access</Link></li>
                  </ul>
              </div>

              {/* Column 3 - Legal */}
              <div className="pl-8 border-r border-black/10 min-h-[200px]">
                  <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-black/40">Legal & Privacy</h4>
                  <ul className="space-y-4">
                      <li><a href="#" className="hover:text-teal font-serif text-xl transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-teal font-serif text-xl transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-teal font-serif text-xl transition-colors">Refund Policy</a></li>
                      <li><a href="#" className="hover:text-teal font-serif text-xl transition-colors">Community Guidelines</a></li>
                  </ul>
              </div>

              {/* Column 4 - Contact */}
              <div className="pl-8 border-r border-black/10 min-h-[200px] col-span-2 md:col-span-1 lg:col-span-2">
                  <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-8 text-black/40">Contact Bureau</h4>
                  <div className="mb-8">
                      <p className="text-sm uppercase tracking-wider text-black/50 mb-1">Tenant Support (Bengaluru)</p>
                      <a href="tel:+918123659925" className="text-3xl font-serif hover:text-teal transition-colors">+91 8123659925</a>
                  </div>
                  <div className="mb-8">
                      <p className="text-sm uppercase tracking-wider text-black/50 mb-1">Landlord Partnerships</p>
                      <a href="tel:+918123380807" className="text-3xl font-serif hover:text-teal transition-colors">+91 8123380807</a>
                  </div>
                  <div className="flex gap-4">
                        {[Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                             <a key={i} href="#" aria-label="Social Link" className="w-10 h-10 border border-black/20 flex items-center justify-center text-black hover:bg-clay hover:text-white transition-all">
                                <Icon size={18} strokeWidth={1.5} />
                             </a>
                        ))}
                  </div>
              </div>

          </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto px-6">
          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-black/30 text-sm font-mono uppercase tracking-widest">
              <p>© 2026 StayOs Technologies Pvt Ltd. All Rights Reserved.</p>
              <p className="mt-2 md:mt-0">Made in Bengaluru, India</p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;