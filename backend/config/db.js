import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Added options to bypass common Windows DNS SRV bugs
        const conn = await mongoose.connect(process.env.MONGO_URI, { 
            family: 4 // Forces IPv4 which fixes ECONNREFUSED on some networks
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
