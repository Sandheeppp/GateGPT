"use client";
import { useState, useRef, useEffect } from 'react';
import {
    Mic, Send, Shield,
    StopCircle, Play
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MockInterview() {
    const [started, setStarted] = useState(false);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleStart = () => {
        setStarted(true);
        setMessages([
            { role: 'assistant', content: "Hello! I'm your GateGPT interviewer. I'll be testing your knowledge in Core Computer Science subjects. \n\nAre you ready to begin? We'll start with **Operating Systems**." }
        ]);
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        // Simulation for now - we would call an AI route here
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Excellent. Let's talk about **Scheduling**. Explain the difference between *Preemptive* and *Non-preemptive* scheduling with an example from GATE point of view."
            }]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex-1 flex flex-col relative h-full">
            {!started ? (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full text-center">
                        <div className="w-24 h-24 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-blue-500/20 text-blue-500 font-bold">
                            <Shield size={48} />
                        </div>
                        <h1 className="text-4xl font-black mb-6 tracking-tight text-white">GATE AI Interview Simulation</h1>
                        <p className="text-gray-400 mb-12 text-lg leading-relaxed max-w-lg mx-auto italic">
                            "90% of GATE toppers say verbalizing concepts helps build deep understanding. Practice with our AI interviewer today."
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                                <h4 className="font-bold mb-2 uppercase text-[10px] tracking-widest text-blue-500">How it works</h4>
                                <p className="text-sm text-gray-500">AI asks 5-10 technical questions based on your profile and performance.</p>
                            </div>
                            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                                <h4 className="font-bold mb-2 uppercase text-[10px] tracking-widest text-emerald-500">Evaluation</h4>
                                <p className="text-sm text-gray-500">Get a score based on accuracy, conceptual clarity, and explanation depth.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="px-12 py-5 bg-blue-600 hover:bg-blue-700 rounded-3xl font-black text-xl transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-4 mx-auto uppercase tracking-tighter text-white"
                        >
                            <Play size={24} fill="currentColor" /> Start Interview Session
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <header className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/20 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center animate-pulse">
                                <StopCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Live Interview Session</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Focusing on: Operating Systems</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress: 1/8</span>
                            <button onClick={() => setStarted(false)} className="px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all">End Session</button>
                        </div>
                    </header>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-12">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-3xl p-6 ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' : 'bg-gray-900 border border-gray-800'}`}>
                                        <div className="text-sm leading-relaxed prose prose-invert max-w-none prose-p:mb-0">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-8">
                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    placeholder="Explain your answer clearly..."
                                    className="w-full bg-gray-900 border border-gray-800 rounded-3xl pl-8 pr-32 py-6 text-white text-lg focus:outline-none focus:border-blue-500 transition-all shadow-2xl"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                    <button type="button" className="p-3 bg-gray-800 text-gray-400 hover:text-white rounded-2xl transition-all">
                                        <Mic size={20} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim()}
                                        className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                            <p className="text-[10px] text-gray-600 mt-4 text-center uppercase font-bold tracking-[0.2em]">GateGPT AI evaluates conceptual depth and exam relevance</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
