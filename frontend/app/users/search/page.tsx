"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../src/lib/AuthProvider';

type UserResult = {
  id: number;
  username: string;
  email: string;
  profile: string | null;
  createdAt: string;
};

export default function UserSearchPage() {
  const { authReady } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data?.success) {
        setResults(data.data ?? []);
      }
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  if (!authReady) {
    return (
      <main className="container p-6">
        <p className="text-sm text-slate-600">認証を確認しています...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">ユーザー検索</h1>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ユーザー名またはメールアドレスで検索"
          className="input flex-1"
        />
        <button type="submit" className="btn btn-primary">
          検索
        </button>
      </form>

      {loading && <p className="mt-4 text-sm text-slate-600">検索中...</p>}

      {searched && results.length === 0 && !loading && (
        <p className="mt-4 text-sm text-slate-600">検索結果がありません</p>
      )}

      <div className="mt-6 space-y-3">
        {results.map((user) => (
          <Link key={user.id} href={`/users/${user.username}`}>
            <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-orange-300 hover:shadow">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{user.username}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  {user.profile && <p className="mt-2 text-sm text-slate-700">{user.profile}</p>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
