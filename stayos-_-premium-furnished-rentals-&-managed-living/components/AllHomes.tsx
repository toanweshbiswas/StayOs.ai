import React, { useState, useMemo, useRef, useEffect } from 'react';
import { featuredHomes } from '../data';
import { MapPin, BedDouble, Copy, ArrowUpRight, ChevronDown, Check, Zap, X } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

// --- Filter Components ---

const FilterPill = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            h-10 px-4 flex items-center gap-3 transition-all duration-300 border text-xs font-bold uppercase tracking-wider rounded-full
            ${isOpen || (value !== 'Any Budget' && value !== 'All Locations')
                ? 'bg-clay text-white border-clay' 
                : 'bg-transparent text-ink border-ink/20 hover:border-clay'
            }
        `}
      >
        <span>{value === 'Any Budget' || value === 'All Locations' ? label : value}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 min-w-[200px] glass-panel rounded-xl shadow-xl z-50 animate-fade-in-up overflow-hidden p-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 hover:bg-clay text-ink/70 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all rounded-lg"
            >
              {opt}
              {value === opt && <Check size={14} className="text-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TogglePill = ({ label, isActive, onClick, icon }: { label: string, isActive: boolean, onClick: () => void, icon?: React.ReactNode }) => {
    return (
        <button
            onClick={onClick}
            className={`
                h-10 px-4 flex items-center gap-2 transition-all duration-300 border text-xs font-bold uppercase tracking-wider rounded-full
                ${isActive 
                    ? 'bg-clay border-clay text-white' 
                    : 'bg-transparent border-ink/20 text-ink hover:border-clay'
                }
            `}
        >
            {icon && <span className={isActive ? 'text-white' : 'text-ink'}>{icon}</span>}
            <span>{label}</span>
        </button>
    )
}

// --- Main Component ---

const AllHomes: React.FC = () => {
  const [budget, setBudget] = useState('Any Budget');
  const [location, setLocation] = useState('All Locations');
  const [showAvailable, setShowAvailable] = useState(false);
  const [moveInReady, setMoveInReady] = useState(false);

  const locations = useMemo(() => {
      const locs = new Set(featuredHomes.map(h => h.location));
      return ['All Locations', ...Array.from(locs).sort()];
  }, []);

  const budgetOptions = ['Any Budget', '₹25,000 - ₹35,000', '₹35,000 - ₹45,000', '₹45,000+'];

  const filteredHomes = useMemo(() => {
    return featuredHomes.filter(home => {
        if (location !== 'All Locations' && home.location !== location) return false;
        
        const price = parseInt(home.price?.replace(/,/g, '') || '0');
        if (budget === '₹25,000 - ₹35,000' && (price < 25000 || price > 35000)) return false;
        if (budget === '₹35,000 - ₹45,000' && (price < 35000 || price > 45000)) return false;
        if (budget === '₹45,000+' && price < 45000) return false;

        if (showAvailable && (home.availableRooms.includes('Fully Booked') || home.status === 'coming_soon')) return false;
        
        if (moveInReady) {
            if (home.availableDate !== 'Available Now') return false;
            if (home.status === 'coming_soon') return false;
            if (home.availableRooms.includes('Fully Booked')) return false;
        }

        return true;
    });
  }, [budget, location, showAvailable, moveInReady]);

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto min-h-screen">
       
       <div className="text-center mb-16 border-b-2 border-ink pb-8">
           <h1 className="text-5xl md:text-7xl font-serif text-ink mb-2 tracking-tight">
               Curated Listings
           </h1>
           <p className="text-base font-bold tracking-[0.3em] uppercase text-ink/40">The Collection • Vol. 01</p>
       </div>

       {/* Sticky Filter Bar - Floating Glass Island Style */}
       <div className="sticky top-28 z-40 mb-12 flex justify-center pointer-events-none">
            <div className="glass-panel rounded-full px-2 py-2 flex justify-center items-center gap-2 flex-wrap shadow-xl pointer-events-auto">
                <div className="flex items-center px-4">
                    <span className="text-xs font-serif italic text-ink/50">Filter:</span>
                </div>
                <div className="h-6 w-px bg-ink/10 hidden md:block"></div>
                <FilterPill label="Location" value={location} options={locations} onChange={setLocation} />
                <FilterPill label="Budget" value={budget} options={budgetOptions} onChange={setBudget} />
                <div className="w-px h-6 bg-ink/10 mx-1 hidden md:block"></div>
                <TogglePill label="Available Only" isActive={showAvailable} onClick={() => setShowAvailable(!showAvailable)} />
                <TogglePill label="Instant Move-in" isActive={moveInReady} onClick={() => setMoveInReady(!moveInReady)} icon={<Zap size={12} className={moveInReady ? "fill-white" : ""} />} />
            </div>
       </div>

       <div className="flex justify-between items-end mb-8 px-2 pb-2 border-b border-ink/10">
            <h2 className="text-ink text-xl font-serif italic">Displaying {filteredHomes.length} Residences</h2>
       </div>

       {filteredHomes.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-ink/10">
              {filteredHomes.map(home => (
                 <div 
                    key={home.id} 
                    className="group border-r border-b border-ink/10 bg-paper hover:bg-[#F5F5F0] transition-colors p-6 flex flex-col"
                 >
                    <div className="relative aspect-[4/3] overflow-hidden mb-6 border border-ink/10 p-1 bg-white shadow-sm">
                        <div className="w-full h-full relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                             <ImageWithLoader 
                                src={home.image} 
                                alt={home.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-2xl font-serif text-ink leading-none">{home.name}</h3>
                                <div className="text-sm font-bold uppercase tracking-widest border border-ink/20 px-2 py-1 text-ink/60 rounded-sm">
                                    {home.location}
                                </div>
                            </div>
                            
                            <div className="flex gap-4 text-ink/60 text-sm font-mono uppercase tracking-wider mb-6 border-b border-ink/10 pb-4">
                                <span className="flex items-center gap-1.5"><BedDouble size={12} /> {home.bhk} BHK</span>
                                <span className="flex items-center gap-1.5"><Copy size={12} /> {home.sqft} Sqft</span>
                            </div>

                            <div className="flex items-center gap-2 w-full mb-4">
                                <div className={`w-1.5 h-1.5 rounded-full ${home.availableRooms.includes('Fully Booked') ? 'bg-red-500' : 'bg-teal'}`}></div>
                                <span className={`text-sm font-bold uppercase tracking-widest ${home.availableRooms.includes('Fully Booked') ? 'text-ink/40' : 'text-teal'}`}>
                                    {home.availableRooms}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-4">
                            <div>
                                <p className="text-xs text-ink/30 font-bold uppercase tracking-widest mb-1">Monthly Rent</p>
                                <h4 className="text-xl font-serif text-ink">₹{home.price}</h4>
                            </div>
                            <button className="border border-ink/20 hover:bg-clay hover:text-white text-ink px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm">
                                Details <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
       ) : (
           <div className="flex flex-col items-center justify-center py-32 text-center opacity-60 border border-ink/10 border-dashed rounded-lg">
               <h3 className="text-3xl font-serif text-ink mb-4">No Listings Found</h3>
               <button 
                  onClick={() => {
                      setBudget('Any Budget');
                      setLocation('All Locations');
                      setShowAvailable(false);
                      setMoveInReady(false);
                  }}
                  className="px-8 py-3 bg-clay hover:bg-clay/90 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-full shadow-lg"
               >
                   Reset Search
               </button>
           </div>
       )}
    </div>
  )
}

export default AllHomes;