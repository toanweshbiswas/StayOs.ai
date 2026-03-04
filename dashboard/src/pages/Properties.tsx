import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Home, X, Save, Loader2 } from 'lucide-react';
import { RoomImageUploader } from '../components/ImageUploader';

const STATUS_OPTIONS = ['AVAILABLE', 'COMING_SOON', 'FULLY_BOOKED'];
const LOCATION_OPTIONS = ['Indiranagar', 'Koramangala', 'HSR Layout', 'Ulsoor', 'Bellandur', 'Hebbal'];

/** Build room labels based on BHK: e.g. 2BHK → Bedroom 1, Bedroom 2, Hall, Kitchen */
function buildRooms(bhk: number): string[] {
    const rooms: string[] = [];
    for (let i = 1; i <= bhk; i++) rooms.push(`Bedroom ${i}`);
    rooms.push('Hall', 'Kitchen');
    return rooms;
}

interface UploadedImage { url: string; label: string; alt?: string; isPrimary?: boolean; }

const emptyForm = {
    name: '', location: 'Indiranagar', neighborhood: '', address: '',
    sqft: '', bhk: '2', price: '', status: 'AVAILABLE', availableDate: 'Available Now',
    availableRooms: '', totalRooms: '', isFemaleOnly: false, description: '',
    occupancyDescription: '', amenities: '',
};

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-3xl max-h-[93vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-serif text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={18} /></button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">{children}</div>
            </div>
        </div>
    );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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
function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            <textarea {...props} rows={3} className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1A4D4A] transition-colors resize-none" />
        </div>
    );
}

