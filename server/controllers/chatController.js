const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const process = require('node:process');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user._id, isArchived: false }).sort({ isPinned: -1, updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createChat = async (req, res) => {
    try {
        const chat = await Chat.create({
            userId: req.user._id,
            title: req.body.title || 'New Chat',
        });
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.id }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendMessage = async (req, res) => {
    const { content } = req.body;
    const { id: chatId } = req.params;

    try {
        // Save user message
        await Message.create({
            chatId,
            role: 'user',
            content,
        });

        // Get chat history for context
        const history = await Message.find({ chatId }).sort({ createdAt: 1 }).limit(10);

        // Format history for Gemini
        // Gemini uses 'user' and 'model' roles
        const chatHistory = history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

        // System prompt for GATE (Gemini doesn't have a direct 'system' role in startChat, 
        // it's usually part of the first message or instructions)
        // System prompt for GATE
        const _systemInstruction = "You are GateGPT, an expert AI tutor for the GATE (Graduate Aptitude Test in Engineering) exam. You specialize in subjects like Data Structures, Algorithms, OS, DBMS, Computer Networks, and Mathematics. Provide step-by-step solutions, explain concepts clearly, and use LaTeX for mathematical formulas (e.g., $E=mc^2$ or $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$).";

        const chat = model.startChat({
            history: chatHistory.slice(0, -1), // Everything except the current message
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });

        // Send the message
        let assistantContent;
        try {
            const result = await chat.sendMessage(content);
            const response = await result.response;
            assistantContent = response.text();
        } catch (geminiError) {
            console.error("Primary Model Error:", geminiError);
            // Fallback strategy or specialized error message
            if (geminiError.status === 404) {
                throw new Error("AI Model not found or API key invalid for this model. Please check your GEMINI_API_KEY.");
            }
            throw geminiError;
        }

        // Save AI message
        const assistantMessage = await Message.create({
            chatId,
            role: 'assistant',
            content: assistantContent,
        });

        // Update chat's updatedAt for sorting
        await Chat.findByIdAndUpdate(chatId, { updatedAt: Date.now() });

        res.status(201).json(assistantMessage);
    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({
            message: error.message,
            details: error.stack
        });
    }
};

const updateChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChat = async (req, res) => {
    try {
        await Chat.findByIdAndDelete(req.params.id);
        await Message.deleteMany({ chatId: req.params.id });
        res.json({ message: 'Chat deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const shareChat = async (req, res) => {
    try {
        const shareId = crypto.randomBytes(16).toString('hex');
        const chat = await Chat.findByIdAndUpdate(req.params.id, { shareId }, { new: true });
        res.json({ shareId: chat.shareId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSharedChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({ shareId: req.params.shareId });
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
        res.json({ title: chat.title, messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChats,
    createChat,
    getMessages,
    sendMessage,
    updateChat,
    deleteChat,
    shareChat,
    getSharedChat
};
