import express from 'express';
import { createUser, getUsers, updateUser, deleteUser, searchUsers } from '../controllers/userController.js';

const router = express.Router();

// Route for searching & filtering (must be before /:id)
router.get('/search', searchUsers);

// CRUD routes
router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
