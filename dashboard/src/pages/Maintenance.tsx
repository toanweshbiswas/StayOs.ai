import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Maintenance() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/maintenance');
            setRequests(data);
        } catch (error) {
            console.error('Failed to load maintenance requests', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/maintenance/${id}/status`, { status });
            fetchRequests();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (isLoading) return <div>Loading maintenance requests...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Maintenance Requests</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/50">Manage tenant service tickets</p>
                </div>
                <div className="text-xl font-serif text-[#1A4D4A] italic">{requests.length} Open</div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#151515] border-b border-white/5">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Ticket Details</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Property</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Tenant</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Priority</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-white/30">No maintenance requests found.</td></tr>
                            ) : requests.map((req: any) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-white text-sm">{req.title}</p>
                                        <p className="text-xs text-white/40 mt-1">{req.description}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-[#1A4D4A] mt-2">{req.category}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-bold">{req.property.name}</p>
                                        <p className="text-xs text-white/50">{req.property.location}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm">{req.tenant.firstName} {req.tenant.lastName}</p>
                                        <p className="text-xs text-white/50 font-mono">{req.tenant.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${req.priority === 'high' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                                                req.priority === 'medium' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' :
                                                    'border-white/20 text-white/50 bg-white/5'
                                            }`}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${req.status === 'RESOLVED' ? 'text-green-400' :
                                                req.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-orange-400'
                                            }`}>
                                            {req.status === 'RESOLVED' && <CheckCircle size={14} />}
                                            {req.status === 'IN_PROGRESS' && <Clock size={14} />}
                                            {req.status === 'OPEN' && <AlertCircle size={14} />}
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {req.status !== 'RESOLVED' && (
                                            <button onClick={() => updateStatus(req.id, 'RESOLVED')} className="p-2 border border-green-500/20 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Mark as Resolved">
                                                <CheckCircle size={16} /> Mark Resolved
                                            </button>
                                        )}
                                        {req.status === 'OPEN' && (
                                            <button onClick={() => updateStatus(req.id, 'IN_PROGRESS')} className="p-2 border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Mark In Progress">
                                                <Clock size={16} /> In Progress
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
