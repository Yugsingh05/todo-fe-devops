'use client';

import { useState } from "react";
import UserCreationForm from "../components/UserCreationForm";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { User, Todo } from "../types";

type ActiveView = 'users' | 'todos';
type ActiveForm = 'create-user' | 'edit-user' | 'create-todo' | 'edit-todo' | null;

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('users');
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleUserCreated = (user: User) => {
    console.log('User created:', user);
    setActiveForm(null);
  };

  const handleUserUpdated = () => {
    setActiveForm(null);
    setEditingUser(null);
  };

  const handleTodoUpdated = () => {
    setActiveForm(null);
    setEditingTodo(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setActiveForm('edit-user');
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setActiveForm('edit-todo');
  };

  const handleCancelForm = () => {
    setActiveForm(null);
    setEditingUser(null);
    setEditingTodo(null);
  };

  const renderContent = () => {
    if (activeForm === 'create-user') {
      return <UserCreationForm onUserCreated={handleUserCreated} />;
    }

    if (activeForm === 'edit-user' && editingUser) {
      return (
        <UserForm
          user={editingUser}
          onUserSaved={handleUserUpdated}
          onCancel={handleCancelForm}
        />
      );
    }

    if (activeForm === 'create-todo') {
      return (
        <TodoForm
          onTodoSaved={handleTodoUpdated}
          onCancel={handleCancelForm}
        />
      );
    }

    if (activeForm === 'edit-todo' && editingTodo) {
      return (
        <TodoForm
          todo={editingTodo}
          onTodoSaved={handleTodoUpdated}
          onCancel={handleCancelForm}
        />
      );
    }

    if (activeView === 'users') {
      return <UserList onEditUser={handleEditUser} onUserUpdated={handleUserUpdated} />;
    }

    return <TodoList onEditTodo={handleEditTodo} onTodoUpdated={handleTodoUpdated} />;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col py-8 px-4 bg-white dark:bg-black">
        {/* Header */}
        <div className="w-full flex justify-between items-start mb-8">
          <div className="flex flex-col items-start gap-6">
          
            <div className="flex flex-col items-start gap-6 text-left">
              <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Todo Management System
              </h1>
              <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Manage users and todos for your application. Create, edit, and track all your tasks efficiently.
              </p>
            </div>
          </div>


        </div>

        {/* Navigation Tabs */}
        <div className="w-full mb-8">
          <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => {
                setActiveView('users');
                setActiveForm(null);
                setEditingUser(null);
                setEditingTodo(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeView === 'users' && !activeForm
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-zinc-50 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50'
                }`}
            >
              Users
            </button>
            <button
              onClick={() => {
                setActiveView('todos');
                setActiveForm(null);
                setEditingUser(null);
                setEditingTodo(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeView === 'todos' && !activeForm
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-zinc-50 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50'
                }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {!activeForm && (
          <div className="w-full mb-6">
            <div className="flex gap-4">
              {activeView === 'users' ? (
                <>
                  <button
                    onClick={() => setActiveForm('create-user')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create New User
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveForm('create-todo')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create New Todo
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full flex justify-center">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
