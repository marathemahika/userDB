import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';
import api from '../api';
import UserTable from './UserTable';
import UserForm from './UserForm';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            // Using search endpoint for advanced filtering if filters exist, otherwise generic get
            if (searchTerm || filterRole || filterStatus) {
                const params = new URLSearchParams();
                if (searchTerm) {
                    // Try to differentiate if search term is for name or text search for bio
                    // Simple heuristic: if it contains spaces, maybe text search, otherwise name
                    // Based on requirements, text search in bio and search by name. 
                    // Let's pass it as name for simplicity, backend handles it.
                    params.append('name', searchTerm);
                }
                if (filterRole) params.append('role', filterRole);
                if (filterStatus) params.append('status', filterStatus);

                const res = await api.get(`/users/search?${params.toString()}`);
                setUsers(res.data);
            } else {
                const res = await api.get(`/users?sortBy=${sortBy}`);
                setUsers(res.data.users || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterRole, filterStatus, sortBy]);

    useEffect(() => {
        // Debounce search slightly
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchUsers]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingUser) {
                await api.put(`/users/${editingUser._id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            setIsFormOpen(false);
            setEditingUser(null);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'Error occurred');
        }
    };

    const openFormForEdit = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    return (
        <div>
            <header className="app-header">
                <div>
                    <h1 className="text-gradient hover-effect" style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>UserHub</h1>
                    <p className="text-secondary">Manage your organization's members efficiently.</p>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { setEditingUser(null); setIsFormOpen(true); }}
                >
                    <Plus size={20} /> Add User
                </button>
            </header>

            <div className="toolbar glass-panel" style={{ padding: '1rem', borderRadius: '12px' }}>
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        className="input-field search-input" 
                        placeholder="Search users by name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select 
                        className="input-field" 
                        value={filterRole} 
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                    </select>

                    <select 
                        className="input-field" 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                    
                    <select 
                        className="input-field" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="createdAt">Date added (Newest)</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="age">Age (Youngest)</option>
                    </select>

                    <button className="btn-icon" onClick={fetchUsers} title="Refresh">
                        <RefreshCw size={20} className={loading ? "spinning" : ""} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center' }}>
                    <RefreshCw size={32} className="spinning" style={{ color: 'var(--primary-color)', margin: '0 auto 1rem', display: 'block' }} />
                    <p>Loading users...</p>
                </div>
            ) : (
                <UserTable 
                    users={users} 
                    onEdit={openFormForEdit} 
                    onDelete={handleDelete} 
                />
            )}

            <UserForm 
                isOpen={isFormOpen} 
                onClose={() => { setIsFormOpen(false); setEditingUser(null); }} 
                onSubmit={handleFormSubmit} 
                editingUser={editingUser} 
            />

            <style dangerouslySetInnerHTML={{__html: `
                .spinning { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
};

export default Dashboard;
