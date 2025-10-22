// Shared types for the Todo Management System

export interface User {
  id?: number;
  name: string;
  age: number;
  email: string;
}

export interface Todo {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  assignedTo?: number;
  status: "pending" | "in_progress" | "completed";
  createdAt?: string;
  completedAt?: string | null;
}

export type TodoStatus = "pending" | "in_progress" | "completed";

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Form state types
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

// Component prop types
export interface BaseFormProps {
  onCancel?: () => void;
}

export interface UserFormProps extends BaseFormProps {
  user?: User;
  onUserSaved?: (user: User) => void;
}

export interface TodoFormProps extends BaseFormProps {
  todo?: Todo;
  onTodoSaved?: (todo: Todo) => void;
}

export interface ListProps {
  onEdit?: (item: User | Todo) => void;
  onUpdated?: () => void;
}
