import React, { useState } from 'react';
import { ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItemProps {
  icon: React.ElementType;
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ icon: Icon, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-teal shadow-md' : 'border-black/5 shadow-sm'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isOpen ? 'bg-teal text-white' : 'bg-[#E0F2F1] text-teal'}`}>
               <Icon size={20} strokeWidth={2} />
           </div>
           <span className="font-sans font-bold text-xl text-black">{question}</span>
        </div>
        <div className={`text-teal transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-8 pl-[5rem] pr-8">
            <div className="w-full h-px bg-black/5 mb-4"></div>
            <p className="text-black/60 text-base leading-relaxed font-serif">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const faqs = [
    { 
        category: "General", 
        icon: LayoutGrid, 
        question: "What is StayOs?",
        answer: "StayOs is a premium home rental operating system. We lease, furnish, and manage properties to offer a seamless living experience for urban professionals. No brokers, no friction." 
    },
    { 
        category: "Getting Started", 
        icon: Rocket, 
        question: "How does the waitlist work?",
        answer: "Due to high demand, we release homes in batches (Drops). Joining the waitlist gives you early access to view and book these homes 24 hours before they go public." 
    },
    { 
        category: "Payments & Security", 
        icon: ShieldCheck, 
        question: "Is my security deposit safe?",
        answer: "Absolutely. We hold all security deposits in a separate escrow account. We guarantee a refund within 24 hours of your lease ending, provided there are no major damages." 
    },
    { 
        category: "Rewards", 
        icon: Gift, 
        question: "Do I get rewards for paying rent?",
        answer: "Yes! Every rupee paid towards rent earns you 'StayCoins'. These can be redeemed for housekeeping services, deep cleaning, or discounts on local partner brands." 
    },
    { 
        category: "Expansion", 
        icon: Sparkles, 
        question: "When are you launching in other cities?",
        answer: "We are currently live in Bengaluru (Indiranagar, Koramangala, HSR). We plan to launch in Mumbai and Delhi NCR by Q4 2026." 
    },
    { 
        category: "Support", 
        icon: HelpCircle, 
        question: "How do I raise a maintenance request?",
        answer: "Simply open the StayOs app, go to the 'Services' tab, and tap 'Fix It'. Our on-ground team will attend to the issue within 4 hours." 
    }
];

const WaitlistPage: React.FC = () => {
  const [role, setRole] = useState<'tenant' | 'landlord' | null>(null);

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 px-4 md:px-8 flex flex-col items-center relative">
         
         {/* Background Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>

         {/* Form Section */}
         <div className="w-full max-w-3xl relative z-10 glass-panel shadow-2xl p-8 md:p-12 rounded-xl border border-ink/10 mb-24">
             
             <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-black mb-2">Application Form</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-black/40">Ref: Apply for Access</p>
                 </div>
                 <Link to="/" className="text-sm font-bold uppercase tracking-widest border border-black/20 px-4 py-2 hover:bg-black hover:text-white transition-colors text-black rounded-full">
                     Cancel
                 </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black/10 mb-8 rounded-lg overflow-hidden">
                 <button 
                    onClick={() => setRole('tenant')}
                    className={`
                        p-6 text-left border-b md:border-b-0 md:border-r border-black/10 hover:bg-clay hover:text-white transition-colors
                        ${role === 'tenant' ? 'bg-clay text-white' : 'text-black'}
                    `}
                 >
                     <div className="flex justify-between items-center mb-4">
                        <User size={24} />
                        {role === 'tenant' && <Check size={20} />}
                     </div>
                     <h3 className="text-xl font-serif font-bold mb-1">Tenant</h3>
                     <p className="text-sm uppercase tracking-wider opacity-60">I want to rent</p>
                 </button>

                 <button 
                    onClick={() => setRole('landlord')}
                    className={`
                        p-6 text-left hover:bg-clay hover:text-white transition-colors
                        ${role === 'landlord' ? 'bg-clay text-white' : 'text-black'}
                    `}
                 >
                     <div className="flex justify-between items-center mb-4">
                        <Building size={24} />
                        {role === 'landlord' && <Check size={20} />}
                     </div>
                     <h3 className="text-xl font-serif font-bold mb-1">Landlord</h3>
                     <p className="text-sm uppercase tracking-wider opacity-60">I have property</p>
                 </button>
             </div>

             {role && (
                 <div className="animate-fade-in-up">
                     <form className="space-y-0 border border-black/10 rounded-lg overflow-hidden">
                         <div className="grid grid-cols-1 md:grid-cols-2">
                             <div className="border-b md:border-b-0 md:border-r border-black/10 p-4">
                                 <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">First Name</label>
                                 <input type="text" className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" placeholder="Jane" />
                             </div>
                             <div className="p-4 border-b border-black/10 md:border-b-0">
                                 <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Last Name</label>
                                 <input type="text" className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" placeholder="Doe" />
                             </div>
                         </div>
                         
                         <div className="p-4 border-t border-black/10">
                             <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Email Address</label>
                             <input type="email" className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" placeholder="jane@example.com" />
                         </div>

                         {role === 'tenant' ? (
                             <div className="p-4 border-t border-black/10">
                                 <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Preferred Location</label>
                                 <select className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors appearance-none rounded-none">
                                     <option className="bg-white">Indiranagar</option>
                                     <option className="bg-white">Koramangala</option>
                                     <option className="bg-white">HSR Layout</option>
                                 </select>
                             </div>
                         ) : (
                            <div className="p-4 border-t border-black/10">
                                 <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2">Property Link</label>
                                 <input type="text" className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" placeholder="URL" />
                            </div>
                         )}
                     </form>
                     
                     <div className="mt-8 flex justify-end">
                        <button className="bg-clay text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-teal transition-colors flex items-center gap-2 rounded-full shadow-lg">
                             Submit Application <ArrowRight size={16} />
                        </button>
                     </div>
                 </div>
             )}
         </div>

         {/* FAQ Section */}
         <div className="w-full max-w-3xl relative z-10 mb-24">
             <div className="text-left md:text-center mb-12 px-2">
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-2 leading-tight">
                     Got questions?
                 </h2>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-black leading-tight">
                     We've <span className="text-teal">got them answered!</span>
                 </h2>
             </div>
             
             <div className="space-y-4">
                 {faqs.map((faq, idx) => (
                      <FAQItem key={idx} icon={faq.icon} question={faq.question} answer={faq.answer} />
                 ))}
             </div>
         </div>

    </div>
  );
};

export default WaitlistPage;