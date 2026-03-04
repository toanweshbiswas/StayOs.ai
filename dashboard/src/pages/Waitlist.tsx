import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle, XCircle, Clock, Eye, X, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'WAITLISTED', 'REJECTED'];

const statusStyle: Record<string, string> = {
    APPROVED: 'border-green-500/50 text-green-400 bg-green-500/10',
    REJECTED: 'border-red-500/50 text-red-400 bg-red-500/10',
    WAITLISTED: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
    PENDING: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
};

const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'APPROVED') return <CheckCircle size={12} />;
    if (status === 'REJECTED') return <XCircle size={12} />;
    return <Clock size={12} />;
};

function DetailModal({ app, onClose, onStatusChange }: { app: any; onClose: () => void; onStatusChange: (id: string, status: string) => void }) {
    const [updating, setUpdating] = useState(false);

    const changeStatus = async (status: string) => {
        if (status === app.status) return;
        setUpdating(true);
        await onStatusChange(app.id, status);
        setUpdating(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-serif text-white">Application Detail</h2>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-lg font-serif text-white">{app.firstName} {app.lastName}</p>
                            <p className="text-sm text-white/50 font-mono mt-1">{app.email}</p>
                            {app.phone && <p className="text-sm text-white/50 font-mono">{app.phone}</p>}
                        </div>
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded border ${statusStyle[app.status]}`}>
                            <StatusIcon status={app.status} /> {app.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Role</p>
                            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${app.role === 'TENANT' ? 'border-[#1A4D4A] text-[#1A4D4A] bg-[#1A4D4A]/10' : 'border-[#8C7B6D] text-[#8C7B6D] bg-[#8C7B6D]/10'}`}>
                                {app.role}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Applied</p>
                            <p className="text-sm text-white">{new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        {app.preferredLocation && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Preferred Location</p>
                                <p className="text-sm text-white">{app.preferredLocation}</p>
                            </div>
                        )}
                        {app.propertyLink && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Property Link</p>
                                <a href={app.propertyLink} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate block">View Property →</a>
                            </div>
                        )}
                    </div>

                    {app.message && (
                        <div className="border-t border-white/5 pt-5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Message</p>
                            <p className="text-sm text-white/70 leading-relaxed bg-[#151515] rounded-lg p-4 border border-white/5">{app.message}</p>
                        </div>
                    )}

                    <div className="border-t border-white/5 pt-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.filter(s => s !== app.status).map(s => (
                                <button key={s} disabled={updating} onClick={() => changeStatus(s)}
                                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded border transition-colors disabled:opacity-50 ${statusStyle[s]}`}>
                                    <StatusIcon status={s} /> {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Waitlist() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedApp, setSelectedApp] = useState<any>(null);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/waitlist');
            setApplications(data.applications || []);
        } catch { console.error('Failed to load waitlist'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchApplications(); }, []);

    const updateStatus = async (id: string, status: string) => {
        await api.patch(`/waitlist/${id}/status`, { status });
        await fetchApplications();
    };

    const filtered = filter === 'ALL' ? applications : applications.filter(a => a.status === filter);

    const counts: Record<string, number> = { ALL: applications.length };
    STATUS_OPTIONS.forEach(s => { counts[s] = applications.filter(a => a.status === s).length; });

    if (isLoading) return (
        <div className="flex items-center justify-center h-64 text-white/30">
            <Clock className="animate-spin mr-2" size={20} /> Loading waitlist...
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Waitlist Applications</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/50">{applications.length} total applications</p>
                </div>
                <div className="text-2xl font-serif text-[#1A4D4A] italic">{counts['PENDING'] || 0} pending</div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['ALL', ...STATUS_OPTIONS]).map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-colors ${filter === s ? 'bg-[#1A4D4A] border-[#1A4D4A] text-white' : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'}`}>
                        {s} ({counts[s] || 0})
                    </button>
                ))}
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#151515] border-b border-white/5">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Applicant</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Location</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-white/30 text-sm">No applications found.</td></tr>
                            ) : filtered.map((app: any) => (
                                <tr key={app.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                                    <td className="p-4">
                                        <p className="font-bold text-white text-sm">{app.firstName} {app.lastName}</p>
                                        <p className="text-xs text-white/40 font-mono mt-0.5">{app.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${app.role === 'TENANT' ? 'border-[#1A4D4A] text-[#1A4D4A] bg-[#1A4D4A]/10' : 'border-[#8C7B6D] text-[#8C7B6D] bg-[#8C7B6D]/10'}`}>
                                            {app.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-white/60">{app.preferredLocation || '—'}</td>
                                    <td className="p-4 text-sm text-white/50">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest w-fit px-2 py-1 rounded border ${statusStyle[app.status]}`}>
                                            <StatusIcon status={app.status} /> {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right" onClick={e => { e.stopPropagation(); setSelectedApp(app); }}>
                                        <button className="p-2 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 ml-auto text-xs font-bold uppercase tracking-widest">
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedApp && (
                <DetailModal app={selectedApp} onClose={() => setSelectedApp(null)} onStatusChange={updateStatus} />
            )}
        </div>
    );
}
