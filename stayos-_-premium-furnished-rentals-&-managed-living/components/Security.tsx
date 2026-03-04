import React, { useRef, useState, useEffect } from 'react';
import { Lock, FileText, Fingerprint } from 'lucide-react';

const Security: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cursor, setCursor] = useState({ x: -100, y: -100 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCursor({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        const current = containerRef.current;
        if (current) {
            current.addEventListener('mousemove', handleMouseMove);
            current.addEventListener('mouseenter', () => setIsHovered(true));
            current.addEventListener('mouseleave', () => setIsHovered(false));
        }

        return () => {
            if (current) {
                current.removeEventListener('mousemove', handleMouseMove);
                current.removeEventListener('mouseenter', () => setIsHovered(true));
                current.removeEventListener('mouseleave', () => setIsHovered(false));
            }
        };
    }, []);

    return (
        <section className="py-32 bg-cream border-t border-black/10 relative flex items-center justify-center">
            
            <div className="max-w-4xl mx-auto w-full px-6">
                
                {/* Confidential Stamp Header */}
                <div className="flex justify-between items-end border-b-2 border-black mb-12 pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-teal mb-2">
                             <Lock size={16} />
                             <span className="text-sm font-bold uppercase tracking-[0.2em]">Security Protocol</span>
                        </div>
                        <h2 className="text-4xl font-serif text-black">Confidential</h2>
                    </div>
                    <div className="hidden md:block text-right">
                         <p className="text-sm font-mono text-black/40 uppercase tracking-widest">Doc. No. 884-X</p>
                         <p className="text-sm font-mono text-black/40 uppercase tracking-widest">Encryption: AES-256</p>
                    </div>
                </div>

                <div 
                    ref={containerRef}
                    className="relative border border-black/10 bg-white p-12 md:p-20 text-center cursor-crosshair group overflow-hidden shadow-sm"
                >
                    <div className="absolute top-4 right-4 opacity-10">
                        <Fingerprint size={64} className="text-black" />
                    </div>

                    {/* Masked Content (Dimmed) */}
                    <div className="relative z-10 opacity-30 blur-[2px] transition-all duration-300 group-hover:opacity-10 group-hover:blur-sm text-black">
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-6">
                            Your Personal Data <br/> Is None Of Our Business.
                        </h3>
                        <p className="font-serif text-2xl italic max-w-xl mx-auto text-black/70">
                            We use bank-grade encryption for every transaction. We do not sell, share, or monetize your identity. 
                        </p>
                    </div>

                    {/* Torch Reveal Layer (Black text on White Background) */}
                    <div 
                        className="absolute inset-0 bg-black text-white flex items-center justify-center pointer-events-none z-20"
                        style={{
                            clipPath: isHovered 
                                ? `circle(180px at ${cursor.x}px ${cursor.y}px)` 
                                : 'circle(0px at 0px 0px)',
                            transition: 'clip-path 0.05s linear' // Faster transition for snappier feel
                        }}
                    >
                         <div className="p-12 md:p-20 text-center">
                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-6">
                                Your Personal Data <br/> Is None Of Our Business.
                            </h3>
                            <p className="font-serif text-2xl italic max-w-xl mx-auto opacity-80">
                                We use bank-grade encryption for every transaction. We do not sell, share, or monetize your identity. 
                            </p>
                            <div className="mt-8 inline-block border border-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                                Verified Secure
                            </div>
                         </div>
                    </div>
                    
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none border-[0.5px] border-black/5" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)' }}></div>

                </div>
            </div>
        </section>
    );
};

export default Security;