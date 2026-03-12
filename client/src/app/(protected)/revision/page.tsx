"use client";
import { useState, useEffect } from 'react';
import {
    GraduationCap, Sparkles, BookOpen, Download,
    Zap, Bookmark, Printer, ArrowRight
} from 'lucide-react';
import api from '@/lib/axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function RevisionMode() {
    const [subjects, setSubjects] = useState<{ name: string, topics: { name: string }[] }[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const [_error, setError] = useState(false);

    const fetchSubjects = async () => {
        setLoading(true);
        setError(false);
        try {
            const { data } = await api.get('/learning/subjects');
            if (data.length === 0) {
                setSubjects([
                    { name: 'Operating Systems', topics: [{ name: 'Process Scheduling' }, { name: 'Deadlocks' }] },
                    { name: 'Algorithms', topics: [{ name: 'Sorting' }, { name: 'Graph Traversal' }] }
                ]);
            } else {
                setSubjects(data);
            }
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
            setError(true);
            setSubjects([
                { name: 'Operating Systems', topics: [{ name: 'Process Scheduling' }, { name: 'Deadlocks' }] },
                { name: 'Algorithms', topics: [{ name: 'Sorting' }, { name: 'Graph Traversal' }] }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleGenerate = async () => {
        if (!selectedSubject || !selectedTopic) return;
        setLoading(true);
        setNotes('');
        try {
            const { data } = await api.post('/learning/ai/revision-notes', {
                subject: selectedSubject,
                topic: selectedTopic
            });
            setNotes(data.notes);
        } catch (error) {
            console.error('Failed to generate notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentSubject = subjects.find(s => s.name === selectedSubject);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <GraduationCap className="text-emerald-500" /> Revision Mode
                    </h1>
                    <p className="text-gray-400">Transform complex topics into high-yield revision sheets.</p>
                </div>
                <div className="bg-emerald-600/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                    Full Platform Feature
                </div>
            </header>

            {/* Selection Controls */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Subject</label>
                        <select
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedTopic('');
                            }}
                        >
                            <option value="">Choose a subject...</option>
                            {subjects.map(s => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Topic</label>
                        <select
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">Choose a topic...</option>
                            {currentSubject?.topics?.map((t: { name: string }) => (
                                <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !selectedTopic}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Synthesizing Revision Content...
                        </>
                    ) : (
                        <>
                            <Zap size={20} /> Generate Revision Sheet
                        </>
                    )}
                </button>
            </div>

            {/* Content Display */}
            {(notes || loading) && (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 min-h-[600px] relative">
                    <div className="absolute top-8 right-8 flex gap-3 z-10">
                        <button
                            onClick={() => setSaved(!saved)}
                            className={`p-2.5 rounded-xl transition-all ${saved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-800/50 text-gray-400 hover:text-white'}`}
                        >
                            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                        </button>
                        <button className="p-2.5 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white transition-all">
                            <Download size={18} />
                        </button>
                        <button className="p-2.5 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white transition-all">
                            <Printer size={18} />
                        </button>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Sparkles size={16} /> Flash Revision Notes
                        </h3>
                        <h2 className="text-3xl font-black">{selectedSubject}</h2>
                        <p className="text-gray-500 font-medium">Topic: {selectedTopic}</p>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
                            <div className="h-64 bg-gray-800 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none 
                            prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-6
                            prose-h2:text-xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-emerald-400
                            prose-p:text-gray-400 prose-p:leading-loose prose-p:mb-6
                            prose-ul:space-y-3 prose-ul:mb-8
                            prose-li:text-gray-400 prose-li:leading-relaxed
                            prose-code:bg-emerald-500/10 prose-code:text-emerald-400 prose-code:p-1 prose-code:rounded prose-code:text-sm
                        ">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {notes}
                            </ReactMarkdown>
                        </div>
                    )}

                    {!loading && notes && (
                        <div className="mt-16 pt-8 border-t border-gray-800 flex items-center justify-between">
                            <p className="text-xs text-gray-500 italic">Generated by GateGPT Intelligent Tutor</p>
                            <button className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">
                                Open full textbook guide <ArrowRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!notes && !loading && (
                <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-gray-800 rounded-3xl opacity-20 hover:opacity-40 transition-opacity">
                    <BookOpen size={64} className="mb-6" />
                    <h3 className="text-xl font-bold">Select a topic to generate notes</h3>
                    <p className="max-w-xs mt-2 mx-auto">AI-powered summarization engine for fast GATE revision.</p>
                </div>
            )}
        </div>
    );
}
