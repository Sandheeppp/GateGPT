"use client";
import { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowRight, Brain, Cpu, Database, Network, Code, Book, Sigma, Calculator, Layers } from 'lucide-react';
import { useLearningStore } from '@/store/useLearningStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const subjectIcons: Record<string, React.ReactNode> = {
    'Operating Systems': <Layers />,
    'Algorithms': <Brain />,
    'Data Structures': <Database />,
    'Computer Networks': <Network />,
    'Digital Logic': <Cpu />,
    'Compiler Design': <Code />,
    'Theory of Computation': <Sigma />,
    'Discrete Mathematics': <Calculator />,
    'Engineering Mathematics': <Sigma />,
    'Computer Organization': <Cpu />,
};

export default function SubjectExplorer() {
    const { subjects, loading, fetchSubjects } = useLearningStore();
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const filteredSubjects = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Subject Explorer</h1>
                <p className="text-gray-400">Master every GATE topic with step-by-step guidance.</p>
            </header>

            {/* Search Bar */}
            <div className="relative max-w-xl mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Find a subject (e.g. Operating Systems)"
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 p-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-gray-900/40 border border-gray-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubjects.map((subject) => {
                        const mastery = useLearningStore.getState().getMastery(subject.name);
                        return (
                            <div
                                key={subject.name}
                                className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:border-gray-700 hover:bg-gray-900/60 transition-all group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {subjectIcons[subject.name] || <BookOpen />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{subject.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                                        {subject.description || `Comprehensive guide to ${subject.name} for GATE computer science.`}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-widest font-bold">
                                        <span>{subject.topics?.length || 0} Topics</span>
                                        <span className="text-blue-500">{mastery}% Mastered</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000"
                                            style={{ width: `${mastery}%` }}
                                        ></div>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/subjects/${subject.name}`)}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800/50 hover:bg-blue-600 rounded-xl text-sm font-bold transition-all group/btn"
                                    >
                                        Explore Notes <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
