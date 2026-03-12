"use client";
import { useState } from 'react';
import {
    FileText, Upload, Send, Brain,
    CheckCircle, Copy, Share2, Sparkles, Image as ImageIcon, XCircle
} from 'lucide-react';
import api from '@/lib/axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function PyqSolver() {
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleSolve = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setSolution('');
        setError('');
        try {
            const { data } = await api.post('/learning/ai/solve-pyq', { question });
            if (data.solution) {
                setSolution(data.solution);
            } else {
                setError('AI could not generate a solution. Please try again with a clearer question.');
            }
        } catch (err: unknown) {
            console.error('Failed to solve PYQ:', err);
            const errorResponse = err as { response?: { data?: { message?: string } } };
            setError(errorResponse.response?.data?.message || 'Failed to connect to AI engine. Please check your internet or try again later.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(solution);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <FileText className="text-blue-500" /> PYQ Solver
                    </h1>
                    <p className="text-gray-400">Get instant, step-by-step solutions for any GATE question.</p>
                </div>
                <div className="bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full text-xs font-bold border border-blue-500/20 flex items-center gap-2">
                    <Sparkles size={14} /> AI Powered
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Input Area */}
                <section className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Enter Your Question</h2>
                    <textarea
                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-6 text-gray-200 focus:outline-none focus:border-blue-500 transition-all min-h-[200px] resize-none text-lg leading-relaxed mb-6"
                        placeholder="Paste your GATE question here or describe the problem..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors text-gray-400 hover:text-white">
                                <ImageIcon size={18} /> Upload Image (Coming Soon)
                            </button>
                        </div>
                        <button
                            onClick={handleSolve}
                            disabled={loading || !question.trim()}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Solving...
                                </>
                            ) : (
                                <>
                                    <Send size={18} /> Solve Question
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Error Message */}
                {error && (
                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-sm font-medium flex items-center gap-3">
                        <XCircle size={18} /> {error}
                    </div>
                )}

                {/* Solution Area */}
                {(solution || loading) && (
                    <section className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 relative min-h-[400px]">
                        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                <Brain size={18} /> Step-by-Step Solution
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    title="Copy Solution"
                                >
                                    {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                </button>
                                <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </header>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                                <div className="h-32 bg-gray-800 rounded w-full mt-8"></div>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:mb-4 prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {solution}
                                </ReactMarkdown>
                            </div>
                        )}
                    </section>
                )}

                {/* No Solution Placeholder */}
                {!solution && !loading && (
                    <div className="flex flex-col items-center justify-center p-20 text-center opacity-30">
                        <FileText size={64} className="mb-6" />
                        <p className="text-xl font-medium text-white">Your solution will appear here</p>
                        <p className="text-sm mt-2 text-gray-500">Paste a question above to start the engine</p>
                    </div>
                )}
            </div>
        </div>
    );
}
