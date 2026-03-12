"use client";
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLearningStore } from '@/store/useLearningStore';
import {
    PenTool, Timer, CheckCircle2, XCircle,
    ArrowRight, RotateCcw, Brain, Trophy, Lightbulb
} from 'lucide-react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function PracticeMode() {
    const { user } = useAuthStore();
    const { subjects, fetchSubjects } = useLearningStore();
    const router = useRouter();

    const [started, setStarted] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [difficulty, setDifficulty] = useState('Medium');
    const [timeLimit, setTimeLimit] = useState(10);

    const [sessionQuestions, setSessionQuestions] = useState<{ question: string, options: string[], correct: number, explanation?: string }[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (started && timeLeft > 0 && !showResult) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && started) {
            setShowResult(true);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [started, timeLeft, showResult]);

    const handleStart = () => {
        const subject = subjects.find(s => s.name === selectedSubject);
        if (subject && subject.questions && subject.questions.length > 0) {
            // Shuffle and slice
            const shuffled = [...subject.questions].sort(() => 0.5 - Math.random());
            setSessionQuestions(shuffled.slice(0, questionCount));
        } else {
            // Empty state fallback or error handling
            setSessionQuestions([]);
        }

        setStarted(true);
        setTimeLeft(timeLimit * 60);
        setCurrentIdx(0);
        setAnswers([]);
        setShowResult(false);
        setSelectedOption(null);
    };

    const handleAnswer = (optionIdx: number) => {
        setSelectedOption(optionIdx);
        const newAnswers = [...answers, optionIdx];
        setAnswers(newAnswers);

        setTimeout(() => {
            if (currentIdx < sessionQuestions.length - 1) {
                setCurrentIdx(currentIdx + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
                saveResult(newAnswers);
            }
        }, 450);
    };

    const saveResult = async (finalAnswers: number[]) => {
        const score = finalAnswers.reduce((acc, curr, i) => {
            const q = sessionQuestions[i];
            return acc + (q && curr === q.correct ? 1 : 0);
        }, 0);

        try {
            await api.post('/learning/practice/submit', {
                subject: selectedSubject,
                score,
                totalQuestions: sessionQuestions.length,
                difficulty: difficulty.toLowerCase()
            });
        } catch (err) {
            console.error('Failed to save result:', err);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!started) {
        return (
            <div className="max-w-xl mx-auto mt-12 bg-gray-900/40 border border-gray-800 p-12 rounded-3xl shadow-2xl">
                <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                    <PenTool size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-8 text-center text-white uppercase tracking-tight">Practice Setup</h1>

                <div className="space-y-6 mb-10">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Subject</label>
                        <select
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">Choose a subject...</option>
                            {subjects.map((s: { name: string, questions?: any[] }) => (
                                <option key={s.name} value={s.name}>{s.name} ({s.questions?.length || 0} Questions)</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Questions</label>
                            <select
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                            >
                                {[5, 10, 15, 20, 30].map(n => (
                                    <option key={n} value={n}>{n} MCQs</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Difficulty</label>
                            <select
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                {['Easy', 'Medium', 'Hard'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Time Limit</label>
                        <select
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                        >
                            {[5, 10, 20, 30, 60].map(n => (
                                <option key={n} value={n}>{n} Minutes</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    disabled={!selectedSubject}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20"
                >
                    Begin Session
                </button>
            </div>
        );
    }

    if (showResult) {
        const score = answers.reduce((acc, curr, i) => {
            const q = sessionQuestions[i];
            return acc + (q && curr === q.correct ? 1 : 0);
        }, 0);

        return (
            <div className="max-w-3xl mx-auto py-12 px-8">
                <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-12 text-center mb-12 shadow-2xl">
                    <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/20">
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Session Complete!</h2>
                    <p className="text-gray-400 mb-8 font-medium">You've completed the {selectedSubject} practice session.</p>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Score</p>
                            <p className="text-3xl font-black text-blue-500">{score}/{sessionQuestions.length}</p>
                        </div>
                        <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Accuracy</p>
                            <p className="text-3xl font-black text-emerald-500">{sessionQuestions.length > 0 ? Math.round((score / sessionQuestions.length) * 100) : 0}%</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 mb-12">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-8">
                        <Brain size={18} className="text-purple-500" /> Review Answers
                    </h3>
                    {sessionQuestions.map((q, i) => {
                        const ans = answers[i];
                        const isCorrect = ans === q.correct;
                        return (
                            <div key={i} className={`p-8 rounded-3xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <h4 className="font-bold text-lg leading-relaxed">{q.question}</h4>
                                    {isCorrect ? <CheckCircle2 className="text-emerald-500 shrink-0" /> : <XCircle className="text-red-500 shrink-0" />}
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className={`p-4 rounded-xl text-sm ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">Your Answer</span>
                                        {q.options[ans] || "No answer"}
                                    </div>
                                    {!isCorrect && (
                                        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm border border-emerald-500/20">
                                            <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">Correct Answer</span>
                                            {q.options[q.correct]}
                                        </div>
                                    )}
                                </div>
                                {q.explanation && (
                                    <div className="p-6 bg-gray-950/50 rounded-2xl border border-gray-800/50">
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Lightbulb size={14} /> AI Explanation
                                        </p>
                                        <p className="text-sm text-gray-400 leading-relaxed italic">{q.explanation}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
                >
                    <RotateCcw size={16} /> Back to Dashboard
                </button>
            </div>
        );
    }

    const currentQ = sessionQuestions[currentIdx];

    if (!currentQ) return null;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <header className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#050505]/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                        {selectedSubject} Practice
                    </div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Question {currentIdx + 1} of {sessionQuestions.length}</span>
                </div>
                <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    <Timer size={20} />
                    {formatTime(timeLeft)}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar text-white">
                <div className="max-w-3xl w-full">
                    <div className="mb-12">
                        <div className="w-full bg-gray-900 border border-gray-800/50 h-2.5 rounded-full mb-12 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-700 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                style={{ width: `${((currentIdx + 1) / sessionQuestions.length) * 100}%` }}
                            ></div>
                        </div>
                        <h2 className="text-2xl font-bold leading-relaxed tracking-tight">
                            {currentQ.question}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQ.options.map((opt: string, i: number) => (
                            <button
                                key={i}
                                disabled={selectedOption !== null}
                                onClick={() => handleAnswer(i)}
                                className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${selectedOption === i ? (i === currentQ.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${selectedOption === i ? (i === currentQ.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-800 text-gray-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className={`font-medium ${selectedOption === i ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{opt}</span>
                                    </div>
                                    {selectedOption === i && (
                                        i === currentQ.correct ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
