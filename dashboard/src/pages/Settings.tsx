import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Shield, Key, Plus, Trash2, X, Loader2, Mail, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = ['ADMIN', 'EDITOR', 'VIEWER'] as const;
type Role = typeof ROLE_OPTIONS[number];

const roleStyle: Record<Role, string> = {
    ADMIN: 'border-[#1A4D4A] text-[#1A4D4A] bg-[#1A4D4A]/10',
    EDITOR: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
    VIEWER: 'border-white/20 text-white/50 bg-white/5',
};

const TABS = [
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'permissions', label: 'Roles & Permissions', icon: Shield },
    { id: 'password', label: 'Change Password', icon: Key },
];

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            <input {...props} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1A4D4A] transition-colors" />
        </div>
    );
}

function Alert({ type, children }: { type: 'success' | 'error'; children: React.ReactNode }) {
    return (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {type === 'success' ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
            {children}
        </div>
    );
}

// --- TEAM TAB ---
function TeamTab() {
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'EDITOR' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/admin/team');
            setMembers(data);
        } catch { setMembers([]); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchMembers(); }, []);

    const invite = async () => {
        if (!inviteForm.firstName || !inviteForm.email || !inviteForm.password) {
            setMsg({ type: 'error', text: 'First name, email, and password are required.' });
            return;
        }
        setSaving(true);
        setMsg(null);
        try {
            await api.post('/admin/team', inviteForm);
            setMsg({ type: 'success', text: `${inviteForm.firstName} has been added to the team.` });
            setInviteForm({ firstName: '', lastName: '', email: '', password: '', role: 'EDITOR' });
            setShowInvite(false);
            fetchMembers();
        } catch (err: any) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add member.' });
        } finally { setSaving(false); }
    };

    const removeMember = async (id: string, name: string) => {
        if (!confirm(`Remove ${name} from the team?`)) return;
        try {
            await api.delete(`/admin/team/${id}`);
            fetchMembers();
        } catch { setMsg({ type: 'error', text: 'Failed to remove member.' }); }
    };

    const setF = (k: string, v: string) => setInviteForm(f => ({ ...f, [k]: v }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-serif text-white mb-1">Team Members</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">{members.length} members</p>
                </div>
                <button onClick={() => { setShowInvite(true); setMsg(null); }}
                    className="bg-[#1A4D4A] hover:bg-[#1A4D4A]/80 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                    <Plus size={14} /> Invite Member
                </button>
            </div>

            {msg && <Alert type={msg.type}>{msg.text}</Alert>}

            {showInvite && (
                <div className="bg-[#151515] border border-[#1A4D4A]/30 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Invite New Member</h3>
                        <button onClick={() => setShowInvite(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="First Name *" value={inviteForm.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="Jane" />
                        <InputField label="Last Name" value={inviteForm.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Doe" />
                    </div>
                    <InputField label="Work Email *" type="email" value={inviteForm.email} onChange={e => setF('email', e.target.value)} placeholder="jane@stayos.in" />
                    <InputField label="Temporary Password *" type="password" value={inviteForm.password} onChange={e => setF('password', e.target.value)} placeholder="Min 8 characters" />
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Role</label>
                        <div className="flex gap-2">
                            {ROLE_OPTIONS.map(r => (
                                <button key={r} onClick={() => setF('role', r)}
                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded border transition-colors ${inviteForm.role === r ? roleStyle[r] : 'border-white/10 text-white/30 hover:text-white'}`}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setShowInvite(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/50 border border-white/10 rounded-lg hover:text-white transition-colors">Cancel</button>
                        <button onClick={invite} disabled={saving} className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-[#1A4D4A] text-white rounded-lg hover:bg-[#1A4D4A]/80 transition-colors disabled:opacity-50 flex items-center gap-2">
                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                            {saving ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-white/30 text-sm flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Loading team...
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">
                        <Users size={32} className="mx-auto mb-3 opacity-30" />
                        No team members yet.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#151515] border-b border-white/5">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Member</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Joined</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map((m: any) => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#1A4D4A]/20 border border-[#1A4D4A]/30 flex items-center justify-center text-[#1A4D4A] font-bold text-sm">
                                                {m.firstName?.[0]}{m.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{m.firstName} {m.lastName}</p>
                                                <p className="text-xs text-white/40 font-mono">{m.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${roleStyle[m.role as Role] || roleStyle['VIEWER']}`}>
                                            {m.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-white/50">{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        {m.role !== 'ADMIN' && (
                                            <button onClick={() => removeMember(m.id, `${m.firstName} ${m.lastName}`)}
                                                className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// --- PERMISSIONS TAB ---
function PermissionsTab() {
    const permMatrix = [
        { action: 'View dashboard overview', admin: true, editor: true, viewer: true },
        { action: 'Manage properties (add/edit/delete)', admin: true, editor: true, viewer: false },
        { action: 'Review waitlist applications', admin: true, editor: true, viewer: true },
        { action: 'Update application status', admin: true, editor: true, viewer: false },
        { action: 'Publish / unpublish blog posts', admin: true, editor: true, viewer: false },
        { action: 'Create & delete blog posts', admin: true, editor: false, viewer: false },
        { action: 'Manage career openings', admin: true, editor: true, viewer: false },
        { action: 'Review job applications', admin: true, editor: true, viewer: true },
        { action: 'Invite & remove team members', admin: true, editor: false, viewer: false },
        { action: 'Access all settings', admin: true, editor: false, viewer: false },
    ];

    const Tick = ({ yes }: { yes: boolean }) => (
        <span className={yes ? 'text-green-400' : 'text-white/20'}>
            {yes ? <CheckCircle size={16} /> : <X size={16} />}
        </span>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-serif text-white mb-1">Roles & Permissions</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Permission matrix across all roles</p>
            </div>

            <div className="flex gap-4 flex-wrap">
                {ROLE_OPTIONS.map(r => (
                    <div key={r} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${roleStyle[r]}`}>
                        <UserCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{r}</span>
                    </div>
                ))}
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#151515] border-b border-white/5">
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Permission</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-[#1A4D4A] text-center">Admin</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-blue-400 text-center">Editor</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-center">Viewer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {permMatrix.map((p, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm text-white/70">{p.action}</td>
                                <td className="p-4 text-center"><Tick yes={p.admin} /></td>
                                <td className="p-4 text-center"><Tick yes={p.editor} /></td>
                                <td className="p-4 text-center"><Tick yes={p.viewer} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- PASSWORD TAB ---
function PasswordTab() {
    const { user } = useAuth();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = async () => {
        if (!form.currentPassword || !form.newPassword) {
            setMsg({ type: 'error', text: 'All fields are required.' }); return;
        }
        if (form.newPassword.length < 8) {
            setMsg({ type: 'error', text: 'New password must be at least 8 characters.' }); return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setMsg({ type: 'error', text: 'New password and confirmation do not match.' }); return;
        }
        setSaving(true);
        setMsg(null);
        try {
            await api.post('/admin/change-password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setMsg({ type: 'success', text: 'Password updated successfully.' });
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password.' });
        } finally { setSaving(false); }
    };

    const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="space-y-6 max-w-md">
            <div>
                <h2 className="text-xl font-serif text-white mb-1">Change Password</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Logged in as {user?.email}</p>
            </div>

            {msg && <Alert type={msg.type}>{msg.text}</Alert>}

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 space-y-4">
                <InputField label="Current Password" type="password" value={form.currentPassword} onChange={e => setF('currentPassword', e.target.value)} placeholder="••••••••" />
                <InputField label="New Password" type="password" value={form.newPassword} onChange={e => setF('newPassword', e.target.value)} placeholder="Min 8 characters" />
                <InputField label="Confirm New Password" type="password" value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} placeholder="Repeat new password" />

                <div className="pt-2">
                    <button onClick={handleChange} disabled={saving} className="w-full px-6 py-3 text-sm font-bold uppercase tracking-widest bg-[#1A4D4A] text-white rounded-lg hover:bg-[#1A4D4A]/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                        {saving ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState('team');

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-serif text-white mb-2">Settings</h1>
                <p className="text-sm font-bold uppercase tracking-widest text-white/50">Manage your team, roles, and account</p>
            </div>

            <div className="flex gap-1 bg-[#151515] border border-white/5 rounded-xl p-1.5 w-fit">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${activeTab === tab.id ? 'bg-[#1A4D4A] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                        <tab.icon size={14} />{tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'team' && <TeamTab />}
                {activeTab === 'permissions' && <PermissionsTab />}
                {activeTab === 'password' && <PasswordTab />}
            </div>
        </div>
    );
}
