import React, { useRef } from 'react';
import { Home } from '../types';
import { Map, ChevronLeft, ChevronRight, Bell, ArrowUpRight } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

const upcomingHomes: Home[] = [
  { id: 'cs1', name: 'Ember', location: 'Ulsoor', image: 'https://picsum.photos/600/800?random=30', availableDate: 'Coming Soon', sqft: 2000, bhk: 3, availableRooms: 'Private Rooms: ₹36K/mo', status: 'coming_soon' },
  { id: 'cs2', name: 'Capony', location: 'HSR Layout', image: 'https://picsum.photos/600/800?random=31', availableDate: 'Coming Soon', sqft: 1600, bhk: 2, availableRooms: 'Private Rooms: ₹39K/mo', status: 'coming_soon' },
  { id: 'cs3', name: 'Arista', location: 'Bellandur', image: 'https://picsum.photos/600/800?random=32', availableDate: 'Coming Soon', sqft: 2100, bhk: 3, availableRooms: 'Private Rooms: ₹36K/mo', status: 'coming_soon' },
];

const ComingSoon: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-32 bg-cream text-black border-b border-black/10">

      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black/10 pb-8">
            <div className="text-left">
                <div className="inline-block px-3 py-1 mb-4 border border-clay text-[10px] font-bold tracking-[0.3em] uppercase text-clay">
                    Upcoming Drops
                </div>
                <h2 className="text-5xl md:text-7xl mb-4 leading-none tracking-tight font-serif text-black">
                    Secure it before <br />
                    <span className="italic text-black/50">it hits the market.</span>
                </h2>
            </div>
            <div className="hidden md:flex gap-4">
                <button 
                    onClick={() => scroll('left')} 
                    className="w-14 h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={() => scroll('right')} 
                    className="w-14 h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        <div 
            ref={scrollRef} 
            className="flex gap-8 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory"
        >
            {upcomingHomes.map(home => (
                <div 
                    key={home.id} 
                    className="snap-center shrink-0 w-[85vw] max-w-[340px] md:w-[380px] group relative"
                >
                    <div className="border-t border-black/20 pt-4">
                        <div className="relative aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-gray-100 mb-6 border border-black/5">
                            <ImageWithLoader 
                                src={home.image} 
                                alt={home.name} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 right-0 bg-clay text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                                Coming Soon
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-3xl font-serif leading-none">{home.name}</h3>
                            <span className="text-xs font-mono uppercase text-black/50">{home.location}</span>
                        </div>
                        
                        <div className="flex justify-between items-center border-t border-black/10 pt-4 mt-4">
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-black/50">
                                <span>{home.bhk} BHK</span>
                                <span>{home.sqft} SQFT</span>
                            </div>
                            <button className="text-[10px] font-bold uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                                Notify Me
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="snap-center shrink-0 w-[85vw] max-w-[340px] md:w-[380px] group relative flex flex-col justify-center">
                <div className="border border-black/10 bg-white p-10 text-center h-[90%] flex flex-col items-center justify-center hover:border-black/30 transition-colors shadow-lg">
                     <Bell size={32} className="text-black mb-6" />
                     <h3 className="text-3xl font-serif mb-4">The Waitlist</h3>
                     <p className="text-black/50 mb-8 max-w-xs mx-auto">Good homes go fast. Get a text the moment we drop a key.</p>
                     
                     <div className="w-full space-y-4">
                        <input type="email" placeholder="Email Address" className="w-full bg-black/5 border border-black/20 p-4 text-black text-center focus:outline-none focus:border-black" />
                        <button className="w-full bg-clay text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-teal transition-colors">
                            Subscribe
                        </button>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;