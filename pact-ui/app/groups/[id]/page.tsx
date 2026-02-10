'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { TaskCard } from '@/features/tasks/TaskCard';
import { TaskForm } from '@/features/tasks/TaskForm';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/Loading';
import { tasksAPI, groupsAPI } from '@/lib/api';
import type { Task, Group, CreateTaskDto } from '@/types';
import { Role } from '@/types';

export default function GroupDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && groupId) {
      loadGroupData();
    }
  }, [user, authLoading, router, groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const groupsData = await groupsAPI.list();

      const foundGroup = groupsData.find((g) => g.id === groupId);
      if (!foundGroup) {
        router.push('/groups');
        return;
      }

      setGroup(foundGroup);

      // Try to load tasks (requires ADMIN role per backend)
      // Backend restriction: only ADMIN can view tasks
      let detectedRole: Role | null = null;
      try {
        const tasksData = await tasksAPI.getShared(groupId);
        setTasks(tasksData);
        detectedRole = Role.ADMIN; // If we can view tasks, we're ADMIN
      } catch (taskError) {
        // If user doesn't have ADMIN role, tasks will be empty
        setTasks([]);
        // Try to determine if user is EDITOR by attempting to create (but we won't actually create)
        // For now, we'll assume they're VIEWER or EDITOR if they can't view
        // The actual role will be determined when they try to create
        detectedRole = null;
      }

      setUserRole(detectedRole);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateTaskDto) => {
    try {
      const newTask = await tasksAPI.createShared(groupId, data);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
      // If creation succeeds, user is at least EDITOR
      if (userRole !== Role.ADMIN) {
        setUserRole(Role.EDITOR);
      }
    } catch (err) {
      // If creation fails due to permissions, user is VIEWER
      if (err instanceof Error && err.message.includes('403')) {
        setUserRole(Role.VIEWER);
      }
      throw err;
    }
  };

  // Can create if ADMIN or EDITOR (backend allows both)
  // If role is null, we'll try and let the backend decide
  const canCreateTask = userRole === null || userRole === Role.ADMIN || userRole === Role.EDITOR;

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user || !group) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Shared tasks for this group
            </p>
            {userRole && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Your role: {userRole}
              </p>
            )}
          </div>
          {canCreateTask && (
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Task'}
            </Button>
          )}
        </div>

        {!canCreateTask && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400">
            You need ADMIN or EDITOR role to create tasks in this group.
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {showForm && canCreateTask && (
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No shared tasks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {canCreateTask
                ? 'Create the first shared task for this group'
                : 'No tasks have been created in this group yet'}
            </p>
            {canCreateTask && (
              <Button onClick={() => setShowForm(true)}>Create Task</Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} canEdit={canCreateTask} canDelete={false} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

