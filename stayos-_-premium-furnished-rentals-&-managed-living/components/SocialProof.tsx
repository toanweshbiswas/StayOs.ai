import React from 'react';
import { Heart, MessageCircle, Repeat, Bookmark, BadgeCheck } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

const tweets = [
  {
    id: '1',
    name: 'Anurag Mundhada',
    handle: '@anu_raag_',
    avatar: 'https://i.pravatar.cc/150?u=anu',
    verified: true,
    content: (<p>@stayos killing it with beautiful, well-furnished homes. Mine is a penthouse with a huge window overlooking a lake - very hard to beat that!</p>),
    date: 'Feb 23, 2025',
  },
  {
    id: '2',
    name: 'Garv Malik',
    handle: '@malikgarv',
    avatar: 'https://i.pravatar.cc/150?u=garv',
    verified: true,
    content: (<p>Was hunting for flats for my friend and discovered @stayos. Can't believe they have interiors like some European AirBnbs.</p>),
    date: 'Jan 30, 2025',
  },
  {
    id: '3',
    name: 'mathlover',
    handle: '@chaicoder',
    avatar: 'https://i.pravatar.cc/150?u=chai',
    verified: true,
    content: (<p>@stayos we desperately need you in ggn , pathetic homes at filthy rent elsewhere.</p>),
    date: 'Jan 29, 2025',
  },
];

const TweetCard = React.memo<{ tweet: any }>(({ tweet }) => (
  <div className="bg-white border-r border-black/10 p-8 w-[350px] md:w-[450px] flex-shrink-0 flex flex-col h-full hover:bg-[#F5F5F0] transition-colors group">
     <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all">
             <ImageWithLoader src={tweet.avatar} alt={tweet.name} className="w-full h-full object-cover" />
        </div>
        <div>
           <div className="flex items-center gap-1.5">
              <span className="font-bold text-black text-base font-serif">{tweet.name}</span>
              {tweet.verified && <BadgeCheck size={14} className="text-teal" />}
           </div>
           <div className="text-black/40 text-sm font-mono">{tweet.handle}</div>
        </div>
     </div>
     
     <div className="mb-6 text-black/80 text-xl font-serif italic leading-relaxed">"{tweet.content}"</div>
     <div className="mt-auto pt-4 border-t border-black/5 flex justify-between text-black/30 text-sm uppercase tracking-widest font-bold">
         <span>Public Opinion</span>
         <span>{tweet.date}</span>
     </div>
  </div>
));

const SocialProof: React.FC = () => {
  return (
    <section className="py-0 border-b border-black/10 bg-cream">
        <div className="flex items-stretch animate-marquee hover:[animation-play-state:paused] border-y border-black/10" style={{ animationDuration: '40s' }}>
            {[...tweets, ...tweets, ...tweets, ...tweets].map((tweet, i) => (
                <TweetCard key={`${tweet.id}-${i}`} tweet={tweet} />
            ))}
        </div>
    </section>
  );
};

export default SocialProof;