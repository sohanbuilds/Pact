'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/Loading';
import { friendsAPI } from '@/lib/api';
import type { Friendship } from '@/types';
import { FriendshipStatus } from '@/types';

export default function FriendsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [requests, setRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSending, setIsSending] = useState(false);
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
      const [friendsData, requestsData] = await Promise.all([
        friendsAPI.listFriends(),
        friendsAPI.getRequests(),
      ]);
      
      setFriends(friendsData);
      setRequests(requestsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('User ID is required');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      await friendsAPI.sendRequest(userId.trim());
      setUserId('');
      setShowSendForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send friend request');
    } finally {
      setIsSending(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await friendsAPI.acceptRequest(requestId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept request');
    }
  };

  const handleBlock = async (requestId: string) => {
    if (!confirm('Are you sure you want to block this request?')) {
      return;
    }

    try {
      await friendsAPI.blockRequest(requestId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to block request');
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

  const incomingRequests = requests.filter(
    (r) => r.receiverId === user.id && r.status === FriendshipStatus.PENDING
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Friends</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your friends and friend requests
            </p>
          </div>
          <Button onClick={() => setShowSendForm(!showSendForm)}>
            {showSendForm ? 'Cancel' : '+ Send Request'}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {showSendForm && (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSendRequest} className="space-y-4">
                <Input
                  label="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="Enter user ID to send friend request"
                />
                <div className="flex gap-2">
                  <Button type="submit" isLoading={isSending} className="flex-1">
                    Send Request
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowSendForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {incomingRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Incoming Requests
            </h2>
            {incomingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {request.requester?.username || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.requester?.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleBlock(request.id)}
                      >
                        Block
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Friends
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <LoadingSkeleton key={i} className="h-20" />
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👫</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No friends yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Send a friend request to get started
              </p>
              <Button onClick={() => setShowSendForm(true)}>Send Request</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friendship) => {
                const friend =
                  friendship.requesterId === user.id
                    ? friendship.receiver
                    : friendship.requester;

                if (!friend) return null;

                return (
                  <Card key={friendship.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {friend.username}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {friend.email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

