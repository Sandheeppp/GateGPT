"use client";
import Link from 'next/link';
import {
    Zap, BookOpen, PenTool,
    Shield, ArrowRight,
    BarChart3, Star, FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {

    return (
        <div className="bg-[#050505] text-white min-h-screen selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/20 text-white">G</div>
                        <span className="font-black text-xl tracking-tighter uppercase">GateGPT</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-blue-500 transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-blue-500 transition-colors">Tools</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Login</Link>
                        <Link href="/signup" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/10 uppercase tracking-widest text-white">Join Now</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-44 pb-32 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-600/5 via-transparent to-transparent -z-10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-10 animate-bounce">
                        <Zap size={14} fill="currentColor" /> The Next-Gen GATE Platform
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-4 leading-[1.05] tracking-tight">
                        Master the GATE Exam <br />
                        with <span className="bg-gradient-to-r from-blue-500 to-emerald-500 text-transparent bg-clip-text">AI Precision.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-blue-400 mb-8 tracking-[0.2em] uppercase">
                        Unlocking Potential, One Concept at a Time.
                    </p>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium capitalize">
                        More than just a chatbot. A complete AI learning ecosystem for computer science aspirants. Solve PYQs, practice quizzes, and simulate interviews.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/10">
                            Get Started for Free <ArrowRight size={20} />
                        </Link>
                        <Link href="/demo" className="w-full sm:w-auto px-10 py-5 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3">
                            View Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Core Ecosystem</h2>
                        <h3 className="text-4xl font-black tracking-tight">Everything you need to crack GATE.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            title="AI PYQ Solver"
                            desc="Upload images or paste text to get instant step-by-step solutions for 20+ years of GATE questions."
                            icon={<FileText size={24} />}
                            color="bg-blue-500"
                        />
                        <FeatureCard
                            title="Subject Explorer"
                            desc="Deep dive into every subject with AI-generated notes, formulas, and conceptual breakthroughs."
                            icon={<BookOpen size={24} />}
                            color="bg-emerald-500"
                        />
                        <FeatureCard
                            title="Practice Engine"
                            desc="Interactive quizzes with topic-level analysis and AI-driven performance tracking."
                            icon={<PenTool size={24} />}
                            color="bg-orange-500"
                        />
                        <FeatureCard
                            title="Mock Interviews"
                            desc="Simulate technical rounds with an AI interviewer and get instant feedback on your depth of clarity."
                            icon={<Shield size={24} />}
                            color="bg-purple-500"
                        />
                        <FeatureCard
                            title="Revision Mode"
                            desc="One-click generation of high-yield revision sheets and formula cheat sheets."
                            icon={<Zap size={24} />}
                            color="bg-yellow-500"
                        />
                        <FeatureCard
                            title="Weakness Analysis"
                            desc="Data-driven insights into your strong and weak topics using advanced performance charts."
                            icon={<BarChart3 size={24} />}
                            color="bg-indigo-500"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Simulation */}
            <section className="py-32 bg-gray-900/40 border-y border-gray-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex justify-center gap-1 mb-10 text-yellow-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <p className="text-3xl font-bold leading-tight mb-12 text-white italic">
                        "GateGPT helped me understand the Nuances of DB Normalization and Paging that standard books didn't explain clearly. It's like having a 24/7 personal tutor."
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center font-bold">RK</div>
                        <div className="text-left">
                            <p className="font-bold text-white">Rohit Kumar</p>
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">AIR 42 • GATE 2024</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-44 px-6 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl p-20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <h2 className="text-5xl font-black mb-8 relative z-10 tracking-tight leading-tight">Ready to Master GATE 2025? <br /> Join Thousands of Students.</h2>
                    <button className="px-12 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-xl transition-all relative z-10 shadow-2xl uppercase tracking-tighter">
                        Generate Your Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-gray-800 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
                            <span className="font-bold text-xl uppercase tracking-tighter">GateGPT</span>
                        </div>
                        <p className="text-gray-500 max-w-sm leading-relaxed font-medium">The most advanced AI learning platform specifically designed for GATE Computer Science aspirants.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.3em]">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold tracking-widest uppercase">
                            <li><a href="#" className="hover:text-white transition-colors">Subjects</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Practice</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Revision</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.3em]">Community</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold tracking-widest uppercase">
                            <li><a href="#" className="hover:text-white transition-colors">Student Forum</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-800 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.5em]">
                    © 2024 GateGPT Platform • Intelligent Learning Infrastructure
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc, icon, color }: { title: string, desc: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="p-10 bg-gray-900/40 border border-gray-800 rounded-3xl hover:border-gray-700 hover:bg-gray-900/60 transition-all group">
            <div className={`w-14 h-14 ${color}/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                <div className={`${color === 'bg-blue-500' ? 'text-blue-500' : color === 'bg-emerald-500' ? 'text-emerald-500' : color === 'bg-orange-500' ? 'text-orange-500' : color === 'bg-purple-500' ? 'text-purple-500' : color === 'bg-yellow-500' ? 'text-yellow-500' : 'text-indigo-500'}`}>
                    {icon}
                </div>
            </div>
            <h4 className="text-xl font-bold text-white mb-4 tracking-tight uppercase group-hover:text-white transition-colors">{title}</h4>
            <p className="text-gray-500 line-clamp-3 leading-relaxed font-medium">{desc}</p>
        </div>
    );
}
