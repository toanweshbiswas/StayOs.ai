import React, { useState } from 'react';
import { Plus, Minus, LayoutGrid, Rocket, ShieldCheck, Gift, HelpCircle } from 'lucide-react';

// --- Level 3: Individual Question & Answer ---
interface FAQQuestionProps {
  question: string;
  answer: string;
}

const FAQQuestion: React.FC<FAQQuestionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-black/5 rounded-xl mb-3 overflow-hidden bg-white/40 hover:bg-white/60 transition-colors duration-300">
      <button 
        onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between p-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-sans font-medium text-ink pr-4 text-lg md:text-xl group-hover:text-teal transition-colors">{question}</span>
        <div className={`text-teal transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
           {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 pb-6 pt-0 text-base md:text-lg text-ink/70 font-serif leading-relaxed max-w-[90%]">
            {answer}
        </div>
      </div>
    </div>
  );
};

// --- Level 2: Category Container ---
interface FAQCategoryProps {
  icon: any;
  title: string;
  questions: { q: string; a: string }[];
}

const FAQCategory: React.FC<FAQCategoryProps> = ({ icon: Icon, title, questions }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`glass-panel rounded-3xl transition-all duration-500 overflow-hidden mb-6 ${isOpen ? 'shadow-xl ring-1 ring-teal/20' : 'shadow-sm hover:shadow-md'}`}>
      
      {/* Category Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-6">
           <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isOpen ? 'bg-teal text-white' : 'bg-teal/10 text-teal'}`}>
               <Icon size={24} strokeWidth={1.5} />
           </div>
           <span className="font-serif font-bold text-xl md:text-2xl text-ink">{title}</span>
        </div>
        <div className={`text-teal transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
           {isOpen ? <Minus size={28} /> : <Plus size={28} />}
        </div>
      </button>
      
      {/* Questions List */}
      <div 
        className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 md:p-8 pt-0">
             {questions.map((q, idx) => (
                 <FAQQuestion key={idx} question={q.q} answer={q.a} />
             ))}
        </div>
      </div>
    </div>
  );
};

// --- Data (SEO Optimized for "People Also Ask") ---
const faqData = [
    {
        title: "About StayOs",
        icon: LayoutGrid,
        questions: [
            { q: "How is StayOs different from typical rental brokers?", a: "StayOs is not a brokerage. We are a vertically integrated rental operating system. We lease, design, furnish, and manage properties directly. This means you deal with us, not a landlord or a broker, ensuring professional service and zero middleman fees." },
            { q: "Which neighborhoods in Bengaluru do you cover?", a: "We currently operate premium managed homes in Indiranagar, Koramangala, and HSR Layout. We meticulously select properties in high-demand, walkable areas close to tech parks and social hubs." },
            { q: "Do you offer private apartments or co-living?", a: "We focus on privacy. We offer private fully furnished apartments (1BHK, 2BHK, 3BHK) and private rooms within shared managed residences. Unlike traditional hostels, our focus is on luxury, space, and community without compromising personal privacy." }
        ]
    },
    {
        title: "Leasing & Move-in",
        icon: Rocket,
        questions: [
            { q: "How does the 'Drop' system and waitlist work?", a: "Because we reject 93% of supply to maintain quality, our homes are in high demand. We release inventory in 'Drops'. Joining the waitlist grants you 24-hour early access to book these homes before they are listed on public classifieds." },
            { q: "What documents are required to rent a flat?", a: "Our KYC is completely digital and seamless. You only need your government ID (Aadhar/PAN) and proof of employment (Offer letter or LinkedIn profile). No intrusive interviews or character certificates required." }
        ]
    },
    {
        title: "Payments & Security",
        icon: ShieldCheck,
        questions: [
            { q: "Is the security deposit refundable?", a: "Yes, and we are faster than the industry standard. We hold deposits in a dedicated escrow account and guarantee a refund within 24 hours of your lease end date, subject to a standard move-out inspection." },
            { q: "Are there any hidden brokerage or service fees?", a: "No. StayOs follows a strict BFF (Brokerage Free Forever) policy. The rent you see is what you pay. There are no move-in fees, legal fees, or agent commissions." }
        ]
    },
    {
        title: "Rewards Program",
        icon: Gift,
        questions: [
            { q: "How do StayCoins work for tenants?", a: "Rent is your biggest expense; it should work for you. Every rupee paid in rent earns you StayCoins. These can be redeemed for housekeeping, deep cleaning services, or discounts with our lifestyle partners like Blue Tokai, Swiggy, and Cult.fit." },
            { q: "Can I pay rent using a credit card?", a: "Yes, StayOs supports rent payments via Credit Card, allowing you to earn your card's reward points on top of our internal StayCoins. We also offer BNPL options for flexibility." }
        ]
    },
    {
        title: "Maintenance & Support",
        icon: HelpCircle,
        questions: [
            { q: "How are maintenance issues handled?", a: "Forget chasing landlords. Open the StayOs app, go to 'Services', and tap 'Fix It'. Our on-ground facility management team responds to tickets within 4 hours for critical issues." },
            { q: "What happens if I get locked out?", a: "All our homes are equipped with smart locks accessible via the app. In the rare event of a malfunction, our 24/7 emergency response team will assist you immediately." }
        ]
    }
];

// --- Main Layout ---
const FAQ: React.FC = () => {
  return (
    <section className="py-24 bg-cream border-b border-black/10 relative overflow-hidden">
         {/* Background Texture for Glassmorphism Context */}
         <div className="absolute inset-0 pointer-events-none opacity-30" 
              style={{ backgroundImage: 'radial-gradient(#1A5F54 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
         </div>

         <div className="max-w-[1440px] mx-auto px-6 relative z-10">
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                 
                 {/* Left Column: Sticky Header with SEO Keywords */}
                 <div className="lg:col-span-5 lg:sticky lg:top-32">
                     <div className="text-left mb-8">
                        <span className="block text-teal text-sm font-bold uppercase tracking-[0.3em] mb-4 animate-fade-in-up">Help & Support</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-ink mb-4 leading-[0.9] animate-fade-in-up">
                            Frequently Asked <br/> Questions
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-serif font-bold text-ink leading-[0.9] animate-fade-in-up delay-100">
                            We've <span className="text-teal">Got Answers.</span>
                        </h3>
                     </div>
                     <p className="text-xl text-ink/70 font-serif italic max-w-md animate-fade-in-up delay-200">
                         Everything you need to know about renting fully furnished homes, our zero brokerage policy, and the StayOs living experience.
                     </p>
                 </div>

                 {/* Right Column: Glassmorphism Accordions */}
                 <div className="lg:col-span-7 w-full animate-fade-in-up delay-300">
                     {faqData.map((category, idx) => (
                          <FAQCategory 
                            key={idx} 
                            icon={category.icon} 
                            title={category.title} 
                            questions={category.questions} 
                          />
                     ))}
                 </div>

             </div>
         </div>
    </section>
  );
};

export default FAQ;