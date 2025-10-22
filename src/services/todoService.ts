import { Todo, TodoStatus } from "../types";

export const API_BASE_URL = "http://localhost:3002"
console.log(API_BASE_URL);
console.log("API_BASE_URL", API_BASE_URL);

export class TodoService {
  static async createTodo(
    todo: Omit<Todo, "id" | "createdAt" | "completedAt">
  ): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create todo: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async getTodoById(id: string): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todo: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async updateTodo(
    id: string,
    todo: Omit<Todo, "id" | "createdAt">
  ): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update todo: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async deleteTodo(id: string): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete todo: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async updateTodoStatus(
    id: string,
    status: TodoStatus
  ): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update todo status: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}
