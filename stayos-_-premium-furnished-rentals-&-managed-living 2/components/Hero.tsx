import React from 'react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Calendar, Cloud, Wind } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-20 bg-cream border-b border-ink/10 overflow-hidden">
        {/* Background Grid/Lines */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full max-w-[1440px] mx-auto border-x border-ink/5 relative">
                 <div className="absolute top-0 left-[20%] bottom-0 w-px bg-ink/5 hidden lg:block"></div>
                 <div className="absolute top-0 right-[20%] bottom-0 w-px bg-ink/5 hidden lg:block"></div>
            </div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-6 flex flex-col items-center">
            
            {/* --- NEWSPAPER HEADER SECTION --- */}
            
            {/* Ear Pieces (Top corners) & Masthead */}
            <div className="w-full flex flex-col md:flex-row justify-between items-end border-b-4 border-double border-ink/20 pb-6 mb-2 opacity-0 animate-fade-in-up">
                
                {/* Left Ear - Keyword Rich Context */}
                <div className="hidden md:block w-64 text-left border-r border-ink/10 pr-6 h-full">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink/40 mb-2">Est. 2026 • Bengaluru</p>
                    <p className="text-lg font-serif italic text-ink/70 leading-tight">
                        "The definitive operating system for premium managed rentals and brokerage-free living."
                    </p>
                </div>
                
                {/* Masthead - Brand Name */}
                <div className="flex-1 text-center px-4 mb-4 md:mb-0">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-none text-ink">
                        StayOs<span className="text-teal">.</span>
                    </h1>
                </div>

                {/* Right Ear - Metadata */}
                <div className="hidden md:block w-64 text-right border-l border-ink/10 pl-6 h-full">
                     <div className="flex items-center justify-end gap-3 text-ink/70 mb-2">
                        <Cloud size={16} />
                        <span className="text-lg font-serif">Bengaluru, 24°C</span>
                     </div>
                     <div className="flex justify-end gap-4 text-sm font-bold uppercase tracking-[0.2em] text-ink/40">
                        <span>Daily Edition</span>
                        <span>Vol. XI</span>
                     </div>
                </div>
            </div>

            {/* Date Line & Key Value Props */}
            <div className="w-full border-b border-ink/10 py-2 mb-16 grid grid-cols-1 md:grid-cols-3 items-center opacity-0 animate-fade-in-up delay-100 px-2 gap-y-2 md:gap-y-0">
                <div className="text-sm md:text-base font-bold uppercase tracking-widest text-ink/60 flex gap-4 justify-center md:justify-start">
                    <span>Bengaluru, India</span>
                    <span className="hidden lg:inline">|</span>
                    <span className="hidden lg:inline">Market Supply: 7% Elite Homes</span>
                </div>
                <div className="text-sm md:text-base font-bold uppercase tracking-widest text-ink/60 text-center">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-sm md:text-base font-bold uppercase tracking-widest text-ink/60 text-center md:text-right">
                    BFF (Brokerage Free Forever) • 12% Deposit Yield
                </div>
            </div>

            {/* --- MAIN HEADLINE SECTION (H2 for SEO) --- */}
            <div className="w-full text-center mb-16 opacity-0 animate-fade-in-up delay-200">
                <div className="flex justify-center items-center gap-4 mb-6">
                     <div className="h-px bg-clay w-12 md:w-24"></div>
                     <span className="text-clay font-bold text-base uppercase tracking-[0.3em]">Premium Furnished Rentals</span>
                     <div className="h-px bg-clay w-12 md:w-24"></div>
                </div>
                <h2 className="text-[8vw] md:text-[6rem] leading-[0.85] font-serif font-bold text-ink uppercase tracking-tighter mix-blend-difference transform scale-y-110">
                    Feel Like <br className="hidden md:block" /> Home
                </h2>
                <h3 className="text-xl md:text-3xl lg:text-4xl font-serif italic font-light text-ink/60 mt-6 md:mt-8">
                    ( Fully Managed. Zero Friction. )
                </h3>
            </div>

            {/* --- CONTENT COLUMNS --- */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-ink/10">
                
                {/* Left Column: Story & SEO Context */}
                <div className="lg:col-span-3 border-r border-ink/10 pr-6 pt-8 hidden lg:block opacity-0 animate-fade-in-up delay-300">
                     <div className="flex items-center gap-2 mb-6">
                        <span className="text-4xl font-serif leading-none text-ink">L</span>
                        <h4 className="font-bold text-base uppercase tracking-widest text-ink/40 pt-2">The Lead Story</h4>
                     </div>
                     
                     <h5 className="font-serif text-2xl text-ink leading-tight mb-2">Why Pay Brokerage in 2026?</h5>
                     
                     <div className="flex justify-between items-center text-sm text-ink/40 font-mono uppercase tracking-widest mb-4 border-b border-ink/10 pb-2">
                        <span>Editorial</span>
                        <span>Market Analysis</span>
                     </div>
                     
                     <p className="text-justify font-serif text-ink/80 leading-relaxed text-lg mb-6 border-b border-ink/10 pb-6">
                        Bengaluru's rental market is broken. High deposits, unverified listings, and hidden fees. StayOs removes the friction. We lease, design, and manage the top 7% of homes in Indiranagar, Koramangala, and HSR.
                     </p>
                     <p className="text-justify font-serif text-ink/80 leading-relaxed text-lg">
                        Rent fully furnished apartments with flexible leases, automated maintenance, and zero brokerage fees.
                     </p>
                     
                     <div className="mt-12 bg-ink/5 p-4 border border-ink/10">
                         <h5 className="font-bold text-sm uppercase tracking-widest text-teal mb-3">Live Market Data</h5>
                         <div className="flex justify-between text-base text-ink/70 border-b border-ink/10 py-2">
                             <span>Market Rent</span>
                             <span className="text-red-600 font-bold">+12% YoY</span>
                         </div>
                         <div className="flex justify-between text-base text-ink/70 py-2">
                             <span>StayOs Savings</span>
                             <span className="text-teal font-bold">₹45k/yr</span>
                         </div>
                     </div>
                </div>

                {/* Center: Hero Images (The "Photo") */}
                <div className="lg:col-span-6 relative flex justify-center items-center pt-10 pb-10 lg:px-10 min-h-[500px]">
                     <div className="relative w-full max-w-md aspect-[4/5]">
                        {/* Image 1 */}
                        <div className="absolute top-0 left-0 w-[85%] z-20 opacity-0 animate-fade-in-up delay-[400ms]">
                           <div className="bg-paper p-3 pb-10 shadow-xl rotate-[-2deg] transition-all duration-700 hover:rotate-0 hover:z-30 hover:scale-105 border border-ink/10">
                                <div className="aspect-[4/5] bg-gray-200 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden border border-ink/5 sepia-[0.1]">
                                     <ImageWithLoader 
                                        src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800" 
                                        className="w-full h-full object-cover" 
                                        alt="Premium furnished living room in Indiranagar rental"
                                        loading="eager"
                                     />
                                </div>
                                <div className="mt-4 flex justify-between items-end px-1">
                                    <p className="text-ink font-serif italic text-base">Fig A. Designer Interiors</p>
                                    <span className="text-xs font-bold text-ink/40 uppercase tracking-widest">Pg 1</span>
                                </div>
                           </div>
                        </div>

                        {/* Image 2 */}
                        <div className="absolute top-[25%] right-[-5%] w-[65%] z-10 opacity-0 animate-fade-in-up delay-[500ms]">
                           <div className="bg-[#EAE8E0] p-3 pb-8 shadow-lg rotate-[3deg] transition-all duration-700 hover:rotate-0 hover:z-30 hover:scale-105 border border-ink/10">
                                <div className="aspect-square bg-gray-200 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden border border-ink/5 sepia-[0.1]">
                                     <ImageWithLoader 
                                        src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80&w=800" 
                                        className="w-full h-full object-cover" 
                                        alt="Sunlit bedroom in managed apartment"
                                     />
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-ink font-serif italic text-sm">Fig B. Morning Light</p>
                                </div>
                           </div>
                        </div>
                     </div>
                </div>

                {/* Right Column: CTAs / Index */}
                <div className="lg:col-span-3 border-l border-ink/10 pl-6 pt-8 flex flex-col justify-between opacity-0 animate-fade-in-up delay-[600ms]">
                     <div>
                        <h4 className="font-bold text-base uppercase tracking-[0.2em] mb-8 text-ink/40 border-b border-ink/10 pb-2">In This Issue</h4>
                        <ul className="space-y-0">
                            {[
                                { title: "The OS", page: "03", link: "/og-os", desc: "Digital Living App" },
                                { title: "BFF Policy", page: "05", link: "/bff", desc: "Zero Brokerage" },
                                { title: "Classifieds", page: "08", link: "/classifieds", desc: "Current Listings" },
                                { title: "Manifesto", page: "12", link: "/story", desc: "Our Vision" }
                            ].map((item, i) => (
                                <li key={i} className="border-b border-ink/10 last:border-0">
                                    <Link to={item.link} className="flex justify-between items-start py-4 group cursor-pointer hover:bg-ink/5 px-2 -mx-2 transition-colors">
                                        <div>
                                            <span className="block font-serif text-xl text-ink group-hover:text-teal transition-colors mb-1">{item.title}</span>
                                            <span className="block text-sm uppercase tracking-wider text-ink/50">{item.desc}</span>
                                        </div>
                                        <span className="font-mono text-lg text-ink/30 font-bold">Pg.{item.page}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     </div>

                     <div className="mt-12 mb-6">
                         <div className="border border-ink/20 p-6 text-center bg-paper shadow-lg relative">
                             <div className="absolute inset-0 bg-ink/5 pointer-events-none mix-blend-multiply"></div>
                             <h4 className="font-serif text-xl italic mb-4 text-ink relative z-10">"The smartest way to rent in Bengaluru."</h4>
                             <Link to="/join-waitlist" className="block w-full bg-clay hover:bg-teal text-white text-center py-4 font-bold uppercase tracking-widest text-base transition-all shadow-[4px_4px_0px_0px_rgba(36,36,36,0.15)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] relative z-10">
                                 Apply for Access
                             </Link>
                             <p className="text-center text-sm text-ink/40 mt-3 uppercase tracking-widest relative z-10">
                                 Limited Spots • Waitlist Open
                             </p>
                         </div>
                     </div>
                </div>

            </div>

        </div>
    </section>
  );
};

export default Hero;