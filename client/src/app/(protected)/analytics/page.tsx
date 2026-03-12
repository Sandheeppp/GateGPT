"use client";
import { useState, useEffect } from 'react';
import {
    BarChart3, Activity,
    ArrowUpRight, ArrowDownRight, Target, Brain, Award
} from 'lucide-react';
import api from '@/lib/axios';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';

export default function AnalyticsPage() {
    const [data, setData] = useState<{ stats: Record<string, any>, results: any[] } | null>(null);
    const [_loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/learning/analytics');
                setData(data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const mockTrendData = [
        { date: 'Mon', accuracy: 65, questions: 20 },
        { date: 'Tue', accuracy: 72, questions: 35 },
        { date: 'Wed', accuracy: 68, questions: 25 },
        { date: 'Thu', accuracy: 80, questions: 40 },
        { date: 'Fri', accuracy: 75, questions: 30 },
        { date: 'Sat', accuracy: 85, questions: 50 },
        { date: 'Sun', accuracy: 90, questions: 45 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    const subjectChartData = data?.stats && Object.keys(data.stats).length > 0 ? Object.keys(data.stats).map(name => ({
        name,
        mastery: data.stats[name].totalQuestions > 0
            ? Math.round((data.stats[name].totalScore / data.stats[name].totalQuestions) * 100)
            : 0
    })) : [
        { name: 'OS', mastery: 75 },
        { name: 'Algorithms', mastery: 62 },
        { name: 'DS', mastery: 88 },
        { name: 'Discrete', mastery: 45 },
        { name: 'Networks', mastery: 55 },
    ];

    const calculateOverallAcc = () => {
        if (!data?.stats || Object.keys(data.stats).length === 0) return "74.2%";
        let totalScore = 0;
        let totalQs = 0;
        Object.values(data.stats).forEach((stat: any) => {
            totalScore += stat.totalScore;
            totalQs += stat.totalQuestions;
        });
        return totalQs > 0 ? `${Math.round((totalScore / totalQs) * 100)}%` : "0%";
    };

    const totalQuestionsAsked = data?.results
        ? data.results.reduce((acc: number, curr: any) => acc + curr.totalQuestions, 0)
        : 245;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <BarChart3 className="text-blue-500" /> Performance Analytics
                </h1>
                <p className="text-gray-400">Track your progress and identify areas for improvement.</p>
            </header>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Overall Accuracy"
                    value={calculateOverallAcc()}
                    trend="+5.4%"
                    icon={<Target size={20} />}
                    isUp={true}
                />
                <StatCard
                    title="Weekly Practice"
                    value={`${totalQuestionsAsked} Qs`}
                    trend="+12%"
                    icon={<Activity size={20} />}
                    isUp={true}
                />
                <StatCard
                    title="Strong Subject"
                    value={subjectChartData.sort((a, b) => b.mastery - a.mastery)[0].name}
                    trend={`${subjectChartData.sort((a, b) => b.mastery - a.mastery)[0].mastery}% Mastery`}
                    icon={<Award size={20} />}
                    isUp={true}
                    color="text-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Weekly Trend Chart */}
                <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-[10px] text-gray-400">Accuracy Trend (Last 7 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockTrendData}>
                                <defs>
                                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Mastery Chart */}
                <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-[10px] text-gray-400">Subject Mastery (%)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectChartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                />
                                <Bar dataKey="mastery" radius={[0, 4, 4, 0]} barSize={20}>
                                    {subjectChartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Analytics Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-wider">AI Insight: Study Pattern</h4>
                        <p className="text-sm text-gray-400 leading-relaxed italic">"You perform best during late-night sessions. Your accuracy in Algorithms is 15% higher between 10 PM and 1 AM."</p>
                    </div>
                </div>
                <div className="bg-orange-600/10 border border-orange-500/20 p-6 rounded-2xl flex gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Improvement Strategy</h4>
                        <p className="text-sm text-gray-400 leading-relaxed italic">"Discrete Mathematics needs focus. Try generating 3 revision cheat sheets today followed by 5 practice questions."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon, isUp, color = "text-white" }: { title: string, value: string, trend: string, icon: React.ReactNode, isUp: boolean, color?: string }) {
    return (
        <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl hover:border-gray-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-800 text-gray-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {trend}
                </div>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}
