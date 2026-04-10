import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    age: {
        type: Number,
        min: [0, 'Age must be at least 0'],
        max: [120, 'Age cannot exceed 120']
    },
    hobbies: [{
        type: String,
        trim: true
    }],
    bio: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Admin', 'User', 'Moderator'],
        default: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended'],
        default: 'Active'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes implementation
userSchema.index({ name: 1 }); // Single field index
userSchema.index({ email: 1, age: 1 }); // Compound index
userSchema.index({ hobbies: 1 }); // Multikey index
userSchema.index({ bio: 'text' }); // Text index
userSchema.index({ userId: 'hashed' }); // Hashed index
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 }); // TTL index (Expires in 1 year)

const User = mongoose.model('User', userSchema);

export default User;
