'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/Loading';
import { tasksAPI, groupsAPI } from '@/lib/api';
import type { Task, Group } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ personal: 0, private: 0, shared: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadStats();
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      const [personal, privateTasks, groups] = await Promise.all([
        tasksAPI.getPersonal(),
        tasksAPI.getPrivate(),
        groupsAPI.list(),
      ]);

      // Count shared tasks from all groups
      let sharedCount = 0;
      for (const group of groups) {
        try {
          const tasks = await tasksAPI.getShared(group.id);
          sharedCount += tasks.length;
        } catch {
          // Ignore errors for individual groups
        }
      }

      setStats({
        personal: personal.length,
        private: privateTasks.length,
        shared: sharedCount,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's an overview of your tasks
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 font-mono">
            User ID: {user.id}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/tasks/personal">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Personal Tasks
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.personal}
                    </p>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks/private">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Private Tasks
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.private}
                    </p>
                  </div>
                  <div className="text-4xl">🔒</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks/shared">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Shared Tasks
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.shared}
                    </p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

