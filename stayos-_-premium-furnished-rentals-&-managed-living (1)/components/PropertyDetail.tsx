import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, BedDouble, Square, ArrowLeft, ArrowRight, Share2, CheckCircle, Loader2, Zap, X } from 'lucide-react';
import { api } from '../services/api';
import ImageWithLoader from './ImageWithLoader';

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const { data } = await api.get(`/properties/${id}`);
                setProperty(data);
            } catch {
                console.error('Failed to load property');
            } finally {
                setIsLoading(false);
            }
        };
        load();
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

    if (!property) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4">
            <h2 className="text-4xl font-serif text-ink mb-4">Property Not Found</h2>
            <Link to="/listings" className="text-clay underline font-bold uppercase tracking-widest text-sm">← Back to Listings</Link>
        </div>
    );

    const images = property.images || [];
    const amenities = property.amenities ? property.amenities.split(',').map((a: string) => a.trim()).filter(Boolean) : [];

    // Group images by room label (stored in alt field)
    const roomImages = images.reduce((acc: Record<string, any>, img: any) => {
        const label = img.alt || 'Room';
        if (!acc[label]) acc[label] = img;
        return acc;
    }, {});

    const roomEntries = Object.entries(roomImages);

    // Navigation for lightbox
    const prevImg = () => setActiveImage(i => (i - 1 + images.length) % images.length);
    const nextImg = () => setActiveImage(i => (i + 1) % images.length);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!lightbox) return;
            if (e.key === 'ArrowLeft') prevImg();
            if (e.key === 'ArrowRight') nextImg();
            if (e.key === 'Escape') setLightbox(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox]);

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20 font-sans">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">

                {/* Back */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-clay transition-colors mb-8">
                    <ArrowLeft size={14} /> Back to Listings
                </button>

                {/* Title + Share */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b-2 border-ink pb-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif text-ink mb-2">{property.name}</h1>
                        <div className="flex items-center gap-2 text-ink/50 text-sm font-bold uppercase tracking-widest">
                            <MapPin size={14} />
                            <span>{property.neighborhood || property.location}</span>
                            {property.address && <span className="text-ink/30">· {property.address}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={shareLink}
                            className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${copied ? 'border-teal text-teal' : 'border-ink/20 text-ink hover:border-clay hover:text-clay'}`}
                        >
                            {copied ? <><CheckCircle size={13} /> Copied!</> : <><Share2 size={13} /> Share</>}
                        </button>
                        <Link
                            to="/apply"
                            className="flex items-center gap-2 px-6 py-2 bg-clay text-white text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors rounded-sm"
                        >
                            Apply Now <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

                {/* Status bar */}
                <div className="flex flex-wrap gap-4 mb-8 items-center text-sm">
                    <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${property.status === 'AVAILABLE' ? 'text-teal border-teal/30 bg-teal/10' : 'text-ink/50 border-ink/20 bg-ink/5'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${property.status === 'AVAILABLE' ? 'bg-teal' : 'bg-ink/40'}`} />
                        {property.availableRooms || property.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-ink/50 border border-ink/10 px-3 py-1.5 rounded-full">{property.bhk} BHK</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-ink/50 border border-ink/10 px-3 py-1.5 rounded-full">{property.sqft} sqft</span>
                    {property.isFemaleOnly && (
                        <span className="text-xs font-bold uppercase tracking-widest text-[#8C7B6D] border border-[#8C7B6D]/30 bg-[#8C7B6D]/10 px-3 py-1.5 rounded-full">Female Only</span>
                    )}
                    {property.availableDate === 'Available Now' && (
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-500 border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 rounded-full">
                            <Zap size={11} className="fill-orange-500" /> Instant Move-in
                        </span>
                    )}
                </div>

                {/* Image Gallery — Hero + Grid */}
                {images.length > 0 && (
                    <div className="mb-12">
                        {/* Hero image */}
                        <div
                            className="w-full aspect-[16/9] overflow-hidden relative cursor-pointer border border-ink/10 p-1 bg-white shadow-sm mb-2"
                            onClick={() => { setActiveImage(0); setLightbox(true); }}
                        >
                            <ImageWithLoader
                                src={images[activeImage]?.url || images[0].url}
                                alt={images[activeImage]?.alt || property.name}
                                className="w-full h-full object-cover"
                            />
                            {images[activeImage]?.alt && (
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink border border-ink/10 rounded">
                                    {images[activeImage].alt}
                                </div>
                            )}
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded">
                                {activeImage + 1} / {images.length}
                            </div>
                        </div>

                        {/* Room thumbnails */}
                        {roomEntries.length > 1 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                                {images.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square overflow-hidden border-2 transition-all rounded-sm ${activeImage === idx ? 'border-clay' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <ImageWithLoader src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                                        {img.alt && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white truncate">
                                                {img.alt}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {property.description && (
                            <div>
                                <h2 className="text-2xl font-serif text-ink mb-4">About This Home</h2>
                                <p className="text-ink/70 leading-relaxed">{property.description}</p>
                            </div>
                        )}

                        {property.occupancyDescription && (
                            <div>
                                <h3 className="text-lg font-serif text-ink mb-2">Occupancy</h3>
                                <p className="text-ink/70">{property.occupancyDescription}</p>
                            </div>
                        )}

                        {/* Room-by-room breakdown */}
                        {roomEntries.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-serif text-ink mb-6">Room by Room</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {roomEntries.map(([label, img]: [string, any]) => (
                                        <button
                                            key={label}
                                            onClick={() => {
                                                const idx = images.findIndex((i: any) => i.alt === label);
                                                setActiveImage(idx >= 0 ? idx : 0);
                                                setLightbox(true);
                                            }}
                                            className="group text-left"
                                        >
                                            <div className="aspect-video overflow-hidden border border-ink/10 p-0.5 bg-white shadow-sm mb-1.5 rounded-sm">
                                                <ImageWithLoader src={img.url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-ink/60">{label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        {amenities.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-serif text-ink mb-4">Amenities</h2>
                                <div className="flex flex-wrap gap-2">
                                    {amenities.map((a: string) => (
                                        <span key={a} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/70 border border-ink/15 px-3 py-1.5 rounded-full">
                                            <CheckCircle size={11} className="text-teal" /> {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Pricing + CTA */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 border border-ink/10 p-8 bg-white shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-1">Monthly Rent</p>
                            <h3 className="text-3xl font-serif text-ink mb-1">₹{property.price?.toLocaleString()}</h3>
                            <p className="text-xs text-ink/40 mb-6">/ month · No brokerage</p>

                            <div className="space-y-2 mb-6 border-t border-ink/10 pt-4 text-sm text-ink/60">
                                <div className="flex justify-between">
                                    <span className="font-bold uppercase tracking-widest text-xs">Available From</span>
                                    <span>{property.availableDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold uppercase tracking-widest text-xs">Availability</span>
                                    <span>{property.availableRooms}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold uppercase tracking-widest text-xs">Location</span>
                                    <span>{property.location}</span>
                                </div>
                            </div>

                            <Link to="/apply" className="w-full block text-center py-3 bg-clay text-white text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors rounded-sm mb-3">
                                Apply for This Home
                            </Link>
                            <button onClick={shareLink} className="w-full flex items-center justify-center gap-2 py-3 border border-ink/20 text-ink text-xs font-bold uppercase tracking-widest hover:border-clay hover:text-clay transition-colors rounded-sm">
                                {copied ? <><CheckCircle size={13} className="text-teal" /> Link Copied!</> : <><Share2 size={13} /> Share Property</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && images.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
                    <button className="absolute top-4 right-4 text-white/50 hover:text-white p-3" onClick={() => setLightbox(false)}>
                        <X size={24} />
                    </button>
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 bg-white/10 rounded-full" onClick={e => { e.stopPropagation(); prevImg(); }}>
                        <ArrowLeft size={22} />
                    </button>
                    <div className="max-w-5xl max-h-[85vh] w-full px-16" onClick={e => e.stopPropagation()}>
                        <img src={images[activeImage].url} alt={images[activeImage].alt || ''} className="max-w-full max-h-[80vh] object-contain mx-auto" />
                        {images[activeImage].alt && (
                            <p className="text-center text-white/50 mt-4 text-xs font-bold uppercase tracking-widest">{images[activeImage].alt}</p>
                        )}
                        <p className="text-center text-white/30 text-xs mt-1">{activeImage + 1} / {images.length}</p>
                    </div>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 bg-white/10 rounded-full" onClick={e => { e.stopPropagation(); nextImg(); }}>
                        <ArrowRight size={22} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PropertyDetail;
