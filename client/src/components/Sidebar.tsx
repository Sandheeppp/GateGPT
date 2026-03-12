import { useEffect, useState, useMemo, memo } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
    Plus, MessageSquare, Pin, Archive, Trash2, LogOut,
    MoreHorizontal, HelpCircle, LayoutDashboard,
    BookOpen, PenTool, BarChart3, GraduationCap, FileText,
    Shield, Bookmark
} from 'lucide-react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

const ChatItem = memo(function ChatItem({ chat, isActive }: { chat: { _id: string, title: string, isPinned: boolean }, isActive: boolean }) {
    const { deleteChat, pinChat, updateChat } = useChatStore();
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(chat.title);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    const handleSave = async (e: React.FormEvent | React.FocusEvent) => {
        e.preventDefault();
        await updateChat(chat._id, { title });
        setEditing(false);
    };

    return (
        <Link
            href={`/chat/${chat._id}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-all text-xs ${isActive ? 'bg-gray-800 text-white shadow-sm' : 'hover:bg-gray-800/30 text-gray-500 hover:text-gray-300'}`}
        >
            <MessageSquare size={14} className={isActive ? 'text-blue-500' : ''} />
            {editing ? (
                <input
                    autoFocus
                    className="flex-1 bg-transparent border-b border-blue-500 outline-none py-0"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(e)}
                />
            ) : (
                <span className="flex-1 truncate">{chat.title}</span>
            )}

            <div className={`hidden gap-0.5 group-hover:flex ${isActive ? 'flex' : ''}`}>
                <button onClick={(e) => handleAction(e, () => setEditing(true))} className="p-0.5 hover:text-white"><MoreHorizontal size={12} /></button>
                <button onClick={(e) => handleAction(e, () => pinChat(chat._id))} className={`p-0.5 hover:text-white ${chat.isPinned ? 'text-blue-500' : ''}`}><Pin size={12} /></button>
                <button onClick={(e) => handleAction(e, () => deleteChat(chat._id))} className="p-0.5 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
        </Link>
    );
});

const Sidebar = memo(function Sidebar() {
    const { chats, fetchChats, createChat } = useChatStore();
    const { user, logout } = useAuthStore();
    const search = '';
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();

    useEffect(() => {
        if (chats.length === 0) {
            fetchChats();
        }
    }, [fetchChats, chats.length]);

    const { pinnedChats, recentChats } = useMemo(() => {
        const filtered = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
        return {
            pinnedChats: filtered.filter(c => c.isPinned),
            recentChats: filtered.filter(c => !c.isPinned)
        };
    }, [chats, search]);

    const handleNewChat = async () => {
        const chat = await createChat();
        router.push(`/chat/${chat._id}`);
    };

    const navItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
        { label: 'Chat', icon: <MessageSquare size={18} />, path: '/chat', action: handleNewChat },
        { label: 'Subject Explorer', icon: <BookOpen size={18} />, path: '/subjects' },
        { label: 'Practice Mode', icon: <PenTool size={18} />, path: '/practice' },
        { label: 'PYQ Solver', icon: <FileText size={18} />, path: '/pyq-solver' },
        { label: 'Revision Mode', icon: <GraduationCap size={18} />, path: '/revision' },
        { label: 'Mock Interview', icon: <Shield size={18} />, path: '/mock-interview' },
        { label: 'Notes & Bookmarks', icon: <Bookmark size={18} />, path: '/notes' },
        { label: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics' },
    ];

    return (
        <aside className="w-64 bg-chatgpt-sidebar flex flex-col h-screen text-gray-300 border-r border-gray-800 shrink-0">
            <div className="p-4 flex items-center gap-3 border-b border-gray-800">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">G</div>
                <span className="font-bold text-white text-lg tracking-tight">GateGPT</span>
            </div>

            <div className="p-2 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));

                    if (item.action) {
                        return (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200'}`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.path}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200'}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="my-2 border-t border-gray-800/50 mx-4" />

            <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                {pinnedChats.length > 0 && (
                    <div className="mb-4">
                        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pinned History</p>
                        {pinnedChats.map(chat => (
                            <ChatItem key={chat._id} chat={chat} isActive={params.id === chat._id} />
                        ))}
                    </div>
                )}

                <div className="mb-4">
                    <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recent Chats</p>
                    {recentChats.map(chat => (
                        <ChatItem key={chat._id} chat={chat} isActive={params.id === chat._id} />
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-800 space-y-3">
                <Link
                    href="/help"
                    className="flex items-center gap-3 px-3 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                    <HelpCircle size={14} />
                    Help & Support
                </Link>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/40 border border-gray-700/30 group">
                    <Link href="/profile" className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">GATE Aspirant</p>
                        </div>
                    </Link>
                    <button onClick={logout} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" title="Logout">
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
});

export default Sidebar;
