'use client';

import { useState, useEffect } from 'react';
import { Todo, User, TodoStatus } from '../types';
import { TodoService } from '../services/todoService';
import { UserService } from '../services/userService';

interface TodoListProps {
    onEditTodo?: (todo: Todo) => void;
    onTodoUpdated?: () => void;
}

export default function TodoList({ onEditTodo, onTodoUpdated }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTodos();
        loadUsers();
    }, []);

    const loadTodos = async () => {
        try {
            setIsLoading(true);
            const todosData = await TodoService.getAllTodos();
            setTodos(todosData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load todos');
        } finally {
            setIsLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await UserService.getAllUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            await TodoService.deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id));
            if (onTodoUpdated) {
                onTodoUpdated();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete todo');
        }
    };

    const handleStatusChange = async (id: string, status: TodoStatus) => {
        try {
            await TodoService.updateTodoStatus(id, status);
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, status } : todo
            ));
            if (onTodoUpdated) {
                onTodoUpdated();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update todo status');
        }
    };

    const getUserName = (userId?: number) => {
        if (!userId) return 'Unassigned';
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    };

    const getStatusColor = (status: TodoStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-400';
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
                <div className="flex justify-center items-center h-32">
                    <div className="text-zinc-600 dark:text-zinc-400">Loading todos...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                    Todo List
                </h2>
                <button
                    onClick={loadTodos}
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

            {todos.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                    No todos found. Create your first todo!
                </div>
            ) : (
                <div className="space-y-4">
                    {todos.map(todo => (
                        <div
                            key={todo.id}
                            className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium text-black dark:text-zinc-50">
                                    {todo.title}
                                </h3>
                                <div className="flex gap-2">
                                    <select
                                        value={todo.status}
                                        onChange={(e) => handleStatusChange(todo.id!, e.target.value as TodoStatus)}
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                                {todo.description}
                            </p>

                            <div className="flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="flex gap-4">
                                    <span>Assigned to: {getUserName(todo.assignedTo)}</span>
                                    {todo.createdAt && (
                                        <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {onEditTodo && (
                                        <button
                                            onClick={() => onEditTodo(todo)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id!)}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
