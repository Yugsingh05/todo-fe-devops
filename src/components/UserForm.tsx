'use client';

import { useState, useEffect } from 'react';
import { User } from '../types';
import { UserService } from '../services/userService';

interface UserFormProps {
    user?: User;
    onUserSaved?: (user: User) => void;
    onCancel?: () => void;
}

export default function UserForm({ user, onUserSaved, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState<User>({
        name: '',
        age: 0,
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let savedUser: User[];

            // Prepare data for API - exclude undefined values
            const apiData = {
                name: formData.name,
                age: formData.age,
                email: formData.email
            };

            if (user?.id) {
                // Update existing user
                savedUser = await UserService.updateUser(user.id, apiData);
            } else {
                // Create new user
                savedUser = await UserService.createUser(apiData);
            }

            setSuccess(user?.id ? 'User updated successfully!' : 'User created successfully!');

            if (onUserSaved) {
                onUserSaved(savedUser[0]);
            }

            if (!user?.id) {
                setFormData({ name: '', age: 0, email: '' });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6 text-center">
                {user?.id ? 'Edit User' : 'Create New User'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                        placeholder="Enter user name"
                    />
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="120"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                        placeholder="Enter age"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                        placeholder="Enter email address"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {isLoading ? 'Saving...' : (user?.id ? 'Update User' : 'Create User')}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-zinc-500 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
