"use client";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChatStore } from '@/store/useChatStore';
import { GraduationCap } from 'lucide-react';

export default function ChatWindow({ chatId }: { chatId?: string }) {
    const { messages, fetchMessages, sendMessage, createChat, loading } = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (chatId) {
            fetchMessages(chatId);
        }
    }, [chatId, fetchMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (content: string) => {
        if (chatId) {
            sendMessage(chatId, content);
        } else {
            const newChat = await createChat(content.slice(0, 30) + (content.length > 30 ? '...' : ''));
            // Send the message first so it exists when the next page loads history
            await sendMessage(newChat._id, content);
            router.push(`/chat/${newChat._id}`);
        }
    };

    if (!chatId) {
        return (
            <div className="flex-1 flex flex-col h-full items-center justify-center p-8 bg-chatgpt-main relative">
                <div className="flex flex-col items-center justify-center mb-44">
                    <GraduationCap className="w-16 h-16 text-blue-500 mb-4" />
                    <h1 className="text-4xl font-bold text-white mb-8">How can I help your GATE prep?</h1>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
                        <SuggestionCard title="Explain Dijkstra's Algorithm" icon="🏃" onClick={() => handleSend("Explain Dijkstra's Algorithm with an example.")} />
                        <SuggestionCard title="Solve 2023 DBMS MCQ" icon="💾" onClick={() => handleSend("Show me a 2023 GATE DBMS MCQ and solve it.")} />
                        <SuggestionCard title="Revision: OS Scheduling" icon="⚙️" onClick={() => handleSend("Give me a quick revision summary of OS CPU scheduling.")} />
                        <SuggestionCard title="Tips for Discrete Math" icon="📐" onClick={() => handleSend("What are some important tips for Discrete Mathematics in GATE?")} />
                    </div>
                </div>
                <ChatInput onSend={handleSend} disabled={loading} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-chatgpt-main">
            <div className="flex-1 overflow-y-auto pb-44">
                {messages.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-500">Ask your first question about GATE...</h2>
                    </div>
                )}
                {messages.map((msg: { _id: string, role: 'user' | 'assistant', content: string }) => (
                    <MessageBubble key={msg._id} message={msg} chatId={chatId} />
                ))}
                {loading && (
                    <div className="py-8 w-full bg-chatgpt-ai">
                        <div className="max-w-3xl mx-auto flex gap-6 px-4">
                            <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center shrink-0">
                                🤖
                            </div>
                            <div className="typing-indicator flex gap-1 pt-3">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <ChatInput onSend={handleSend} disabled={loading} />
        </div>
    );
}

function SuggestionCard({ title, icon, onClick }: { title: string, icon: string, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="p-4 bg-[#343541] border border-gray-700 rounded-xl hover:bg-[#40414f] cursor-pointer transition-colors text-left group"
        >
            <span className="text-lg block mb-1">{icon}</span>
            <p className="text-sm font-medium text-gray-300 group-hover:text-white">{title}</p>
        </div>
    );
}
