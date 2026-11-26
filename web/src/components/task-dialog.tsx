'use client';

import { useState, type FormEvent } from 'react';
import { createTask, updateTask } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Task } from '@/types/task';

interface TaskDialogProps {
  onTaskCreated: () => void;
  task?: Task;
}

export default function TaskDialog({
  onTaskCreated,
    task,
}: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [completed, setCompleted] = useState(task?.completed ?? false);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
        const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        completed,
        dueDate: dueDate || undefined,
        };

        if (task) {
        await updateTask(task.id, taskData);
        } else {
        await createTask(taskData);
        }

        setTitle('');
        setDescription('');
        setCompleted(false);
        setDueDate('');
        setOpen(false);
        
        toast.success(task ? 'Task updated successfully!' : 'Task created successfully!');

        onTaskCreated();
    } catch {
        setError(
            task
            ? 'Failed to update task. Please try again.'
            : 'Failed to create task. Please try again.'
        );
    } finally {
        setIsSubmitting(false);
    }
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
        render={<Button />}
        >
            {task ? 'Edit Task' : 'Add Task'}
        </DialogTrigger>

        <DialogContent>
        <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'Create a Task'}</DialogTitle>
            <DialogDescription>
                {task ? 'Edit the details of your task below.' : 'Enter the details below to create a new task.'}
            </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
                Title
            </label>
            <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
                maxLength={200}
                required
            />
            </div>

            <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
                Description
            </label>
            <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter task description"
                maxLength={2000}
            />
            </div>

            <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
                Status
            </label>
            <select
                id="status"
                value={completed ? 'completed' : 'pending'}
                onChange={(event) =>
                setCompleted(event.target.value === 'completed')
                }
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
            </div>

            <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
            </label>
            <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
            />
            </div>

            {error && (
            <p className="text-sm text-destructive">{error}</p>
            )}

            <DialogFooter>
            <Button
                type="submit"
                disabled={isSubmitting || !title.trim()}
            >
               {isSubmitting
                    ? task
                        ? 'Saving...'
                        : 'Creating...'
                    : task
                        ? 'Save Changes'
                        : 'Create Task'}
            </Button>
            </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
    );
}