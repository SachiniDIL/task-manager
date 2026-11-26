'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/api';
import type { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TaskDialog from '@/components/task-dialog';
import TaskDeleteDialog from '@/components/task-delete-dialog';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch(() => {
        setError('Failed to load tasks. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshKey]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Task Manager
            </h1>
            <p className="mt-2 text-muted-foreground">
              Organise your work and keep track of your progress.
            </p>
          </div>

          <TaskDialog
            onTaskCreated={() => setRefreshKey((current) => current + 1)}
          />
        </header>

        {/* Task overview */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold">{totalTasks}</p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-2 text-3xl font-bold">{completedTasks}</p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="mt-2 text-3xl font-bold">{pendingTasks}</p>
          </div>
        </section>

        {/* Task list */}
        <section className="rounded-xl border bg-card">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Your Tasks</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage all your tasks in one place.
            </p>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading tasks...
              </div>
            ) : error ? (
              <div className="py-8 text-center text-destructive">
                {error}
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No tasks yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        {task.description || '—'}
                      </TableCell>
                      <TableCell>
                        {task.dueDate || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.completed ? 'default' : 'secondary'
                          }
                        >
                          {task.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TaskDialog
                          key={`${task.id}-${task.updatedAt}`}
                          task={task}
                          onTaskCreated={() => 
                            setRefreshKey((current) => current + 1)
                          }
                        />

                        <TaskDeleteDialog
                          taskId={task.id}
                          onTaskDeleted={() => setRefreshKey((current) => current + 1)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
