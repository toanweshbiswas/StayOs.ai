import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, CheckCircle, Loader2, Share2, Send, X } from 'lucide-react';
import { api } from '../services/api';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showApply, setShowApply] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;
        api.get(`/careers/${id}`)
            .then(({ data }) => setJob(data))
            .catch(() => console.error('Failed to load job'))
            .finally(() => setIsLoading(false));
    }, [id]);

    const shareLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center pt-24">
            <Loader2 size={48} className="animate-spin text-clay" />
        </div>
    );

    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4">
            <h2 className="text-4xl font-serif text-ink mb-4">Opening Not Found</h2>
            <Link to="/careers" className="text-clay underline font-bold uppercase tracking-widest text-sm">← Back to Careers</Link>
        </div>
    );

    const requirements: string[] = job.requirements
        ? job.requirements.split(/[\n,]/).map((r: string) => r.trim()).filter(Boolean)
        : [];

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20 font-sans">
            <div className="max-w-[1000px] mx-auto px-4 md:px-8">

                {/* Back */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-clay transition-colors mb-8">
                    <ArrowLeft size={14} /> Back to Careers
                </button>

                {/* Header */}
                <div className="border-b-2 border-ink pb-6 mb-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-ink text-cream px-3 py-1 mb-4 inline-block">
                                {job.department}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif text-ink mt-3 mb-3">{job.title}</h1>
                            <div className="flex flex-wrap gap-4 text-ink/50 text-xs font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                                <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {job.experience}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={shareLink}
                                className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${copied ? 'border-teal text-teal' : 'border-ink/20 text-ink hover:border-clay hover:text-clay'}`}
                            >
                                {copied ? <><CheckCircle size={13} /> Copied!</> : <><Share2 size={13} /> Share</>}
                            </button>
                            <button
                                onClick={() => setShowApply(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-clay text-white text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors rounded-sm"
                            >
                                <Send size={13} /> Apply Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left: Description + Requirements */}
                    <div className="lg:col-span-2 space-y-10">

                        <div>
                            <h2 className="text-2xl font-serif text-ink mb-4">About the Role</h2>
                            <div className="text-ink/70 leading-relaxed whitespace-pre-line">{job.description}</div>
                        </div>

                        {requirements.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-serif text-ink mb-4">What We're Looking For</h2>
                                <ul className="space-y-3">
                                    {requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 text-ink/70">
                                            <div className="w-1 h-1 bg-teal mt-2.5 flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="border-t border-ink/10 pt-6">
                            <p className="text-ink/50 text-sm mb-3">Don't check every box? Apply anyway — we care about potential.</p>
                            <button
                                onClick={() => setShowApply(true)}
                                className="px-8 py-3 bg-clay text-white text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors rounded-sm"
                            >
                                Send Application
                            </button>
                        </div>
                    </div>

                    {/* Right: Job card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 border border-ink/10 p-6 bg-white shadow-sm space-y-4">
                            <h3 className="font-serif text-xl text-ink">{job.title}</h3>
                            <div className="space-y-2 text-sm text-ink/60 border-t border-ink/10 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Department</span>
                                    <span>{job.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Type</span>
                                    <span>{job.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Location</span>
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Experience</span>
                                    <span>{job.experience}</span>
                                </div>
                            </div>
                            <button onClick={() => setShowApply(true)} className="w-full py-3 text-center bg-clay text-white text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors rounded-sm">
                                Apply for This Role
                            </button>
                            <button onClick={shareLink} className="w-full flex items-center justify-center gap-2 py-2.5 border border-ink/20 text-ink text-xs font-bold uppercase tracking-widest hover:border-clay hover:text-clay transition-colors rounded-sm">
                                {copied ? <><CheckCircle size={12} className="text-teal" /> Copied!</> : <><Share2 size={12} /> Share Opening</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {showApply && (
                <ApplyModal job={job} onClose={() => setShowApply(false)} />
            )}
        </div>
    );
};

function ApplyModal({ job, onClose }: { job: any; onClose: () => void }) {
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', resumeUrl: '', coverLetter: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        if (!form.firstName || !form.email) {
            setError('First name and email are required.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await api.post(`/careers/${job.id}/apply`, form);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit application.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-cream w-full max-w-lg border border-ink/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
                    <div>
                        <h3 className="font-serif text-xl text-ink">Apply for {job.title}</h3>
                        <p className="text-xs text-ink/50 font-mono mt-0.5">{job.department} · {job.location}</p>
                    </div>
                    <button onClick={onClose} className="text-ink/40 hover:text-ink p-2"><X size={18} /></button>
                </div>

                {success ? (
                    <div className="p-8 text-center">
                        <CheckCircle size={48} className="text-teal mx-auto mb-4" />
                        <h4 className="text-2xl font-serif text-ink mb-2">Application Received</h4>
                        <p className="text-ink/60 text-sm">We'll review your application and be in touch soon.</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 border border-ink/20 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-cream transition-colors">Close</button>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">First Name *</label>
                                <input value={form.firstName} onChange={e => setF('firstName', e.target.value)} className="w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink" placeholder="Jane" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">Last Name</label>
                                <input value={form.lastName} onChange={e => setF('lastName', e.target.value)} className="w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink" placeholder="Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">Email *</label>
                            <input type="email" value={form.email} onChange={e => setF('email', e.target.value)} className="w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink" placeholder="jane@example.com" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">Phone</label>
                            <input value={form.phone} onChange={e => setF('phone', e.target.value)} className="w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">Resume URL (LinkedIn / Drive)</label>
                            <input value={form.resumeUrl} onChange={e => setF('resumeUrl', e.target.value)} className="w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">Cover Letter</label>
                            <textarea value={form.coverLetter} onChange={e => setF('coverLetter', e.target.value)} rows={4} className="w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink resize-none" placeholder="Tell us why you're interested..." />
                        </div>

                        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={onClose} className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-ink/20 text-ink/60 hover:text-ink transition-colors">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-clay text-white text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors disabled:opacity-50">
                                {submitting ? <><Loader2 size={13} className="animate-spin" /> Sending...</> : <><Send size={13} /> Submit Application</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobDetail;
