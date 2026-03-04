import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.user.role !== 'ADMIN') {
                throw new Error('Unauthorized: Admin access required');
            }

            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1F1F1F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="mt-6 text-center text-4xl font-serif font-black tracking-tight text-white mb-2">
                    StayOs<span className="text-[#1A4D4A]">.</span>
                </h2>
                <p className="text-sm font-bold uppercase tracking-widest text-[#1A4D4A]">Admin OS</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#151515] py-8 px-4 shadow shadow-black/50 sm:rounded-lg sm:px-10 border border-white/5">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                Work Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-md shadow-sm placeholder-white/30 bg-[#2A2A2A] text-white focus:outline-none focus:ring-[#1A4D4A] focus:border-[#1A4D4A] sm:text-sm"
                                    placeholder="admin@stayos.in"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-md shadow-sm placeholder-white/30 bg-[#2A2A2A] text-white focus:outline-none focus:ring-[#1A4D4A] focus:border-[#1A4D4A] sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-[#1A4D4A] hover:bg-[#1A4D4A]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A4D4A] transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Authenticating...' : (
                                    <>
                                        <Lock size={16} /> Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
