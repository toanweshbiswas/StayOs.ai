import React from 'react';

const messages = [
  "Rent+: Spot your monthly rent.",
  "WFH+: Earn upto 50% via subletting.",
  "Essentials+: Bills & housekeeping automated.",
  "BFF: Zero Brokerage Forever.",
  "Deposit+: 24hr Refund Guarantee.",
  "RSVP: Early Access Open."
];

const BottomBanner: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] h-8 bg-black flex items-center overflow-hidden border-t border-white/10">
      <div className="flex whitespace-nowrap animate-marquee w-max" style={{ animationDuration: '80s' }}>
        {[...Array(4)].map((_, setIndex) => (
            <React.Fragment key={setIndex}>
                {messages.map((msg, i) => (
                    <div key={`${setIndex}-${i}`} className="flex items-center border-r border-white/20 h-full">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest px-6 py-1">
                            {msg}
                        </span>
                    </div>
                ))}
            </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BottomBanner;