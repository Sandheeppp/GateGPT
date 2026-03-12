"use client";
import { useState, useEffect } from 'react';
import {
    Bookmark, Search, Trash2, Edit3,
    Download, ExternalLink, Calendar, BookOpen,
    FileText, Tag as TagIcon, MoreVertical, X as XIcon, Share2, Plus
} from 'lucide-react';
import api from '@/lib/axios';

export default function NotesPage() {
    const [notes, setNotes] = useState<{ _id: string, title: string, content: string, subject: string, isBookmarked: boolean, createdAt: string }[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<{ _id: string, title: string, content: string, subject: string, isBookmarked: boolean, createdAt: string } | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', subject: '' });

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/notes');
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/notes', newNote);
            setNewNote({ title: '', content: '', subject: '' });
            setIsCreateModalOpen(false);
            fetchNotes();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (globalThis.confirm?.('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${id}`);
                fetchNotes();
                if (selectedNote?._id === id) setSelectedNote(null);
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    };

    const toggleBookmark = async (note: { _id: string, isBookmarked: boolean }, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/notes/${note._id}`, { isBookmarked: !note.isBookmarked });
            fetchNotes();
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Bookmark className="text-orange-500" /> My Notes & Bookmarks
                    </h1>
                    <p className="text-gray-400">Your curated collection of AI insights and personal study notes.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl text-sm font-bold transition-all flex items-center gap-2 uppercase tracking-widest text-white"
                >
                    <Plus size={16} /> New Note
                </button>
            </header>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search your notes..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 p-4 text-white focus:outline-none focus:border-orange-500 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-900/40 border border-gray-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div
                            key={note._id}
                            onClick={() => setSelectedNote(note)}
                            className="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl hover:border-gray-700 transition-all group flex flex-col justify-between h-80 relative overflow-hidden cursor-pointer"
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full bg-orange-500 transition-opacity ${note.isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-500/20">{note.subject}</span>
                                    <button
                                        onClick={(e) => toggleBookmark(note, e)}
                                        className={`${note.isBookmarked ? 'text-orange-500' : 'text-gray-600 hover:text-white'} transition-colors`}
                                    >
                                        <Bookmark size={18} fill={note.isBookmarked ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-orange-400 transition-colors uppercase leading-tight line-clamp-2">{note.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed italic">{note.content}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">
                                    <Calendar size={12} /> {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all"><Edit3 size={14} /></button>
                                        <button
                                            onClick={(e) => handleDeleteNote(note._id, e)}
                                            className="p-2 bg-gray-800/50 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <button
                                        className="flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest transition-colors"
                                    >
                                        Open Note <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Note Modal */}
            {selectedNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-800 max-w-2xl w-full rounded-3xl p-10 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
                        >
                            <XIcon size={24} />
                        </button>

                        <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-orange-500/20 mb-6 inline-block">
                            {selectedNote.subject}
                        </span>
                        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">{selectedNote.title}</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-400 leading-loose text-lg whitespace-pre-wrap">{selectedNote.content}</p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                                    <Download size={16} /> Export PDF
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                                    <Share2 size={16} /> Share
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Created: {new Date(selectedNote.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Note Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-800 max-w-md w-full rounded-3xl p-10 relative shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Create New Note</h2>
                        <form onSubmit={handleCreateNote} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                                <input
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                                    value={newNote.subject}
                                    onChange={e => setNewNote({ ...newNote, subject: e.target.value })}
                                    placeholder="e.g. Operating Systems"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                                <input
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                                    value={newNote.title}
                                    onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                                    placeholder="Note title"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none"
                                    value={newNote.content}
                                    onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                                    placeholder="Your note content..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-gray-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-white"
                                >
                                    Save Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!loading && filteredNotes.length === 0 && (
                <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-gray-800 rounded-3xl opacity-20">
                    <FileText size={64} className="mb-6" />
                    <h3 className="text-xl font-bold">No notes found</h3>
                    <p className="max-w-xs mt-2 mx-auto">Try a different search term or create a new note.</p>
                </div>
            )}
        </div>
    );
}

