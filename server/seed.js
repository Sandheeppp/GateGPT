const mongoose = require('mongoose');
const dotenv = require('dotenv');
const process = require('node:process');
const User = require('./models/User');
const Chat = require('./models/Chat');
const Message = require('./models/Message');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Find or Create a Test User
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = await User.create({
                name: 'GATE Aspirant',
                email: 'test@example.com',
                password: 'password123'
            });
            console.log('Created test user: test@example.com / password123');
        }

        // 2. Clear existing chats for this user to avoid duplicates if running multiple times
        // await Chat.deleteMany({ userId: user._id });
        // await Message.deleteMany({ userId: user._id });

        const sampleChats = [
            {
                title: 'Dijkstra\'s Algorithm complexity',
                messages: [
                    { role: 'user', content: 'What is the time complexity of Dijkstra\'s algorithm using a min-priority queue?' },
                    { role: 'assistant', content: 'Using a binary heap-based min-priority queue, the time complexity is $O((V+E) \\log V)$, where $V$ is the number of vertices and $E$ is the number of edges. If you use a Fibonacci heap, it can be improved to $O(E + V \\log V)$.' }
                ],
                isPinned: true
            },
            {
                title: 'OS Process Scheduling',
                messages: [
                    { role: 'user', content: 'Explain Round Robin scheduling with a small example.' },
                    { role: 'assistant', content: 'Round Robin (RR) is a preemptive scheduling algorithm where each process is assigned a fixed time slice (quantum). \n\n**Example:**\nProcesses: P1 (8ms), P2 (4ms), P3 (9ms). Quantum: 5ms.\n1. P1 runs for 5ms (3ms left).\n2. P2 runs for 4ms (finished).\n3. P3 runs for 5ms (4ms left).\n4. P1 runs for 3ms (finished).\n5. P3 runs for 4ms (finished).' }
                ]
            },
            {
                title: 'GATE 2024 DBMS MCQ',
                messages: [
                    { role: 'user', content: 'Give me an MCQ on Normalization.' },
                    { role: 'assistant', content: '**Question:** A relation R is in 3NF if and only if every non-prime attribute of R is:\nA) Partially dependent on the primary key\nB) Fully functionally dependent on every key\nC) Non-transitively dependent on every key\nD) Dependent on a non-prime attribute\n\n**Correct Answer: C**\n**Explanation:** 3NF eliminates transitive dependencies of non-prime attributes on candidate keys.' }
                ]
            }
        ];

        for (const sChat of sampleChats) {
            const chat = await Chat.create({
                userId: user._id,
                title: sChat.title,
                isPinned: sChat.isPinned || false
            });

            for (const sMsg of sChat.messages) {
                await Message.create({
                    chatId: chat._id,
                    role: sMsg.role,
                    content: sMsg.content
                });
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
