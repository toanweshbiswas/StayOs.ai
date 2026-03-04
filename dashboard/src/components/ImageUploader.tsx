import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

interface UploadedImage {
    url: string;
    label: string;
    alt?: string;
    isPrimary?: boolean;
}

interface RoomImageUploaderProps {
    /** List of room labels to show upload slots for */
    rooms: string[];
    images: UploadedImage[];
    onChange: (images: UploadedImage[]) => void;
}

function SingleUploadSlot({
    label,
    image,
    onUpload,
    onRemove,
    isPrimary,
}: {
    label: string;
    image?: UploadedImage;
    onUpload: (url: string) => void;
    onRemove: () => void;
    isPrimary?: boolean;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const token = localStorage.getItem('stayos_token');
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            onUpload(data.url);
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</label>
                {isPrimary && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A4D4A] border border-[#1A4D4A]/40 bg-[#1A4D4A]/10 px-1.5 py-0.5 rounded">
                        Primary
                    </span>
                )}
            </div>

            {image ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 group">
                    <img src={image.url} alt={label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
                        >
                            <Upload size={12} /> Replace
                        </button>
                        <button
                            onClick={onRemove}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <CheckCircle size={16} className="absolute top-2 right-2 text-green-400 drop-shadow" />
                </div>
            ) : (
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-[#1A4D4A]/50 transition-colors flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 disabled:opacity-50"
                >
                    {uploading ? (
                        <><Loader2 size={20} className="animate-spin" /><span className="text-xs">Uploading...</span></>
                    ) : (
                        <><ImageIcon size={20} /><span className="text-xs font-bold uppercase tracking-widest">Upload {label}</span></>
                    )}
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
        </div>
    );
}

export function RoomImageUploader({ rooms, images, onChange }: RoomImageUploaderProps) {
    const getImage = (label: string) => images.find(img => img.label === label);

    const handleUpload = (label: string, url: string) => {
        const existing = images.filter(img => img.label !== label);
        const isPrimary = existing.length === 0;
        onChange([...existing, { url, label, alt: label, isPrimary }]);
    };

    const handleRemove = (label: string) => {
        const remaining = images.filter(img => img.label !== label);
        // If we removed the primary, make the first one primary
        if (remaining.length > 0 && !remaining.some(i => i.isPrimary)) {
            remaining[0].isPrimary = true;
        }
        onChange(remaining);
    };

    return (
        <div className="space-y-3">
            <p className="text-xs text-white/40 bg-[#151515] border border-white/5 rounded-lg px-3 py-2">
                <span className="font-bold text-white/60">Room Photos</span> — Upload individual photos for each space. The first uploaded image becomes the cover photo.
            </p>
            <div className="grid grid-cols-2 gap-4">
                {rooms.map((room, i) => (
                    <SingleUploadSlot
                        key={room}
                        label={room}
                        image={getImage(room)}
                        isPrimary={i === 0}
                        onUpload={(url) => handleUpload(room, url)}
                        onRemove={() => handleRemove(room)}
                    />
                ))}
            </div>
            <p className="text-[10px] text-white/30 text-center">{images.length} of {rooms.length} photos uploaded</p>
        </div>
    );
}

/** Simpler single image uploader for blog cover photos */
export function CoverImageUploader({
    value,
    onChange,
    label = 'Cover Image',
}: {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const token = localStorage.getItem('stayos_token');
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            onChange(data.url);
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{label}</label>
            {value ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-white/10 group">
                    <img src={value} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                            <Upload size={12} /> Replace
                        </button>
                        <button onClick={() => onChange('')} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-40 rounded-lg border-2 border-dashed border-white/10 hover:border-[#1A4D4A]/50 transition-colors flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 disabled:opacity-50"
                >
                    {uploading ? (
                        <><Loader2 size={24} className="animate-spin" /><span className="text-xs">Uploading...</span></>
                    ) : (
                        <><Upload size={24} /><span className="text-xs font-bold uppercase tracking-widest">Click to upload {label}</span><span className="text-[10px] opacity-60">JPG, PNG, WebP — max 10MB</span></>
                    )}
                </button>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
        </div>
    );
}
