"use client";
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            router.push('/chat');
        } catch (err: unknown) {
            const errorResponse = err as { response?: { data?: { message?: string } } };
            setError(errorResponse.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 mb-4">
                        <GraduationCap className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="text-gray-400 mt-2">Continue your GATE preparation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 group transition-all"
                    >
                        Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8">
                    Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
