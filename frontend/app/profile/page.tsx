"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../src/lib/AuthProvider';
import Toast from '../../src/components/Toast';

type ProfileData = {
  id: number;
  email: string;
  username: string;
  profile: string | null;
  createdAt: string;
};

export default function ProfilePage() {
  const { token, user, authReady, logout } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editProfile, setEditProfile] = useState('');
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!authReady || !token) {
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) {
          setProfileData(data.data);
          setEditUsername(data.data.username);
          setEditProfile(data.data.profile ?? '');
        } else {
          setError(data?.error ?? 'プロフィール取得に失敗しました');
        }
      })
      .catch(() => setError('プロフィール取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [authReady, token]);

  async function handleUpdate() {
    if (!token) return;
    if (!editUsername.trim()) {
      setToast({ message: 'ユーザー名は必須です', variant: 'error' });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: editUsername.trim(), profile: editProfile.trim() || null }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? '更新に失敗しました');
      setProfileData(data.data);
      setIsEditing(false);
      setToast({ message: 'プロフィールを更新しました', variant: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message ?? 'エラーが発生しました', variant: 'error' });
    }
  }

  if (!authReady || !user) {
    return (
      <main className="p-6">
        <p className="text-sm text-slate-600">認証を確認しています...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-slate-600">プロフィールを読み込んでいます...</p>
      </main>
    );
  }

  if (error || !profileData) {
    return (
      <main className="p-6">
        <p className="text-sm text-rose-600">{error ?? 'プロフィールが見つかりません'}</p>
        <div className="mt-4">
          <Link href="/posts" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            投稿一覧へ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">プロフィール</h1>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                {profileData.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{profileData.username}</h2>
                <p className="text-sm text-slate-600">{profileData.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                編集
              </button>
            </div>

            {profileData.profile && (
              <div className="mt-6 rounded-lg bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">自己紹介</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{profileData.profile}</p>
              </div>
            )}

            <div className="mt-6 text-sm text-slate-600">
              <p>メンバーになった日: {new Date(profileData.createdAt).toLocaleDateString('ja-JP')}</p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800">ユーザー名</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="input mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800">自己紹介</label>
              <textarea
                value={editProfile}
                onChange={(e) => setEditProfile(e.target.value)}
                className="input mt-1 w-full"
                rows={4}
                placeholder="自己紹介を入力してください（200文字まで推奨）"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-slate-500">{editProfile.length}/500</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="btn btn-primary"
              >
                保存
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 flex gap-4">
        <Link href="/posts" className="text-sm text-slate-600 hover:text-orange-600">
          投稿一覧へ戻る
        </Link>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-rose-600 hover:text-rose-700"
        >
          ログアウト
        </button>
      </section>

      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </main>
  );
}
