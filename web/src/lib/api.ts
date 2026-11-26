import type { Task } from '@/types/task';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function handleResponseError(
  response: Response,
  defaultMessage: string,
): Promise<never> {
  const errorData: unknown = await response.json().catch(() => null);

  if (
    typeof errorData === 'object' &&
    errorData !== null &&
    'message' in errorData
  ) {
    const message = errorData.message;

    if (typeof message === 'string') {
      throw new Error(message);
    }

    if (Array.isArray(message)) {
      throw new Error(message.join(', '));
    }
  }

  throw new Error(defaultMessage);
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    await handleResponseError(response, 'Failed to fetch tasks');
  }

  return response.json() as Promise<Task[]>;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | null;
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
    await handleResponseError(response, 'Failed to create task');
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
    await handleResponseError(response, 'Failed to update task');
  }

  return response.json() as Promise<Task>;
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleResponseError(response, 'Failed to delete task');
  }
}