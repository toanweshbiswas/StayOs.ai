import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/careers')
      .then(({ data }) => setJobs(data.filter((j: any) => j.isActive)))
      .catch(() => setJobs([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 font-sans text-black overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">

        {/* Header - Classifieds Style */}
        <section className="mb-20 text-center border-b-4 border-black pb-8">
          <FadeInSection>
            <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-tight mb-2 text-black">Help Wanted</h1>
            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-black/50 border-t border-black/20 pt-4 mt-4">
              <span>Section D: Employment</span>
              <span>{isLoading ? '...' : `${jobs.length} Open Roles`}</span>
              <span>Equal Opportunity</span>
            </div>
          </FadeInSection>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <FadeInSection>
              <div className="bg-white border border-black/10 p-8 mb-8 shadow-sm">
                <h3 className="text-xl font-serif mb-4 text-black">Why join?</h3>
                <p className="text-black/60 text-base leading-relaxed mb-6">
                  We are a team of misfits building the future of urban living. If you think renting is broken, come help us fix it.
                </p>
                <ul className="space-y-3 text-base font-mono text-black/80">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-teal" />High Autonomy</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-teal" />Competitive Equity</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-teal" />Beautiful Office</li>
                </ul>
              </div>

              <div className="p-2 border border-black/10 bg-white rotate-1 w-full max-w-[300px] mx-auto lg:mx-0 shadow-lg">
                <div className="aspect-square bg-gray-200 grayscale">
                  <ImageWithLoader src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" alt="Office" className="w-full h-full object-cover" />
                </div>
                <p className="text-black text-center font-serif text-sm mt-2">Fig 1: The HQ</p>
              </div>
            </FadeInSection>
          </div>

          {/* Job List */}
          <div className="lg:col-span-8">
            <div className="border border-black/10 bg-white shadow-sm">
              <div className="grid grid-cols-12 border-b border-black/10 bg-black/5 text-xs font-bold uppercase tracking-widest py-3 px-4 text-black/50">
                <div className="col-span-2">Dept</div>
                <div className="col-span-6">Position</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2 text-right">Apply</div>
              </div>

              {isLoading ? (
                <div className="py-16 flex items-center justify-center gap-3 text-black/40">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm font-bold uppercase tracking-widest">Loading openings...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="py-16 text-center text-black/40">
                  <p className="text-sm font-bold uppercase tracking-widest">No openings right now.</p>
                  <p className="text-sm mt-2">Email us at <a href="mailto:careers@stayos.in" className="text-teal underline">careers@stayos.in</a></p>
                </div>
              ) : jobs.map((job: any, idx: number) => (
                <FadeInSection key={job.id} delay={idx * 50}>
                  <Link
                    to={`/careers/${job.id}`}
                    className="grid grid-cols-12 border-b border-black/10 hover:bg-black hover:text-white transition-colors py-5 px-4 items-center group cursor-pointer text-black"
                  >
                    <div className="col-span-2 font-mono text-xs opacity-50 truncate">{job.department}</div>
                    <div className="col-span-6">
                      <h3 className="text-lg font-bold font-serif">{job.title}</h3>
                      <span className="text-sm uppercase tracking-wider opacity-60">{job.location} · {job.experience}</span>
                    </div>
                    <div className="col-span-2 text-sm font-medium opacity-80">{job.type}</div>
                    <div className="col-span-2 text-right">
                      <span className="w-8 h-8 border border-current rounded-full flex items-center justify-center ml-auto group-hover:rotate-45 transition-transform">
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>

            <div className="mt-12 text-center p-8 border border-dashed border-black/20">
              <p className="text-black/60 mb-4">Don't see your role?</p>
              <a href="mailto:careers@stayos.in" className="text-teal font-serif italic text-xl underline">Email the Editor</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;