import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Building2, Users, Wrench, FileText, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, link }: any) => (
    <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={20} />
            </div>
            <Link to={link} className="text-white/30 hover:text-white transition-colors">
                <ArrowUpRight size={20} />
            </Link>
        </div>
        <div className="mb-1">
            <h3 className="text-3xl font-serif text-white">{value}</h3>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">{title}</p>
        <p className="text-[10px] text-white/30 tracking-wider">{subtext}</p>
    </div>
);

export default function Overview() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>Error loading data.</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="border-b border-white/10 pb-6 mb-8">
                <h1 className="text-3xl font-serif text-white mb-2">Welcome Back</h1>
                <p className="text-sm font-bold uppercase tracking-widest text-[#1A4D4A]">StayOs Live Metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Properties"
                    value={stats.properties.total}
                    subtext={`${stats.properties.available} currently available`}
                    icon={Building2}
                    colorClass="bg-[#1A4D4A]/20 text-[#1A4D4A]"
                    link="/properties"
                />
                <StatCard
                    title="Waitlist Apps"
                    value={stats.waitlist.total}
                    subtext={`${stats.waitlist.pending} pending review`}
                    icon={Users}
                    colorClass="bg-blue-500/20 text-blue-400"
                    link="/waitlist"
                />
                <StatCard
                    title="Open Maintenance"
                    value={stats.maintenance.open}
                    subtext="Requires immediate attention"
                    icon={Wrench}
                    colorClass="bg-orange-500/20 text-orange-400"
                    link="/maintenance"
                />
                <StatCard
                    title="Published Journals"
                    value={stats.blog.published}
                    subtext={`out of ${stats.blog.total} total posts`}
                    icon={FileText}
                    colorClass="bg-[#8C7B6D]/20 text-[#8C7B6D]"
                    link="/blog"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Recent Waitlist */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
                        <h3 className="font-serif text-xl text-white">Recent Applications</h3>
                        <Link to="/waitlist" className="text-xs font-bold uppercase tracking-widest text-[#1A4D4A] hover:text-white transition-colors">View All</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {stats.recent.waitlist.map((app: any, i: number) => (
                            <div key={i} className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="font-bold text-white text-sm">{app.firstName} {app.lastName}</p>
                                    <p className="text-xs text-white/40 font-mono mt-1">{app.email}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${app.role === 'TENANT' ? 'border-[#1A4D4A] text-[#1A4D4A] bg-[#1A4D4A]/10' : 'border-[#8C7B6D] text-[#8C7B6D] bg-[#8C7B6D]/10'}`}>
                                        {app.role}
                                    </span>
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Maintenance */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
                        <h3 className="font-serif text-xl text-white">Open Tickets</h3>
                        <Link to="/maintenance" className="text-xs font-bold uppercase tracking-widest text-[#1A4D4A] hover:text-white transition-colors">View All</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {stats.recent.maintenance.length === 0 ? (
                            <div className="p-12 text-center text-white/30 text-sm font-bold uppercase tracking-wider">No open tickets</div>
                        ) : stats.recent.maintenance.map((req: any, i: number) => (
                            <div key={i} className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="font-bold text-white text-sm">{req.title}</p>
                                    <p className="text-xs text-[#1A4D4A] font-bold uppercase tracking-widest mt-1">{req.property.name}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${req.priority === 'high' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                                            req.priority === 'medium' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' :
                                                'border-white/20 text-white/50 bg-white/5'
                                        }`}>
                                        {req.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
