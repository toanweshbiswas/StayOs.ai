import React, { useState, useEffect, useRef } from 'react';
import Hero from './Hero';
import HomeCarousel, { HomeCarouselHandle } from './HomeCarousel';
import { Home } from '../types';

const landlordFeatures: Home[] = [
    { id: 'l1', name: 'Deposit+', description: 'Liquidity unlocked. We refund tenants in 24h, while you earn 12% APY on the deposit corpus.', location: 'Fintech', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800', price: '12% Yield', bhk: 0, sqft: 0, availableRooms: 'Asset Class', availableDate: 'Active' },
    { id: 'l2', name: 'Safe+', description: 'Instant credit line against your future rental income. Cash out 12 months of rent today.', location: 'Credit', image: 'https://images.unsplash.com/photo-1565514020176-dbf2277e38c3?auto=format&fit=crop&q=80&w=800', price: 'Instant Limit', bhk: 0, sqft: 0, availableRooms: 'Liquidity', availableDate: 'Active' },
    { id: 'l3', name: 'AutoPilot', description: 'Zero-touch management. We handle sourcing, KYC, agreements, maintenance, and exit.', location: 'Ops', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', price: 'Zero Stress', bhk: 0, sqft: 0, availableRooms: 'Managed', availableDate: 'Active' },
];

const tenantFeatures: Home[] = [
    { id: 't1', name: 'Rent+', description: 'Cash crunch? Spot your rent with 0% interest for 15 days or convert to low-cost EMIs.', location: 'Payments', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800', price: 'BNPL', bhk: 0, sqft: 0, availableRooms: 'Credit', availableDate: 'Active' },
    { id: 't2', name: 'Nomad', description: 'Traveling? Sublet your room legally through the app and earn back up to 50% of your rent.', location: 'Flexibility', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800', price: 'Earn Rent', bhk: 0, sqft: 0, availableRooms: 'Sublet', availableDate: 'Active' },
    { id: 't3', name: 'Concierge', description: 'Housekeeping, laundry, groceries, and repairs. One tap, delivered to your door.', location: 'Service', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', price: 'On-Demand', bhk: 0, sqft: 0, availableRooms: 'Lifestyle', availableDate: 'Active' },
];

const businessFeatures: Home[] = [
    { id: 'b1', name: 'Corp OS', description: 'Ditch the hotel. Give your team homes that inspire creativity and foster connection.', location: 'B2B', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', price: 'Custom', bhk: 0, sqft: 0, availableRooms: 'Housing', availableDate: 'Active' },
    { id: 'b2', name: 'Relocate', description: 'End-to-end relocation for new hires. From airport pickup to a stocked fridge.', location: 'HR Tech', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800', price: 'Seamless', bhk: 0, sqft: 0, availableRooms: 'Onboarding', availableDate: 'Active' },
    { id: 'b3', name: 'Pass', description: 'City-wide access to our lounge network and workspaces for your distributed team.', location: 'Network', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', price: 'Flexible', bhk: 0, sqft: 0, availableRooms: 'Access', availableDate: 'Active' },
];

const SecondaryNavbar = ({ activeSection, scrollTo }: { activeSection: string, scrollTo: (section: string) => void }) => {
  return (
    <div 
        className={`fixed bottom-12 left-0 right-0 z-[85] flex justify-center pointer-events-none`}
    >
        <div className={`pointer-events-auto glass-panel rounded-full p-2 flex items-center gap-1 shadow-2xl`}>
            {['landlords', 'tenants', 'businesses'].map((sec) => (
                <button 
                    key={sec}
                    onClick={() => scrollTo(sec)} 
                    className={`
                        px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full
                        ${activeSection === sec ? 'bg-ink text-white shadow-lg' : 'bg-transparent text-ink/40 hover:text-ink hover:bg-white/50'}
                    `}
                >
                    {sec.slice(0, -1)}
                </button>
            ))}
        </div>
    </div>
  );
};

const OSPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('landlords');
  
  const landlordContainerRef = useRef<HTMLDivElement>(null);
  const tenantContainerRef = useRef<HTMLDivElement>(null);
  const businessContainerRef = useRef<HTMLDivElement>(null);
  const landlordCarouselRef = useRef<HomeCarouselHandle>(null);
  const tenantCarouselRef = useRef<HomeCarouselHandle>(null);
  const businessCarouselRef = useRef<HomeCarouselHandle>(null);

  const T = {
      L_SCROLL_END: 0.35,
      T_ENTER_START: 0.28, T_ENTER_END: 0.40, T_SCROLL_START: 0.40, T_SCROLL_END: 0.65,
      B_ENTER_START: 0.60, B_ENTER_END: 0.72, B_SCROLL_START: 0.72, B_SCROLL_END: 1.0
  };

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
        if (!containerRef.current) return;
        
        const top = containerRef.current.offsetTop;
        const height = containerRef.current.offsetHeight;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        let p = (scrollY - top) / (height - windowHeight);
        p = Math.max(0, Math.min(1, p));
        
        rafId = requestAnimationFrame(() => {
            let currentSection = 'landlords';
            if (p >= T.T_ENTER_START && p < T.B_ENTER_START) currentSection = 'tenants';
            else if (p >= T.B_ENTER_START) currentSection = 'businesses';
            setActiveSection(currentSection);

            const lProgress = Math.min(1, p / T.L_SCROLL_END);
            landlordCarouselRef.current?.setProgress(lProgress);

            let tTransX = 100;
            let tProgress = 0;
            if (p >= T.T_ENTER_START) {
                if (p <= T.T_ENTER_END) {
                    const enterP = (p - T.T_ENTER_START) / (T.T_ENTER_END - T.T_ENTER_START);
                    tTransX = 100 * (1 - easeOutCubic(enterP));
                } else tTransX = 0;
                
                if (p >= T.T_SCROLL_START) {
                   const scrollP = (p - T.T_SCROLL_START) / (T.T_SCROLL_END - T.T_SCROLL_START);
                   tProgress = Math.min(1, Math.max(0, scrollP));
                }
            }
            if (tenantContainerRef.current) tenantContainerRef.current.style.transform = `translate3d(${tTransX}%, 0, 0)`;
            tenantCarouselRef.current?.setProgress(tProgress);

            let bTransX = 100;
            let bProgress = 0;
            if (p >= T.B_ENTER_START) {
                if (p <= T.B_ENTER_END) {
                    const enterP = (p - T.B_ENTER_START) / (T.B_ENTER_END - T.B_ENTER_START);
                    bTransX = 100 * (1 - easeOutCubic(enterP));
                } else bTransX = 0;

                if (p >= T.B_SCROLL_START) {
                   const scrollP = (p - T.B_SCROLL_START) / (T.B_SCROLL_END - T.B_SCROLL_START);
                   bProgress = Math.min(1, Math.max(0, scrollP));
                }
            }
            if (businessContainerRef.current) businessContainerRef.current.style.transform = `translate3d(${bTransX}%, 0, 0)`;
            businessCarouselRef.current?.setProgress(bProgress);
        });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafId); };
  }, []);

  const scrollToSection = (section: string) => {
      if (!containerRef.current) return;
      const trackLength = containerRef.current.offsetHeight - window.innerHeight;
      let targetProgress = 0;
      if (section === 'landlords') targetProgress = 0;
      if (section === 'tenants') targetProgress = T.T_SCROLL_START + 0.01; 
      if (section === 'businesses') targetProgress = T.B_SCROLL_START + 0.01;
      window.scrollTo({ top: containerRef.current.offsetTop + (trackLength * targetProgress), behavior: 'smooth' });
  };

  return (
    <>
      <SecondaryNavbar activeSection={activeSection} scrollTo={scrollToSection} />
      <div ref={containerRef} className="relative w-full h-[350vh] bg-cream block">
          <div className="sticky top-0 w-full h-screen overflow-hidden bg-cream">
             
             <div ref={landlordContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-8 lg:p-12 will-change-transform bg-cream" style={{ zIndex: 10 }}>
                 <HomeCarousel ref={landlordCarouselRef} id="landlords" homes={landlordFeatures} title="Landlord OS" subtitle="Maximize yield. Minimize chaos." controlled={true} />
             </div>

             <div ref={tenantContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-8 lg:p-12 will-change-transform bg-[#F0F0F0]" style={{ zIndex: 20, transform: 'translate3d(100%, 0, 0)' }}>
                 <HomeCarousel ref={tenantCarouselRef} id="tenants" homes={tenantFeatures} title="Tenant OS" subtitle="Lifestyle Architecture." controlled={true} />
             </div>

             <div ref={businessContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-8 lg:p-12 will-change-transform bg-[#E5E5E5]" style={{ zIndex: 30, transform: 'translate3d(100%, 0, 0)' }}>
                 <HomeCarousel ref={businessCarouselRef} id="businesses" homes={businessFeatures} title="Business OS" subtitle="Housing as a perk." controlled={true} />
             </div>

          </div>
      </div>
    </>
  );
};

export default OSPage;