'use client';

import { useState, useEffect } from 'react';
import { Todo, User } from '../types';
import { TodoService } from '../services/todoService';
import { UserService } from '../services/userService';

interface TodoFormProps {
    todo?: Todo;
    onTodoSaved?: (todo: Todo) => void;
    onCancel?: () => void;
}

export default function TodoForm({ todo, onTodoSaved, onCancel }: TodoFormProps) {
    const [formData, setFormData] = useState<Todo>({
        title: '',
        description: '',
        completed: false,
        assignedTo: undefined,
        status: 'pending'
    });
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (todo) {
            setFormData(todo);
        }
        loadUsers();
    }, [todo]);

    const loadUsers = async () => {
        try {
            const usersData = await UserService.getAllUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                name === 'assignedTo' ? (value ? parseInt(value) : undefined) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let savedTodo: Todo[];

            // Prepare data for API - exclude undefined values and handle completedAt
            const apiData = {
                title: formData.title,
                description: formData.description,
                completed: formData.completed,
                assignedTo: formData.assignedTo || undefined,
                status: formData.status
            };

            if (todo?.id) {
                // Update existing todo
                savedTodo = await TodoService.updateTodo(todo.id, apiData);
            } else {
                // Create new todo
                savedTodo = await TodoService.createTodo(apiData);
            }

            setSuccess(todo?.id ? 'Todo updated successfully!' : 'Todo created successfully!');

            if (onTodoSaved) {
                onTodoSaved(savedTodo[0]);
            }

            if (!todo?.id) {
                setFormData({
                    title: '',
                    description: '',
                    completed: false,
                    assignedTo: undefined,
                    status: 'pending'
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save todo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6 text-center">
                {todo?.id ? 'Edit Todo' : 'Create New Todo'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                        placeholder="Enter todo title"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                        placeholder="Enter todo description"
                    />
                </div>

                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Assign To
                    </label>
                    <select
                        id="assignedTo"
                        name="assignedTo"
                        value={formData.assignedTo || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                    >
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50"
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="completed"
                        name="completed"
                        checked={formData.completed}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="completed" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                        Mark as completed
                    </label>
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
                        {isLoading ? 'Saving...' : (todo?.id ? 'Update Todo' : 'Create Todo')}
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
