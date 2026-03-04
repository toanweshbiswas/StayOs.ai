import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Link as LinkIcon, X, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { CoverImageUploader } from '../components/ImageUploader';

const CATEGORIES = ['Market Analysis', 'City Guide', 'Design', 'Lifestyle', 'Finance', 'Community', 'General'];

const emptyForm = {
    title: '', slug: '', excerpt: '', content: '', coverImage: '',
    category: 'General', author: 'StayOs Editorial', tags: '', published: false,
};

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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

function TextAreaField({ label, rows = 4, ...props }: { label: string; rows?: number } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            <textarea {...props} rows={rows} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1A4D4A] transition-colors resize-none" />
        </div>
    );
}

export default function Blog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/blog/admin');
            setPosts(data);
        } catch { console.error('Failed to load posts'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const openAdd = () => {
        setEditingPost(null);
        setForm({ ...emptyForm });
        setError('');
        setShowModal(true);
    };

    const openEdit = (post: any) => {
        setEditingPost(post);
        setForm({
            title: post.title || '', slug: post.slug || '', excerpt: post.excerpt || '',
            content: post.content || '', coverImage: post.coverImage || '',
            category: post.category || 'General', author: post.author || 'StayOs Editorial',
            tags: post.tags || '', published: post.published || false,
        });
        setError('');
        setShowModal(true);
    };

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleTitleChange = (v: string) => {
        setForm(f => ({ ...f, title: v, slug: editingPost ? f.slug : slugify(v) }));
    };

    const handleSave = async () => {
        if (!form.title || !form.slug || !form.content) {
            setError('Title, slug, and content are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            if (editingPost) {
                await api.put(`/blog/${editingPost.id}`, form);
            } else {
                await api.post('/blog', form);
            }
            setShowModal(false);
            fetchPosts();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save post.');
        } finally {
            setSaving(false);
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Delete this post? This cannot be undone.')) return;
        try { await api.delete(`/blog/${id}`); fetchPosts(); }
        catch { console.error('Failed to delete post'); }
    };

    const togglePublish = async (post: any) => {
        try { await api.put(`/blog/${post.id}`, { ...post, published: !post.published }); fetchPosts(); }
        catch { console.error('Failed to toggle publish'); }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64 text-white/30">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading journal...
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Editorial & Journal</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                        {posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} drafts
                    </p>
                </div>
                <button onClick={openAdd} className="bg-[#1A4D4A] hover:bg-[#1A4D4A]/80 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                    <Plus size={16} /> New Post
                </button>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#151515] border-b border-white/5">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Article</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-white/30 text-sm">No posts yet. Click "New Post" to get started.</td></tr>
                            ) : posts.map((post: any) => (
                                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 max-w-xs">
                                        <p className="font-bold text-white text-sm truncate">{post.title}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <LinkIcon size={10} className="text-white/30" />
                                            <p className="text-[11px] text-white/40 truncate">/{post.slug}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] uppercase tracking-widest text-[#8C7B6D] px-2 py-1 rounded-sm border border-[#8C7B6D]/30 bg-[#8C7B6D]/10 whitespace-nowrap">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => togglePublish(post)}
                                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border transition-colors flex items-center gap-1.5 ${post.published ? 'border-green-500/50 text-green-400 bg-green-500/10 hover:bg-green-500/20' : 'border-white/20 text-white/50 bg-white/5 hover:bg-white/10'}`}>
                                            {post.published ? <><Eye size={10} /> Published</> : <><EyeOff size={10} /> Draft</>}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm text-white/50">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(post)} className="p-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                                <Edit2 size={15} />
                                            </button>
                                            <button onClick={() => deletePost(post.id)} className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <Modal title={editingPost ? `Edit: ${editingPost.title}` : 'New Journal Post'} onClose={() => setShowModal(false)}>
                    <div className="space-y-4">
                        <InputField label="Title *" value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Why Bengaluru's Rental Market is Broken..." />
                        <InputField label="Slug *" value={form.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="bengaluru-rental-market-broken" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Category</label>
                                <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#1A4D4A] transition-colors">
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <InputField label="Author" value={form.author} onChange={e => set('author', e.target.value)} placeholder="StayOs Editorial" />
                        </div>
                        <CoverImageUploader value={form.coverImage} onChange={url => set('coverImage', url)} />
                        <TextAreaField label="Excerpt" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="A short teaser shown on the journal listing page..." />
                        <TextAreaField label="Content *" rows={8} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Full article content..." />
                        <InputField label="Tags (comma-separated)" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="rental, bengaluru, guide" />
                        <div className="flex items-center gap-3 pt-2">
                            <button onClick={() => set('published', !form.published)} className={`w-10 h-6 rounded-full transition-colors relative ${form.published ? 'bg-green-500' : 'bg-white/10'}`}>
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.published ? 'left-5' : 'left-1'}`} />
                            </button>
                            <span className="text-sm text-white/70">{form.published ? 'Publish immediately' : 'Save as draft'}</span>
                        </div>
                    </div>

                    {error && <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-bold uppercase tracking-widest bg-[#1A4D4A] text-white rounded-lg hover:bg-[#1A4D4A]/80 transition-colors disabled:opacity-50 flex items-center gap-2">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {saving ? 'Saving...' : editingPost ? 'Save Changes' : 'Publish Post'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
