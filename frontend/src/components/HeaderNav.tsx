"use client";

import Link from 'next/link';
import { useAuth } from '../lib/AuthProvider';

export default function HeaderNav() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white/70">
      <div className="container flex items-center justify-between py-4">
        <Link href="/">
          <strong className="text-lg">FixLog</strong>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/posts">投稿</Link>
          <Link href="/posts/new">新規投稿</Link>
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">{user.username}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
              <Link href="/profile" className="text-slate-600 hover:text-orange-600">
                プロフィール
              </Link>
              <button className="btn btn-secondary" onClick={logout} type="button">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">ログイン</Link>
              <Link href="/auth/register">登録</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
