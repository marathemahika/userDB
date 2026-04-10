import React from 'react';
import { Pencil, Trash2, MoreVertical } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete }) => {
    
    if (!users || users.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No users found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="table-container glass-panel">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Age</th>
                        <th>Last Login</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>
                                <div className="user-info">
                                    <div className="avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info-text">
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span style={{ opacity: 0.9 }}>{user.role}</span>
                            </td>
                            <td>
                                <span className={`badge ${user.status === 'Active' ? 'badge-active' : 'badge-suspended'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td>{user.age}</td>
                            <td>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {new Date(user.lastLogin || user.createdAt).toLocaleDateString()}
                                </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button onClick={() => onEdit(user)} className="btn-icon" title="Edit">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => onDelete(user._id)} className="btn-icon" title="Delete" style={{ color: 'var(--danger-color)' }}>
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="btn-icon" title="More">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