export default function Properties() {
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProp, setEditingProp] = useState<any>(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details');

    const fetchProperties = async () => {
        try {
            const { data } = await api.get('/properties');
            setProperties(data);
        } catch { console.error('Failed to load properties'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProperties(); }, []);

    const openAdd = () => {
        setEditingProp(null);
        setForm({ ...emptyForm });
        setImages([]);
        setError('');
        setActiveTab('details');
        setShowModal(true);
    };

    const openEdit = (prop: any) => {
        setEditingProp(prop);
        setForm({
            name: prop.name || '', location: prop.location || 'Indiranagar',
            neighborhood: prop.neighborhood || '', address: prop.address || '',
            sqft: String(prop.sqft || ''), bhk: String(prop.bhk || '2'),
            price: String(prop.price || ''), status: prop.status || 'AVAILABLE',
            availableDate: prop.availableDate || 'Available Now',
            availableRooms: prop.availableRooms || '', totalRooms: String(prop.totalRooms || ''),
            isFemaleOnly: prop.isFemaleOnly || false, description: prop.description || '',
            occupancyDescription: prop.occupancyDescription || '', amenities: prop.amenities || '',
        });
        // Map existing images to our UploadedImage format using alt field as label
        const existingImages: UploadedImage[] = (prop.images || []).map((img: any) => ({
            url: img.url, label: img.alt || 'Bedroom 1', alt: img.alt, isPrimary: img.isPrimary,
        }));
        setImages(existingImages);
        setError('');
        setActiveTab('details');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.price) { setError('Name and price are required.'); return; }
        setSaving(true);
        setError('');
        try {
            const payload: any = {
                ...form,
                sqft: Number(form.sqft) || 0,
                bhk: Number(form.bhk) || 2,
                price: Number(form.price),
                totalRooms: Number(form.totalRooms) || Number(form.bhk) + 2,
                neighborhood: form.neighborhood || form.location,
                images: images.map(img => ({
                    url: img.url,
                    alt: img.label,   // Use label as alt text for room identification
                    isPrimary: img.isPrimary || false,
                })),
            };
            if (editingProp) {
                await api.put(`/properties/${editingProp.id}`, payload);
            } else {
                await api.post('/properties', payload);
            }
            setShowModal(false);
            fetchProperties();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save property.');
        } finally {
            setSaving(false);
        }
    };

    const deleteProperty = async (id: string) => {
        if (!confirm('Delete this property? This cannot be undone.')) return;
        await api.delete(`/properties/${id}`);
        fetchProperties();
    };

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
    const rooms = buildRooms(Number(form.bhk) || 2);

    if (isLoading) return (
        <div className="flex items-center justify-center h-64 text-white/30">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading properties...
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Properties Portfolio</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/50">{properties.length} properties managed</p>
                </div>
                <button onClick={openAdd} className="bg-[#1A4D4A] hover:bg-[#1A4D4A]/80 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                    <Plus size={16} /> Add Property
                </button>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-24 text-white/30">
                    <Home size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm font-bold uppercase tracking-widest">No properties yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((prop: any) => (
                        <div key={prop.id} className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col group">
                            <div className="aspect-video bg-[#2A2A2A] relative overflow-hidden">
                                {prop.images?.length > 0 ? (
                                    <img src={prop.images[0].url} alt={prop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10"><Home size={48} /></div>
                                )}
                                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${prop.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400 border-green-500/30' : prop.status === 'FULLY_BOOKED' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                                    {prop.status.replace('_', ' ')}
                                </div>
                                {prop.images?.length > 0 && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-white">
                                        {prop.images.length} Photos
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-serif text-white">{prop.name}</h3>
                                        <p className="text-xs text-[#1A4D4A] font-bold uppercase tracking-widest mt-0.5">{prop.location}</p>
                                    </div>
                                    <p className="text-base font-serif italic text-white/80">₹{prop.price?.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-3">
                                    <span>{prop.bhk} BHK</span><span>{prop.sqft} sqft</span>
                                    {prop.isFemaleOnly && <span className="text-[#8C7B6D]">Female Only</span>}
                                </div>
                                <p className="text-xs text-white/50 mb-4 flex-1 line-clamp-2">{prop.description || 'No description.'}</p>
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <span className="text-[10px] uppercase tracking-widest text-white/30">{prop.availableRooms}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(prop)} className="p-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                            <Edit2 size={15} />
                                        </button>
                                        <button onClick={() => deleteProperty(prop.id)} className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title={editingProp ? `Edit: ${editingProp.name}` : 'Add New Property'} onClose={() => setShowModal(false)}>
                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-[#131313] rounded-lg p-1 mb-6">
                        <button onClick={() => setActiveTab('details')}
                            className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'details' ? 'bg-[#1A4D4A] text-white' : 'text-white/40 hover:text-white'}`}>
                            Property Details
                        </button>
                        <button onClick={() => setActiveTab('photos')}
                            className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'photos' ? 'bg-[#1A4D4A] text-white' : 'text-white/40 hover:text-white'}`}>
                            Room Photos
                            {images.length > 0 && <span className="absolute top-1 right-2 w-4 h-4 bg-green-400 text-black rounded-full text-[9px] flex items-center justify-center font-black">{images.length}</span>}
                        </button>
                    </div>

                    {activeTab === 'details' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Field label="Property Name *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Muse, Umber, Casa" />
                            </div>
                            <SelectField label="Location *" value={form.location} onChange={e => set('location', e.target.value)}>
                                {LOCATION_OPTIONS.map(l => <option key={l}>{l}</option>)}
                            </SelectField>
                            <Field label="Address" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address" />
                            <Field label="Price (₹/mo) *" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="35000" />
                            <SelectField label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </SelectField>
                            <SelectField label="BHK" value={form.bhk} onChange={e => set('bhk', e.target.value)}>
                                {['1', '2', '3', '4'].map(b => <option key={b}>{b}</option>)}
                            </SelectField>
                            <Field label="Sqft" type="number" value={form.sqft} onChange={e => set('sqft', e.target.value)} placeholder="1800" />
                            <Field label="Available Rooms" value={form.availableRooms} onChange={e => set('availableRooms', e.target.value)} placeholder="2/3 Available" />
                            <Field label="Available Date" value={form.availableDate} onChange={e => set('availableDate', e.target.value)} placeholder="Available Now" />
                            <div className="col-span-2">
                                <TextArea label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description..." />
                            </div>
                            <div className="col-span-2">
                                <Field label="Amenities (comma-separated)" value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="WiFi, AC, Washing Machine, Furnished" />
                            </div>
                            <div className="col-span-2 flex items-center gap-3 pt-1">
                                <button onClick={() => set('isFemaleOnly', !form.isFemaleOnly)} className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.isFemaleOnly ? 'bg-[#8C7B6D]' : 'bg-white/10'}`}>
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isFemaleOnly ? 'left-5' : 'left-1'}`} />
                                </button>
                                <span className="text-sm text-white/70">Female-only property</span>
                            </div>
                        </div>
                    ) : (
                        <RoomImageUploader rooms={rooms} images={images} onChange={setImages} />
                    )}

                    {error && <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>}

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                        <span className="text-xs text-white/30">{images.length} room photo{images.length !== 1 ? 's' : ''} uploaded</span>
                        <div className="flex gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-bold uppercase tracking-widest bg-[#1A4D4A] text-white rounded-lg hover:bg-[#1A4D4A]/80 transition-colors disabled:opacity-50 flex items-center gap-2">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Saving...' : editingProp ? 'Save Changes' : 'Add Property'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
