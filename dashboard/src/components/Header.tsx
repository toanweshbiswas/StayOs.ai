import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const paths: Record<string, string> = {
    '/': 'Overview',
    '/properties': 'Properties',
    '/waitlist': 'Waitlist Applications',
    '/maintenance': 'Maintenance Requests',
    '/blog': 'Editorial & Journal',
    '/careers': 'Careers & Applications',
};

export default function Header() {
    const { pathname } = useLocation();
    const title = paths[pathname] || 'Dashboard';
    const { user } = useAuth();

    return (
        <header className="h-20 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                {/* Mobile menu button could go here */}
                <h2 className="text-xl md:text-2xl font-serif text-white">{title}</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-[#2A2A2A] rounded-full px-4 py-2 border border-white/5 focus-within:border-[#1A4D4A] focus-within:ring-1 focus-within:ring-[#1A4D4A] transition-all">
                    <Search size={16} className="text-white/40 mr-2" />
                    <input
                        type="text"
                        placeholder="Search OS..."
                        className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-48"
                    />
                </div>

                <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1A4D4A] rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none">{user?.firstName}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#1A4D4A] mt-1">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center font-serif text-lg text-white">
                        {user?.firstName?.[0] || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
