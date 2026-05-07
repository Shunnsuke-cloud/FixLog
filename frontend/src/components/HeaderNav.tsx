"use client";

import Link from 'next/link';
import { useAuth } from '../lib/AuthProvider';

export default function HeaderNav() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white/70">
      <div className="container flex items-center justify-between py-4">
        <Link href="/">
          <strong>FixLog</strong>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/posts">投稿</Link>
          <Link href="/posts/new">新規投稿</Link>
          {user ? (
            <>
              <span className="text-slate-600">{user.username}</span>
              <button className="btn" onClick={logout} type="button">
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
