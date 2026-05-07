"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../src/lib/AuthProvider';
import Toast from '../../../src/components/Toast';

type UserProfile = {
  id: number;
  username: string;
  email: string;
  profile: string | null;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};

type PostItem = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  user?: { username: string };
};

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const { user: currentUser, token, authReady } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error' } | null>(null);

  const username = params?.username;
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (!username) {
      setError('ユーザー名が不正です');
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/${username}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.success) setUserProfile(d.data);
          else setError('ユーザーが見つかりません');
        }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/posts/${username}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.success) setPosts(d.data ?? []);
        }),
    ])
      .catch(() => setError('読み込みに失敗しました'))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!authReady || !token || !userProfile || isOwnProfile) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userProfile.id}/following`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) setIsFollowing(d.data.isFollowing);
      })
      .catch(() => {});
  }, [authReady, token, userProfile, isOwnProfile]);

  async function toggleFollow() {
    if (!token || !userProfile) return;

    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userProfile.id}/follow`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? '処理に失敗しました');
      setIsFollowing(!isFollowing);
      setToast({
        message: isFollowing ? 'フォロー解除しました' : 'フォローしました',
        variant: 'success',
      });
    } catch (err: any) {
      setToast({ message: err?.message ?? 'エラーが発生しました', variant: 'error' });
    }
  }

  if (!authReady) {
    return (
      <main className="container p-6">
        <p className="text-sm text-slate-600">認証を確認しています...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container p-6">
        <p className="text-sm text-slate-600">読み込み中...</p>
      </main>
    );
  }

  if (error || !userProfile) {
    return (
      <main className="container p-6">
        <p className="text-sm text-rose-600">{error ?? 'ユーザーが見つかりません'}</p>
        <Link href="/users/search" className="mt-4 inline-block text-sm text-orange-600">
          ユーザー検索に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-3xl font-bold text-white">
            {userProfile.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{userProfile.username}</h1>
            <p className="text-sm text-slate-600">{userProfile.email}</p>
            {userProfile.profile && (
              <p className="mt-2 text-sm text-slate-700">{userProfile.profile}</p>
            )}
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="font-semibold text-slate-900">{userProfile._count.posts}</span>
                <span className="ml-1 text-slate-600">投稿</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">{userProfile._count.followers}</span>
                <span className="ml-1 text-slate-600">フォロワー</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">{userProfile._count.following}</span>
                <span className="ml-1 text-slate-600">フォロー中</span>
              </div>
            </div>
          </div>
          <div>
            {!isOwnProfile && currentUser ? (
              <button
                type="button"
                onClick={toggleFollow}
                className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
              >
                {isFollowing ? 'フォロー中' : 'フォロー'}
              </button>
            ) : isOwnProfile ? (
              <Link href="/profile" className="btn btn-secondary">
                プロフィール編集
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900">投稿 ({posts.length})</h2>
        <div className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-slate-600">まだ投稿がありません</p>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-orange-300 hover:shadow">
                  <h3 className="font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-700">{post.description}</p>
                  <div className="mt-3 text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleString('ja-JP')}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <div className="mt-8">
        <Link href="/users/search" className="text-sm text-slate-600 hover:text-orange-600">
          ユーザー検索に戻る
        </Link>
      </div>

      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </main>
  );
}
