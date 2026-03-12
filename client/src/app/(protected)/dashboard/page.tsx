"use client";
import { useAuthStore } from '@/store/useAuthStore';
import {
    Zap, PenTool,
    Award, Clock, ArrowRight, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const { user } = useAuthStore();
    const router = useRouter();

    const stats = [
        { label: 'Solved Questions', value: '1,240', icon: <PenTool size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Subject Mastery', value: '68%', icon: <Award size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Study Streak', value: '12 Days', icon: <Zap size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Time Studied', value: '45h', icon: <Clock size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    const quickTools = [
        { title: 'PYQ Solver', desc: 'Step-by-step solutions for GATE PYQs', path: '/pyq-solver', icon: '📝' },
        { title: 'Practice Mode', desc: 'Interactive quizzes with AI explanations', path: '/practice', icon: '🎯' },
        { title: 'Revision Notes', desc: 'AI-generated cheat sheets & summaries', path: '/revision', icon: '📚' },
        { title: 'Mock Interview', desc: 'Simulate technical rounds with AI', path: '/mock-interview', icon: '💬' },
    ];

    return (
        <div className="max-w-6xl mx-auto p-8">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-gray-400">Your GATE preparation is 68% complete. Keep going!</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all group">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Study Tools */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Star className="text-yellow-500" size={20} /> Quick Access Tools
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickTools.map((tool) => (
                                <button
                                    key={tool.title}
                                    onClick={() => router.push(tool.path)}
                                    className="bg-gray-900/40 border border-gray-800 p-5 rounded-2xl text-left hover:bg-gray-800/40 transition-all group flex items-start gap-4"
                                >
                                    <div className="text-3xl">{tool.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors uppercase text-xs tracking-wider">{tool.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{tool.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Weakness Alert */}
                    <section className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center font-bold">!</div>
                            <div>
                                <h3 className="font-bold text-white">Weakness Alert: Memory Management</h3>
                                <p className="text-sm text-gray-400">Your accuracy in OS Memory Management has dropped to 45%.</p>
                            </div>
                        </div>
                        <button className="text-sm text-red-400 font-bold hover:underline flex items-center gap-2">
                            Start specialized practice <ArrowRight size={14} />
                        </button>
                    </section>
                </div>

                {/* Sidebar Content Area */}
                <div className="space-y-8">
                    {/* Daily Question */}
                    <section className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
                        <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider">
                            <Clock size={16} /> Daily Practice Question
                        </h3>
                        <p className="text-sm text-gray-300 mb-6 font-medium leading-relaxed italic">
                            "Which scheduling algorithm is used to minimize the average waiting time for a set of processes with known burst times?"
                        </p>
                        <div className="space-y-2 mb-6">
                            {['RR', 'SJF', 'FCFS', 'Priority'].map((opt) => (
                                <button key={opt} className="w-full p-3 bg-gray-900/50 border border-gray-800 rounded-xl text-left text-xs hover:border-blue-500/50 transition-colors">
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                            Submit Answer
                        </button>
                    </section>

                    {/* Recent Activity */}
                    <section>
                        <h3 className="font-bold text-gray-400 mb-6 uppercase text-[10px] tracking-widest">Recent Activity</h3>
                        <div className="space-y-4">
                            {[
                                { action: 'Completed OS Quiz', time: '2h ago', status: '8/10' },
                                { action: 'Solved DBMS PYQ', time: '5h ago', status: 'Success' },
                                { action: 'Generated Notes', time: 'Yesterday', status: 'Algo' },
                            ].map((act, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <div>
                                            <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{act.action}</p>
                                            <p className="text-[10px] text-gray-500">{act.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-gray-900 px-2 py-1 rounded text-gray-400 font-bold uppercase tracking-tighter">{act.status}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
