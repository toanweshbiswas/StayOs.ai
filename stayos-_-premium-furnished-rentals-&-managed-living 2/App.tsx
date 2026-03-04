import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TopBanner from '@/components/TopBanner';
import BottomBanner from '@/components/BottomBanner';
import Hero from '@/components/Hero';
import ShowcaseCarousel from '@/components/ShowcaseCarousel';
import TextReveal from '@/components/TextReveal';
import Stats from '@/components/Stats';
import Marquee from '@/components/Marquee';
import Neighborhoods from '@/components/Neighborhoods';
import Community from '@/components/Community';
import ComingSoon from '@/components/ComingSoon';
import SocialProof from '@/components/SocialProof';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Security from '@/components/Security';
import SEO from '@/components/SEO';
import { featuredHomes } from './data';
import { MessageCircle, Loader2 } from 'lucide-react';

// Lazy Load Pages for Performance
const AllHomes = lazy(() => import('@/components/AllHomes'));
const OSPage = lazy(() => import('@/components/OSPage'));
const BFFPage = lazy(() => import('@/components/BFFPage'));
const OurStory = lazy(() => import('@/components/OurStory'));
const CareersPage = lazy(() => import('@/components/CareersPage'));
const BlogPage = lazy(() => import('@/components/BlogPage'));
const WaitlistPage = lazy(() => import('@/components/WaitlistPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="animate-spin text-teal" size={48} />
  </div>
);

const MainPage = () => (
  <>
    <SEO 
      title="Premium Furnished Rentals & Managed Living in Bengaluru" 
      description="Rent premium furnished homes in Indiranagar, Koramangala, and HSR Layout without brokerage. StayOs offers managed living with flexible leases and instant deposit refunds."
    />
    <Hero />
    <TextReveal />
    <ShowcaseCarousel homes={featuredHomes} />
    <Stats />
    <Marquee />
    <Security />
    <Neighborhoods />
    <Community />
    <ComingSoon />
    <SocialProof />
    <FAQ />
  </>
);

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink relative pt-10">
      {/* Global Texture Overlays */}
      <div className="paper-texture" />
      <div className="vignette-overlay" />

      <ScrollToTop />
      <TopBanner />
      <Navbar />
      
      <main className="relative z-10 min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
             <Route path="/" element={<MainPage />} />
             <Route path="/listings" element={
               <>
                 <SEO title="Curated Listings | Zero Brokerage Homes" description="Browse our curated list of premium furnished apartments in Bengaluru's top neighborhoods. No brokerage, fully managed." />
                 <AllHomes />
               </>
             } />
             <Route path="/operating-system" element={
               <>
                 <SEO title="The Living OS | Managed Rental Experience" description="Discover the StayOs Operating System. Automated rent payments, on-demand services, and seamless property management for owners and tenants." />
                 <OSPage />
               </>
             } />
             <Route path="/zero-brokerage" element={
               <>
                 <SEO title="Zero Brokerage Policy | Transparent Rentals" description="Our Zero Brokerage promise. Save thousands on your move with direct-to-owner listings and transparent pricing." />
                 <BFFPage />
               </>
             } />
             <Route path="/manifesto" element={
               <>
                 <SEO title="Our Manifesto | The Future of Living" description="Read our manifesto. Why we are rebuilding the rental experience from the ground up for the modern urban citizen." />
                 <OurStory />
               </>
             } />
             <Route path="/careers" element={
               <>
                 <SEO title="Careers | Join the Team" description="Help us build the future of living. View open positions in Engineering, Design, Operations, and Marketing at StayOs." />
                 <CareersPage />
               </>
             } />
             <Route path="/journal" element={
               <>
                 <SEO title="The Journal | Design & City Culture" description="Stories on interior design, city guides, and modern living. The StayOs Journal covers everything from decor to financial wellness." />
                 <BlogPage />
               </>
             } />
             <Route path="/apply" element={
               <>
                 <SEO title="Apply for Membership | Join Waitlist" description="Apply for StayOs membership. Get early access to new home drops and exclusive community benefits." />
                 <WaitlistPage />
               </>
             } />
             {/* Redirects for old routes */}
             <Route path="/classifieds" element={<AllHomes />} />
             <Route path="/og-os" element={<OSPage />} />
             <Route path="/bff" element={<BFFPage />} />
             <Route path="/story" element={<OurStory />} />
             <Route path="/blogs" element={<BlogPage />} />
             <Route path="/join-waitlist" element={<WaitlistPage />} />
             
             <Route path="*" element={<MainPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <BottomBanner />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/"
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-14 right-6 z-[70] bg-clay text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-white/20"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;