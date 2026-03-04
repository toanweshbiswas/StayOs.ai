import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Wrench, FileText, Briefcase, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Building2, label: 'Properties', path: '/properties' },
    { icon: Users, label: 'Waitlist', path: '/waitlist' },
    { icon: Wrench, label: 'Maintenance', path: '/maintenance' },
    { icon: FileText, label: 'Journal', path: '/blog' },
    { icon: Briefcase, label: 'Careers', path: '/careers' },
];

export default function Sidebar() {
    const { logout } = useAuth();

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${isActive ? 'bg-[#1A4D4A] text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`;

    return (
        <aside className="w-64 bg-[#151515] border-r border-white/5 flex flex-col h-screen sticky top-0 hidden md:flex">
            <div className="p-8 border-b border-white/5">
                <h1 className="text-2xl font-serif font-black tracking-tight text-white mb-1">
                    StayOs<span className="text-[#1A4D4A]">.</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Operating System</p>
            </div>

            <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                <div className="text-xs font-bold uppercase tracking-widest text-white/20 px-4 mb-4">Modules</div>
                {navItems.map((item) => (
                    <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navLinkClass}>
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-1">
                <NavLink to="/settings" className={navLinkClass}>
                    <Settings size={18} />
                    Settings
                </NavLink>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-bold uppercase tracking-wider text-red-400 hover:bg-red-400/10 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

