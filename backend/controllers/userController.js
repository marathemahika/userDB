import User from '../models/User.js';

// Create a new user
export const createUser = async (req, res) => {
    try {
        const { name, email, age, hobbies, bio, userId, role, status } = req.body;
        const newUser = new User({
            name,
            email,
            age,
            hobbies,
            bio,
            userId,
            role,
            status
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all users (with optional pagination and sorting)
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 50, sortBy = 'createdAt', order = 'desc' } = req.query;
        
        const users = await User.find()
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const count = await User.countDocuments();
        
        res.status(200).json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalUsers: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user by ID
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, // Return the updated document
            runValidators: true // Enforce schema validations
        });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search, Filter and Queriying
export const searchUsers = async (req, res) => {
    try {
        const { name, email, minAge, maxAge, hobbies, bio, role, status } = req.query;
        let query = {};

        // 1. Search by name (using regex for partial matching)
        if (name) query.name = { $regex: name, $options: 'i' };

        // 2. Filter by email
        if (email) query.email = email;

        // 3. Filter by age range
        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = Number(minAge);
            if (maxAge) query.age.$lte = Number(maxAge);
        }

        // 4. Find users based on hobbies (matches if array contains any of the provided hobbies)
        if (hobbies) {
            const hobbiesArray = hobbies.split(',').map(h => h.trim());
            query.hobbies = { $in: hobbiesArray };
        }

        // 5. Text search on bio (using $text index)
        if (bio) {
            query.$text = { $search: bio };
        }

        // 6. Additional Frontend Filters
        if (role) query.role = role;
        if (status) query.status = status;

        const users = await User.find(query);
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
