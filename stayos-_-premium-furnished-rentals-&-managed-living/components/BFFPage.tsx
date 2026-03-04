import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, Zap, Smartphone, Split, Key } from 'lucide-react';

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if(current) observer.unobserve(current); }
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const BFFPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 px-4 md:px-8 relative font-sans text-black overflow-x-hidden">
        
        {/* HEADER */}
        <div className="max-w-[1440px] mx-auto mb-24 border-b border-black/10 pb-12">
            <FadeInSection>
                <div className="flex justify-between items-end">
                    <h1 className="text-[10vw] font-serif leading-[0.8] tracking-tighter text-black">
                        Zero<span className="text-clay">.</span>
                    </h1>
                    <div className="hidden md:block text-right mb-4">
                        <p className="font-bold uppercase tracking-widest text-sm mb-2 text-black/60">Our Core Promise</p>
                        <p className="font-serif italic text-3xl text-black">Brokerage Free Forever.</p>
                    </div>
                </div>
            </FadeInSection>
        </div>

        {/* TENANT SECTION */}
        <section className="max-w-[1440px] mx-auto mb-32">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-black/10 bg-white shadow-xl">
                
                {/* Main Feature */}
                <div className="col-span-1 md:col-span-8 p-12 md:p-20 border-b md:border-b-0 md:border-r border-black/10 relative">
                    <span className="absolute top-8 left-8 text-xs font-bold uppercase tracking-[0.3em] text-clay">The Lead Story</span>
                    <h2 className="text-5xl md:text-7xl font-serif mt-8 mb-8 leading-none text-black">
                        BFF = Best Friends Forever = <br/>
                        <span className="italic font-bold text-teal decoration-clay underline decoration-4 underline-offset-8">Brokerage Free Forever.</span>
                    </h2>
                    <p className="text-2xl md:text-3xl font-light max-w-xl leading-relaxed text-black/80">
                        We don't charge you to find a home. We keep the middleman out so you keep your money in.
                    </p>
                    <div className="mt-12 inline-block bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest">
                        Save approx ₹45,000
                    </div>
                </div>

                {/* Sidebar Features */}
                <div className="col-span-1 md:col-span-4 bg-[#F5F5F0]">
                    <div className="p-12 border-b border-black/10 h-1/2 flex flex-col justify-between hover:bg-clay hover:text-white transition-colors group">
                        <Zap size={32} className="mb-4 text-black group-hover:text-white" />
                        <div>
                            <h3 className="text-2xl font-serif mb-2 text-black group-hover:text-white">Rent+</h3>
                            <p className="opacity-60 text-base leading-relaxed text-black group-hover:text-white">Cash crunch? Spot your rent instantly. 0% interest for 15 days.</p>
                        </div>
                    </div>
                    <div className="p-12 h-1/2 flex flex-col justify-between hover:bg-black hover:text-white transition-colors group">
                        <Smartphone size={32} className="mb-4 text-black group-hover:text-white" />
                        <div>
                            <h3 className="text-2xl font-serif mb-2 text-black group-hover:text-white">Essentials+</h3>
                            <p className="opacity-60 text-base leading-relaxed text-black group-hover:text-white">Housekeeping, groceries & repairs. One tap on the OS.</p>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* LANDLORD HEADER */}
        <div className="max-w-[1440px] mx-auto mb-12 border-t border-black/10 pt-24 text-center">
             <span className="inline-block px-4 py-1 border border-black/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 text-black/60">For Owners</span>
             <h2 className="text-4xl md:text-7xl font-serif leading-[0.9] text-black">Yield. Not just Rent.</h2>
        </div>

        {/* LANDLORD GRID */}
        <section className="max-w-[1440px] mx-auto pb-24">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-black text-white p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
                     <div>
                         <h3 className="text-3xl font-serif mb-4">Deposit+ <br/><span className="text-[#00C48C]">12% Yield</span></h3>
                         <p className="text-white/50 text-xl max-w-sm">Grow your deposit corpus with our risk-free return pools.</p>
                     </div>
                     <div className="w-full h-px bg-white/20 mt-12"></div>
                 </div>
                 
                 <div className="bg-white border border-black/10 p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
                     <div>
                         <h3 className="text-3xl font-serif mb-4 text-black">Safe+ <br/><span className="text-blue-600">Credit Line</span></h3>
                         <p className="text-black/50 text-xl max-w-sm">Unlock the value of your future rent today.</p>
                     </div>
                     <div className="w-full h-px bg-black/10 mt-12"></div>
                 </div>
             </div>
        </section>

    </div>
  );
};

export default BFFPage;