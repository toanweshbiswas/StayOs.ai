import React, { useEffect, useState, useRef } from 'react';

const useInView = (threshold = 0.2) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

const Counter: React.FC<{ end: number; duration?: number; trigger: boolean; prefix?: string; suffix?: string }> = ({ end, duration = 2000, trigger, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (trigger) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(ease * end);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [trigger, end, duration]);

  return <span className="tabular-nums font-light">{prefix}{end % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}{suffix}</span>;
};

const Stats: React.FC = () => {
  const { ref, isInView } = useInView(0.1);

  return (
    <section className="py-24 md:py-32 bg-cream px-4 md:px-8 border-y border-ink/10 relative">
      {/* Background Grid Pattern for Financial Look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #242424 1px, transparent 1px), linear-gradient(to bottom, #242424 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10" ref={ref}>
        
        {/* Header - Financial Section Style */}
        <div className="border-b-4 border-double border-ink/10 mb-12 pb-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-teal rounded-full"></div>
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-ink/60">Section 2: Market Analysis</h2>
                    </div>
                    <h3 className="text-4xl md:text-7xl font-serif leading-none text-ink tracking-tight">
                        The ROI Report
                    </h3>
                </div>
                <div className="hidden md:block text-right transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}">
                    <p className="text-ink/60 text-lg max-w-sm font-serif italic border-l-2 border-teal pl-4">
                        "Traditional renting is a losing game. We flipped the script to put money back in your pocket."
                    </p>
                </div>
            </div>
        </div>

        {/* Newspaper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-ink/10 bg-paper">
            
            {/* Stat 1 */}
            <div className={`
                col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ink/10 relative group
                transition-all duration-1000 delay-300
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <div className="flex justify-between items-start mb-12">
                     <span className="text-xs font-bold uppercase tracking-widest text-teal border border-teal/30 px-3 py-1 bg-teal/5">Liquidity</span>
                     <span className="text-xs font-mono text-ink/30">FIG. A</span>
                </div>
                <div className="text-6xl md:text-8xl text-ink mb-6 tracking-tighter leading-none font-serif">
                    <Counter end={24} suffix="h" trigger={isInView} />
                </div>
                <h4 className="text-lg font-bold uppercase tracking-widest text-ink mb-4 border-t border-ink/10 pt-4 inline-block w-full">Deposit Refund</h4>
                <p className="text-ink/60 text-base font-serif italic leading-relaxed">
                    Industry standard is 45 days. We process refunds within 24 hours of vacancy. Capital efficiency for the modern tenant.
                </p>
            </div>

            {/* Stat 2 */}
            <div className={`
                col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ink/10 relative group
                transition-all duration-1000 delay-400
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <div className="flex justify-between items-start mb-12">
                     <span className="text-xs font-bold uppercase tracking-widest text-ink border border-ink/30 px-3 py-1">Savings</span>
                     <span className="text-xs font-mono text-ink/30">FIG. B</span>
                </div>
                <div className="text-6xl md:text-8xl text-ink mb-6 tracking-tighter leading-none font-serif">
                    <Counter end={0} prefix="₹" trigger={isInView} />
                </div>
                <h4 className="text-lg font-bold uppercase tracking-widest text-ink mb-4 border-t border-ink/10 pt-4 inline-block w-full">Brokerage Fees</h4>
                <p className="text-ink/60 text-base font-serif italic leading-relaxed">
                    Zero. Zilch. Nada. Your money belongs in your ETF portfolio or travel fund. Not in a broker's pocket.
                </p>
            </div>

            {/* Stat 3 */}
            <div className={`
                col-span-1 p-8 md:p-12 relative group
                transition-all duration-1000 delay-500
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <div className="flex justify-between items-start mb-12">
                     <span className="text-xs font-bold uppercase tracking-widest text-clay border border-clay/30 px-3 py-1 bg-clay/5">Income</span>
                     <span className="text-xs font-mono text-ink/30">FIG. C</span>
                </div>
                <div className="text-6xl md:text-8xl text-ink mb-6 tracking-tighter leading-none font-serif">
                    <Counter end={50} suffix="%" trigger={isInView} />
                </div>
                <h4 className="text-lg font-bold uppercase tracking-widest text-ink mb-4 border-t border-ink/10 pt-4 inline-block w-full">Rent Recovered</h4>
                <p className="text-ink/60 text-base font-serif italic leading-relaxed">
                    Traveling? Sublet your room via the OS legally. Turn your liability into an asset while you roam the world.
                </p>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;