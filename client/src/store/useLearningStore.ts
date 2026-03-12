import { create } from 'zustand';
import api from '@/lib/axios';

interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
}

interface Subject {
    _id: string;
    name: string;
    description: string;
    topics?: string[];
    questions?: Question[];
}

interface LearningState {
    subjects: Subject[];
    stats: Record<string, { totalQuestions: number, totalScore: number }>;
    loading: boolean;
    error: boolean;
    lastFetched: number | null;
    fetchSubjects: (force?: boolean) => Promise<void>;
    setSubjects: (subjects: Subject[]) => void;
    getMastery: (subjectName: string) => number;
}

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export const useLearningStore = create<LearningState>((set, get) => ({
    subjects: [],
    stats: {},
    loading: false,
    error: false,
    lastFetched: null,

    fetchSubjects: async (force = false) => {
        const { subjects, lastFetched } = get();
        const now = Date.now();

        // Return cached data if available and fresh
        if (!force && subjects.length > 0 && lastFetched && (now - lastFetched < CACHE_DURATION)) {
            return;
        }

        set({ loading: subjects.length === 0, error: false });
        try {
            const [{ data: subjectsData }, { data: analyticsData }] = await Promise.all([
                api.get('/learning/subjects'),
                api.get('/learning/analytics')
            ]);

            set({
                subjects: subjectsData,
                stats: analyticsData.stats || {},
                lastFetched: now,
                loading: false
            });
        } catch (error) {
            console.error('Failed to fetch subjects or analytics:', error);
            set({ error: true, loading: false });

            // Fallback for demo/empty state if no subjects yet
            if (subjects.length === 0) {
                set({
                    subjects: [
                        { _id: '1', name: 'Operating Systems', description: 'Processes, Memory Management, File Systems, and I/O.' },
                        { _id: '2', name: 'Algorithms', description: 'Searching, Sorting, Graph Algorithms, and Dynamic Programming.' },
                        { _id: '3', name: 'Data Structures', description: 'Arrays, Linked Lists, Stacks, Queues, Trees, and Heaps.' },
                        { _id: '4', name: 'Digital Logic', description: 'Boolean Algebra, Combinational and Sequential Circuits.' }
                    ]
                });
            }
        }
    },

    setSubjects: (subjects) => set({ subjects }),

    getMastery: (subjectName: string) => {
        const { stats } = get();
        const s = stats[subjectName];
        if (!s || s.totalQuestions === 0) return 0;
        return Math.round((s.totalScore / s.totalQuestions) * 100);
    },
}));
