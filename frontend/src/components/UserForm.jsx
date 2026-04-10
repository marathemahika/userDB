import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserForm = ({ isOpen, onClose, onSubmit, editingUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        hobbies: '',
        bio: '',
        userId: '',
        role: 'User',
        status: 'Active'
    });

    useEffect(() => {
        if (editingUser) {
            setFormData({
                ...editingUser,
                hobbies: Array.isArray(editingUser.hobbies) ? editingUser.hobbies.join(', ') : editingUser.hobbies
            });
        } else {
            // Generate a random user ID for new users if not provided
            setFormData({
                name: '', email: '', age: '', hobbies: '', bio: '',
                userId: `usr_${Math.floor(Math.random() * 10000)}`,
                role: 'User', status: 'Active'
            });
        }
    }, [editingUser, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            age: Number(formData.age),
            hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h)
        };
        onSubmit(submittedData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="btn-icon"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <div className="input-group">
                        <label>Name</label>
                        <input className="input-field" name="name" value={formData.name} onChange={handleChange} required minLength={3} placeholder="John Doe" />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input className="input-field" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Age</label>
                            <input className="input-field" type="number" name="age" value={formData.age} onChange={handleChange} required min={0} max={120} />
                        </div>
                        <div className="input-group">
                            <label>User ID</label>
                            <input className="input-field" type="text" name="userId" value={formData.userId} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Role</label>
                            <select className="input-field" name="role" value={formData.role} onChange={handleChange}>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Moderator">Moderator</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Status</label>
                            <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Hobbies (comma separated)</label>
                        <input className="input-field" type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Reading, Coding, Gaming" />
                    </div>

                    <div className="input-group">
                        <label>Bio (For Text Search)</label>
                        <textarea className="input-field" name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell us about yourself"></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingUser ? 'Save Changes' : 'Create User'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
