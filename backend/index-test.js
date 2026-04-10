import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const sampleUsers = [
    { name: 'Alice Smith', email: 'alice@example.com', age: 25, hobbies: ['reading', 'painting'], bio: 'Loves art and literature', userId: 'usr_1', role: 'Admin' },
    { name: 'Bob Jones', email: 'bob@example.com', age: 30, hobbies: ['gaming', 'coding'], bio: 'Full stack developer gamer', userId: 'usr_2' },
    { name: 'Charlie Davis', email: 'charlie@example.com', age: 22, hobbies: ['sports', 'music'], bio: 'Avid musician and athlete', userId: 'usr_3' },
    { name: 'Diana King', email: 'diana@example.com', age: 28, hobbies: ['reading', 'traveling'], bio: 'World traveler and reader', userId: 'usr_4', role: 'Moderator' },
    { name: 'Evan Wright', email: 'evan@example.com', age: 35, hobbies: ['coding', 'photography'], bio: 'Capturing moments with code', userId: 'usr_5' }
];

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data for a clean test
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Insert sample data
        await User.insertMany(sampleUsers);
        console.log('Inserted sample data');

        // Ensure indexes are built before executing explanation stats
        await User.syncIndexes();
        console.log('Indexes synchronized');

        console.log('\n--- Analyzing Query Performance ---\n');

        // 1. Single Field Index on "name"
        console.log('1. Single Field Index Query (name: "Alice Smith"):');
        let stats = await User.find({ name: 'Alice Smith' }).explain("executionStats");
        printStats(stats);

        // 2. Compound Index on "email" and "age"
        console.log('2. Compound Index Query (email: "bob@example.com", age: 30):');
        stats = await User.find({ email: 'bob@example.com', age: 30 }).explain("executionStats");
        printStats(stats);

        // 3. Multikey Index on "hobbies"
        console.log('3. Multikey Index Query (hobbies: "coding"):');
        stats = await User.find({ hobbies: 'coding' }).explain("executionStats");
        printStats(stats);

        // 4. Text Index on "bio"
        console.log('4. Text Index Query ($text search "developer"):');
        stats = await User.find({ $text: { $search: "developer" } }).explain("executionStats");
        printStats(stats);

        // 5. Hashed Index on "userId"
        console.log('5. Hashed Index Query (userId: "usr_3"):');
        stats = await User.find({ userId: 'usr_3' }).explain("executionStats");
        printStats(stats);

        console.log('\nTesting Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
};

const printStats = (explanation) => {
    // Handling different explain outputs based on mongoose/mongodb version
    // Typically executionStats is heavily detailed
    const stats = explanation.executionStats || (explanation[0] && explanation[0].executionStats) || explanation;
    
    // In newer MongoDB versions with mongoose, .explain returns an array with queryPlanner & executionStats 
    // or just executionStats directly depending on the model call
    const execStats = stats.executionStats ? stats.executionStats : stats;
    
    console.log(` - Keys Examined: ${execStats.totalKeysExamined ?? 'N/A'}`);
    console.log(` - Documents Examined: ${execStats.totalDocsExamined ?? 'N/A'}`);
    console.log(` - Execution Time (ms): ${execStats.executionTimeMillis ?? 'N/A'}`);
    console.log('----------------------------------------------------');
};

runTest();
