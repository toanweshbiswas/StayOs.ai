import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, CheckCircle, XCircle, Clock, FileText, X, Save, Loader2, Briefcase, Link2 } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Design', 'Operations', 'Marketing', 'Finance', 'Customer Success'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_OPTIONS = ['0-1 years', '1-2 years', '2-4 years', '3-5 years', '4-6 years', '5+ years'];

const emptyJobForm = {
    title: '', department: 'Engineering', location: 'Bengaluru, India',
    type: 'Full-time', experience: '2-4 years', description: '', requirements: '', isActive: true,
};

const WEBSITE_URL = (typeof window !== 'undefined' && window.location.port === '5174')
    ? 'http://localhost:5173'
    : window.location.origin.replace(':5174', ':5173');

function CopyLinkButton({ jobId }: { jobId: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        const url = `${WEBSITE_URL}/#/careers/${jobId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={copy} className={`p-2 border rounded-lg transition-colors text-xs ${copied ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/10 text-white/70 hover:text-white hover:bg-white/10'}`} title="Copy shareable link">
            {copied ? '✓' : <Link2 size={15} />}
        </button>
    );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-serif text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={18} /></button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">{children}</div>
            </div>
        </div>
    );
}

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            <input {...props} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1A4D4A] transition-colors" />
        </div>
    );
}

function SelectField({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            <select {...props} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#1A4D4A] transition-colors">
                {children}
            </select>
        </div>
    );
}

function TextAreaField({ label, rows = 4, ...props }: { label: string; rows?: number } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            <textarea {...props} rows={rows} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1A4D4A] transition-colors resize-none" />
        </div>
    );
}

