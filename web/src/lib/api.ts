import type { Task } from '@/types/task';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json() as Promise<Task[]>;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

export async function createTask(
  taskData: CreateTaskInput,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json() as Promise<Task>;
}

export async function updateTask(
  id: number,
  taskData: Partial<CreateTaskInput>,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json() as Promise<Task>;
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}