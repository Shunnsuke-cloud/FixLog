"use client";

import Link from 'next/link';
import { useAuth } from '../lib/AuthProvider';

export default function HeaderNav() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container flex items-center justify-between gap-6 py-2">
        <Link href="/">
          <strong className="text-2xl font-black text-orange-600">FixLog</strong>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link href="/posts" className="px-3 py-1 rounded border border-slate-300 text-slate-900 text-xs font-medium hover:bg-slate-50 transition">
            投稿
          </Link>
          <Link href="/posts/new" className="px-4 py-1 rounded bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">
            新規投稿
          </Link>
          <Link href="/users/search" className="px-3 py-1 rounded border border-slate-300 text-slate-900 text-xs font-medium hover:bg-slate-50 transition">
            ユーザー検索
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">{user.username}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
              <Link href="/profile" className="px-3 py-1 rounded border border-slate-300 bg-white text-slate-900 text-xs font-medium hover:bg-slate-50 transition">
                プロフィール
              </Link>
              <button className="px-3 py-1 rounded border border-slate-300 bg-white text-slate-900 text-xs font-medium hover:bg-slate-50 transition" onClick={logout} type="button">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-1 rounded border border-slate-300 text-slate-900 text-xs font-medium hover:bg-slate-50 transition">
                ログイン
              </Link>
              <Link href="/auth/register" className="px-3 py-1 rounded bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">
                登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
