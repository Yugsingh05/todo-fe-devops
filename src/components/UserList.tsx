'use client';

import { useState, useEffect } from 'react';
import { User } from '../types';
import { UserService } from '../services/userService';

interface UserListProps {
    onEditUser?: (user: User) => void;
    onUserUpdated?: () => void;
}

export default function UserList({ onEditUser, onUserUpdated }: UserListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const usersData = await UserService.getAllUsers();
            setUsers(usersData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await UserService.deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
                <div className="flex justify-center items-center h-32">
                    <div className="text-zinc-600 dark:text-zinc-400">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                    Users List
                </h2>
                <button
                    onClick={loadUsers}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {users.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                    No users found. Create your first user!
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-700">
                                <th className="text-left py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">Name</th>
                                <th className="text-left py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">Age</th>
                                <th className="text-right py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200">
                                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                        {user.id}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-black dark:text-zinc-50">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                        {user.email}
                                    </td>
                                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                        {user.age}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {onEditUser && (
                                                <button
                                                    onClick={() => onEditUser(user)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user.id!)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
