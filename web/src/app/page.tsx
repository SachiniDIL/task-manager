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
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateSort, setDateSort] = useState('earliest');

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setError(null);
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

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'pending') return !task.completed;
    if (statusFilter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return dateSort === 'earliest'
      ? a.dueDate.localeCompare(b.dueDate)
      : b.dueDate.localeCompare(a.dueDate);
  });

  function refreshTasks() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Your personal workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Task Manager
            </h1>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Stay organised, focus on what matters, and get things done.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <TaskDialog onTaskCreated={refreshTasks} />
          </div>
        </header>

        {/* Overview cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e6dcfa] bg-[#f1ebfc] p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#66558b]">
                Total Tasks
              </p>
              <span className="rounded-xl bg-white/70 px-3 py-2 text-lg">
                📋
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-[#49376e]">
              {isLoading ? '—' : totalTasks}
            </p>
            <p className="mt-1 text-xs text-[#766795]">
              All your tasks in one place
            </p>
          </div>

          <div className="rounded-2xl border border-[#d5eddf] bg-[#e9f7ef] p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#47745b]">
                Completed
              </p>
              <span className="rounded-xl bg-white/70 px-3 py-2 text-lg">
                ✓
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-[#315b43]">
              {isLoading ? '—' : completedTasks}
            </p>
            <p className="mt-1 text-xs text-[#648b73]">
              Tasks you have finished
            </p>
          </div>

          <div className="rounded-2xl border border-[#f5dfd1] bg-[#fff0e7] p-5 shadow-sm sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#94664d]">
                Pending
              </p>
              <span className="rounded-xl bg-white/70 px-3 py-2 text-lg">
                ◷
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-[#754a34]">
              {isLoading ? '—' : pendingTasks}
            </p>
            <p className="mt-1 text-xs text-[#a77a61]">
              Tasks still waiting for you
            </p>
          </div>
        </section>

        {/* Task list */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex flex-col gap-5 border-b p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">
                Your Tasks
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your tasks and track your progress.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium">
                  Filter
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm sm:flex-none"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="date-sort" className="text-sm font-medium">
                  Sort
                </label>
                <select
                  id="date-sort"
                  value={dateSort}
                  onChange={(event) => setDateSort(event.target.value)}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm sm:flex-none"
                >
                  <option value="earliest">Earliest First</option>
                  <option value="latest">Latest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="h-12 flex-1 rounded-lg" />
                    <Skeleton className="h-12 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    refreshTasks();
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  ✨
                </div>
                <h3 className="font-semibold">No tasks yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first task and start organising your day.
                </p>
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No {statusFilter} tasks found.
              </div>
            ) : (
              <>
                {/* Mobile task cards */}
                <div className="space-y-3 md:hidden">
                  {sortedTasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-xl border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words font-semibold">
                            {task.title}
                          </h3>
                          <p className="mt-1 break-words text-sm text-muted-foreground">
                            {task.description || 'No description'}
                          </p>
                        </div>

                        <Badge
                          className={
                            task.completed
                              ? 'shrink-0 border-0 bg-[#dff3e6] text-[#356348] hover:bg-[#dff3e6]'
                              : 'shrink-0 border-0 bg-[#fff0d9] text-[#87602e] hover:bg-[#fff0d9]'
                          }
                        >
                          {task.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 border-t pt-3">
                        <p className="text-xs text-muted-foreground">
                          Due date: {task.dueDate || 'Not set'}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <TaskDialog
                            key={`${task.id}-${task.updatedAt}`}
                            task={task}
                            onTaskCreated={refreshTasks}
                          />
                          <TaskDeleteDialog
                            taskId={task.id}
                            onTaskDeleted={refreshTasks}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Desktop and tablet table */}
                <div className="hidden overflow-x-auto md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-40">Title</TableHead>
                        <TableHead className="min-w-48">Description</TableHead>
                        <TableHead className="min-w-32">Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="min-w-40">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sortedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="max-w-56 font-medium">
                            <span className="break-words">{task.title}</span>
                          </TableCell>

                          <TableCell className="max-w-72 text-muted-foreground">
                            <span className="break-words">
                              {task.description || '—'}
                            </span>
                          </TableCell>

                          <TableCell>
                            {task.dueDate || '—'}
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={
                                task.completed
                                  ? 'border-0 bg-[#dff3e6] text-[#356348] hover:bg-[#dff3e6]'
                                  : 'border-0 bg-[#fff0d9] text-[#87602e] hover:bg-[#fff0d9]'
                              }
                            >
                              {task.completed ? 'Completed' : 'Pending'}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <TaskDialog
                                key={`${task.id}-${task.updatedAt}`}
                                task={task}
                                onTaskCreated={refreshTasks}
                              />
                              <TaskDeleteDialog
                                taskId={task.id}
                                onTaskDeleted={refreshTasks}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-muted-foreground">
          Made to help you stay organised.
        </footer>
      </div>
    </main>
  );
}
