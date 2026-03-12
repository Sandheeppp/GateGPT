import { create } from 'zustand';
import api from '@/lib/axios';

interface Message {
    _id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

interface Chat {
    _id: string;
    title: string;
    isPinned: boolean;
    isArchived: boolean;
    updatedAt: string;
}

interface ChatState {
    chats: Chat[];
    currentChat: Chat | null;
    messages: Message[];
    loading: boolean;
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    createChat: (title?: string) => Promise<Chat>;
    sendMessage: (chatId: string, content: string) => Promise<void>;
    updateChat: (chatId: string, updates: Partial<Chat>) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    pinChat: (chatId: string) => Promise<void>;
    archiveChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,

    fetchChats: async () => {
        set({ loading: true });
        try {
            const { data } = await api.get('/chats');
            set({ chats: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    fetchMessages: async (chatId) => {
        set({ loading: true });
        try {
            const { data } = await api.get(`/chats/${chatId}/messages`);
            set({ messages: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    createChat: async (title) => {
        const { data } = await api.post('/chats', { title });
        set((state) => ({ chats: [data, ...state.chats], currentChat: data, messages: [] }));
        return data;
    },

    sendMessage: async (chatId, content) => {
        // Optimistic update
        const tempMsg: Message = {
            _id: Math.random().toString(),
            role: 'user',
            content,
            createdAt: new Date().toISOString()
        };
        set((state) => ({ messages: [...state.messages, tempMsg] }));

        try {
            const { data } = await api.post(`/chats/${chatId}/messages`, { content });
            set((state) => ({
                messages: [...state.messages.filter(m => m._id !== tempMsg._id), tempMsg, data]
            }));
        } catch (error: unknown) {
            console.error(error);
            const err = error as { response?: { data?: { message?: string } } };
            // Remove optimistic message and show error
            const errorMessage: Message = {
                _id: Math.random().toString(),
                role: 'assistant',
                content: `Error: ${err.response?.data?.message || 'Failed to send message'}`,
                createdAt: new Date().toISOString()
            };
            set((state) => ({
                messages: [...state.messages.filter(m => m._id !== tempMsg._id), tempMsg, errorMessage]
            }));
        }
    },

    updateChat: async (chatId, updates) => {
        const { data } = await api.patch(`/chats/${chatId}`, updates);
        set((state) => ({
            chats: state.chats.map((c) => (c._id === chatId ? data : c)),
        }));
    },

    deleteChat: async (chatId) => {
        await api.delete(`/chats/${chatId}`);
        set((state) => ({
            chats: state.chats.filter((c) => c._id !== chatId),
            currentChat: state.currentChat?._id === chatId ? null : state.currentChat
        }));
    },

    pinChat: async (chatId) => {
        const chat = get().chats.find(c => c._id === chatId);
        if (chat) {
            await get().updateChat(chatId, { isPinned: !chat.isPinned });
        }
    },

    archiveChat: async (chatId) => {
        await get().updateChat(chatId, { isArchived: true });
        set((state) => ({
            chats: state.chats.filter(c => c._id !== chatId)
        }));
    }
}));
