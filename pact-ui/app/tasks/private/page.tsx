'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { TaskCard } from '@/features/tasks/TaskCard';
import { TaskForm } from '@/features/tasks/TaskForm';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/Loading';
import { tasksAPI, friendsAPI } from '@/lib/api';
import type { Task, CreatePrivateTaskDto } from '@/types';
import type { Friendship } from '@/types';

export default function PrivateTasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [friends, setFriends] = useState<Array<{ id: string; username: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, friendsData] = await Promise.all([
        tasksAPI.getPrivate(),
        friendsAPI.listFriends(),
      ]);
      
      setTasks(tasksData);
      
      // Extract friends from friendships
      const friendList = friendsData
        .map((f: Friendship) => {
          if (f.requester?.id === user?.id) return f.receiver;
          if (f.receiver?.id === user?.id) return f.requester;
          return null;
        })
        .filter(Boolean)
        .map((f) => ({ id: f!.id, username: f!.username }));
      
      setFriends(friendList);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreatePrivateTaskDto) => {
    try {
      const newTask = await tasksAPI.createPrivate(data);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (task: Task) => {
    try {
      const updated = await tasksAPI.updatePrivate(task.id, {
        completed: task.completed,
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
      });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await tasksAPI.deletePrivate(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Private Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tasks shared with your friends
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} disabled={friends.length === 0}>
            {showForm ? 'Cancel' : '+ New Task'}
          </Button>
        </div>

        {friends.length === 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400">
            You need to have friends before creating private tasks. Go to the Friends page to add friends.
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {showForm && friends.length > 0 && (
          <TaskForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isPrivate
            friends={friends}
          />
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} className="h-32" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No private tasks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create a task and assign it to a friend
            </p>
            {friends.length > 0 && (
              <Button onClick={() => setShowForm(true)}>Create Task</Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                canDelete={task.ownerId === user.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

