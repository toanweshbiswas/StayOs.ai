import React, { useEffect, useRef, useState } from 'react';
import ImageWithLoader from './ImageWithLoader';
import { ArrowUpRight, Calendar, User, ArrowRight } from 'lucide-react';

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
    return () => {
        if(current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const blogs = [
    {
        id: 1,
        title: "Why we stopped using 'Beige' in our homes",
        excerpt: "Minimalism doesn't mean boring. Here is how we use color psychology to make small spaces feel massive.",
        category: "Design",
        author: "Riya S.",
        date: "Oct 12, 2024",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
        featured: true
    },
    {
        id: 2,
        title: "The Indiranagar Guide: Coffee, Co-working & Chaos",
        excerpt: "A local's guide to surviving and thriving in Bangalore's most happening neighborhood.",
        category: "City Guide",
        author: "Ankit M.",
        date: "Oct 08, 2024",
        image: "https://images.unsplash.com/photo-1595558171881-1c64d44492c9?auto=format&fit=crop&q=80&w=800",
        featured: false
    },
    {
        id: 3,
        title: "How to split chores without killing your flatmate",
        excerpt: "We built an app for this, but here is the analog way to keep the peace.",
        category: "Living",
        author: "Team StayOs",
        date: "Sep 28, 2024",
        image: "https://images.unsplash.com/photo-1581578731117-104f2a41272c?auto=format&fit=crop&q=80&w=800",
        featured: false
    },
    {
        id: 4,
        title: "Investing in Real Estate vs. Mutual Funds in 2025",
        excerpt: "Data-backed analysis on where young professionals should park their money.",
        category: "Finance",
        author: "Varun K.",
        date: "Sep 15, 2024",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
        featured: false
    },
    {
        id: 5,
        title: "5 Plants that won't die on you (we promise)",
        excerpt: "Greenery makes a house a home. Here are the toughest plants for busy professionals.",
        category: "Design",
        author: "Simran J.",
        date: "Aug 30, 2024",
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800",
        featured: false
    }
];

const BlogPage: React.FC = () => {
    const featuredPost = blogs.find(b => b.featured);
    const regularPosts = blogs.filter(b => !b.featured);

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20 font-sans text-black overflow-x-hidden">
            
            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                
                {/* Header - Editorial Style */}
                <section className="text-center mb-16 border-b-2 border-black pb-8">
                    <FadeInSection>
                        <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-2 text-black">The Journal</h1>
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-black/50">Design • Culture • Life</p>
                    </FadeInSection>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-black/20 pb-20 mb-20">
                    
                    {/* Featured Post - Main Story */}
                    <div className="lg:col-span-8 border-r border-black/10 pr-0 lg:pr-12">
                        {featuredPost && (
                            <FadeInSection>
                                <div className="group cursor-pointer">
                                    <div className="w-full aspect-[16/9] mb-8 overflow-hidden border border-black/10 p-1 bg-white">
                                        <ImageWithLoader 
                                            src={featuredPost.image} 
                                            alt={featuredPost.title} 
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] grayscale group-hover:grayscale-0 group-hover:scale-105"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-teal mb-4">
                                        <span>{featuredPost.category}</span>
                                        <span className="w-1 h-1 bg-teal rounded-full"></span>
                                        <span className="text-black/60">{featuredPost.date}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold leading-[0.95] mb-6 group-hover:underline decoration-1 underline-offset-8 decoration-black/30 text-black">{featuredPost.title}</h2>
                                    <p className="text-xl md:text-2xl text-black/70 font-serif leading-relaxed mb-8">{featuredPost.excerpt}</p>
                                    
                                    <div className="flex items-center justify-between border-t border-black/10 pt-4 mt-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold uppercase tracking-widest text-black/40 mb-1">Written By</span>
                                            <span className="text-xl font-serif italic text-black">{featuredPost.author}</span>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-black/40">Est. read 5 min</span>
                                    </div>
                                </div>
                            </FadeInSection>
                        )}
                    </div>

                    {/* Sidebar / Recent Posts */}
                    <div className="lg:col-span-4 flex flex-col gap-0">
                         <h3 className="text-xl font-serif italic border-b border-black/20 pb-4 mb-8 text-black">Recent Stories</h3>
                         
                         {regularPosts.map((post, idx) => (
                            <FadeInSection key={post.id} delay={idx * 100}>
                                <div className="group cursor-pointer border-b border-black/10 py-8 first:pt-0">
                                    <div className="flex gap-4 mb-4">
                                        <div className="text-sm font-bold uppercase tracking-widest text-black/40">{post.category}</div>
                                    </div>
                                    <h3 className="text-xl font-serif leading-tight mb-3 group-hover:text-teal transition-colors text-black">{post.title}</h3>
                                    <p className="text-black/60 leading-relaxed mb-4 text-base line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center justify-between mt-4">
                                         <span className="text-xs font-bold uppercase tracking-widest text-black/30">By {post.author}</span>
                                         <div className="flex items-center gap-2 text-black font-bold text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
                                            Read <ArrowRight size={12} />
                                         </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>

                </div>

                {/* Newsletter - Boxed Ad Style */}
                <section className="bg-black text-white p-12 md:p-16 border-[10px] border-double border-white/20 relative overflow-hidden">
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-6xl font-serif mb-6">Stay in the loop.</h2>
                        <p className="text-lg md:text-xl font-serif italic text-white/60 mb-10">Get the latest stories, home tours, and design tips delivered to your inbox. No spam, we promise.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-0 border border-white">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="flex-1 px-6 py-4 bg-transparent focus:outline-none text-lg placeholder-white/40 font-serif text-white"
                            />
                            <button className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/80 transition-colors border-l border-white">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default BlogPage;