export default function Careers() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
    const [showJobModal, setShowJobModal] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [jobForm, setJobForm] = useState({ ...emptyJobForm });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [{ data: jData }, { data: aData }] = await Promise.all([
                api.get('/careers/admin'),
                api.get('/careers/applications'),
            ]);
            setJobs(jData);
            setApplications(aData);
        } catch { console.error('Failed to load data'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddJob = () => {
        setEditingJob(null);
        setJobForm({ ...emptyJobForm });
        setError('');
        setShowJobModal(true);
    };

    const openEditJob = (job: any) => {
        setEditingJob(job);
        setJobForm({
            title: job.title || '', department: job.department || 'Engineering',
            location: job.location || 'Bengaluru, India', type: job.type || 'Full-time',
            experience: job.experience || '2-4 years', description: job.description || '',
            requirements: job.requirements || '', isActive: job.isActive ?? true,
        });
        setError('');
        setShowJobModal(true);
    };

    const handleSaveJob = async () => {
        if (!jobForm.title || !jobForm.description) {
            setError('Title and description are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            if (editingJob) {
                await api.put(`/careers/${editingJob.id}`, jobForm);
            } else {
                await api.post('/careers', jobForm);
            }
            setShowJobModal(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save job.');
        } finally {
            setSaving(false);
        }
    };

    const toggleJobStatus = async (job: any) => {
        try { await api.put(`/careers/${job.id}`, { ...job, isActive: !job.isActive }); fetchData(); }
        catch { console.error('Failed to toggle job status'); }
    };

    const updateAppStatus = async (id: string, status: string) => {
        try { await api.patch(`/careers/applications/${id}/status`, { status }); fetchData(); }
        catch { console.error('Failed to update application status'); }
    };

    const setJ = (k: string, v: any) => setJobForm(f => ({ ...f, [k]: v }));

    if (isLoading) return (
        <div className="flex items-center justify-center h-64 text-white/30">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading careers portal...
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Careers Portal</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                        {jobs.filter(j => j.isActive).length} open roles · {applications.filter(a => a.status === 'PENDING').length} pending applications
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-[#151515] p-1 rounded-lg border border-white/5">
                        <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeTab === 'jobs' ? 'bg-[#1A4D4A] text-white' : 'text-white/50 hover:text-white'}`}>
                            Jobs ({jobs.length})
                        </button>
                        <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeTab === 'applications' ? 'bg-[#1A4D4A] text-white' : 'text-white/50 hover:text-white'}`}>
                            Applications ({applications.length})
                        </button>
                    </div>
                    {activeTab === 'jobs' && (
                        <button onClick={openAddJob} className="bg-[#1A4D4A] hover:bg-[#1A4D4A]/80 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                            <Plus size={16} /> Add Opening
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                {activeTab === 'jobs' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#151515] border-b border-white/5">
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Department</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Applicants</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {jobs.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-white/30 text-sm">
                                        <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
                                        No job openings yet. Click "Add Opening" to post one.
                                    </td></tr>
                                ) : jobs.map((job: any) => (
                                    <tr key={job.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-white text-sm">{job.title}</p>
                                            <p className="text-xs text-white/40 mt-1">{job.location} · {job.type} · {job.experience}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] uppercase tracking-widest text-[#1A4D4A] px-2 py-1 rounded-sm border border-[#1A4D4A]/30 bg-[#1A4D4A]/10 whitespace-nowrap">
                                                {job.department}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => toggleJobStatus(job)}
                                                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border transition-colors ${job.isActive ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/20 text-white/50 bg-white/5'}`}>
                                                {job.isActive ? 'Active' : 'Closed'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-lg font-serif italic text-white/70">{job._count?.applications ?? 0}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <CopyLinkButton jobId={job.id} />
                                                <button onClick={() => openEditJob(job)} className="p-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#151515] border-b border-white/5">
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Candidate</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Files</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {applications.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-white/30 text-sm">No applications yet.</td></tr>
                                ) : applications.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-white text-sm">{app.firstName} {app.lastName}</p>
                                            <p className="text-xs text-white/40 font-mono mt-0.5">{app.email}</p>
                                        </td>
                                        <td className="p-4 text-sm text-white/70">{app.job?.title}</td>
                                        <td className="p-4">
                                            {app.resumeUrl ? (
                                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="p-2 border border-white/10 hover:bg-white/10 rounded text-blue-400 transition-colors inline-flex" title="Resume">
                                                    <FileText size={15} />
                                                </a>
                                            ) : <span className="text-xs text-white/30">No resume</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest w-fit ${app.status === 'APPROVED' ? 'text-green-400' : app.status === 'REJECTED' ? 'text-red-400' : 'text-blue-400'}`}>
                                                {app.status === 'APPROVED' && <CheckCircle size={12} />}
                                                {app.status === 'REJECTED' && <XCircle size={12} />}
                                                {app.status === 'PENDING' && <Clock size={12} />}
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {app.status === 'PENDING' && (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => updateAppStatus(app.id, 'APPROVED')} className="p-2 border border-green-500/20 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle size={15} />
                                                    </button>
                                                    <button onClick={() => updateAppStatus(app.id, 'REJECTED')} className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Reject">
                                                        <XCircle size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showJobModal && (
                <Modal title={editingJob ? `Edit: ${editingJob.title}` : 'Post New Opening'} onClose={() => setShowJobModal(false)}>
                    <div className="space-y-4">
                        <InputField label="Job Title *" value={jobForm.title} onChange={e => setJ('title', e.target.value)} placeholder="Senior Software Engineer" />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Department" value={jobForm.department} onChange={e => setJ('department', e.target.value)}>
                                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                            </SelectField>
                            <SelectField label="Job Type" value={jobForm.type} onChange={e => setJ('type', e.target.value)}>
                                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                            </SelectField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Location" value={jobForm.location} onChange={e => setJ('location', e.target.value)} placeholder="Bengaluru, India" />
                            <SelectField label="Experience" value={jobForm.experience} onChange={e => setJ('experience', e.target.value)}>
                                {EXPERIENCE_OPTIONS.map(e => <option key={e}>{e}</option>)}
                            </SelectField>
                        </div>
                        <TextAreaField label="Job Description *" rows={4} value={jobForm.description} onChange={e => setJ('description', e.target.value)} placeholder="What this role involves, what the team looks like..." />
                        <TextAreaField label="Requirements (one per line or comma-separated)" rows={4} value={jobForm.requirements} onChange={e => setJ('requirements', e.target.value)} placeholder="React, Node.js, 3+ years experience..." />
                        <div className="flex items-center gap-3 pt-2">
                            <button onClick={() => setJ('isActive', !jobForm.isActive)} className={`w-10 h-6 rounded-full transition-colors relative ${jobForm.isActive ? 'bg-green-500' : 'bg-white/10'}`}>
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${jobForm.isActive ? 'left-5' : 'left-1'}`} />
                            </button>
                            <span className="text-sm text-white/70">{jobForm.isActive ? 'Actively hiring' : 'Saved as closed'}</span>
                        </div>
                    </div>

                    {error && <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                        <button onClick={() => setShowJobModal(false)} className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleSaveJob} disabled={saving} className="px-6 py-2 text-sm font-bold uppercase tracking-widest bg-[#1A4D4A] text-white rounded-lg hover:bg-[#1A4D4A]/80 transition-colors disabled:opacity-50 flex items-center gap-2">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {saving ? 'Saving...' : editingJob ? 'Save Changes' : 'Post Opening'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
