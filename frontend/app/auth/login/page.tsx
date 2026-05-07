"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../src/lib/AuthProvider';
import Toast from '../../../src/components/Toast';


export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const { login } = useAuth();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setToast({ message: '入力してください', variant: 'error' });
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await res.json();
    if (data?.success && data.data?.token && data.data?.user) {
      setToast({ message: 'ログイン成功。投稿一覧へ移動します...', variant: 'success' });
      setTimeout(() => {
        login(data.data.token, data.data.user, '/posts');
      }, 600);
    } else {
      setToast({ message: data?.error ?? 'ログイン失敗', variant: 'error' });
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} placeholder="メール or ユーザー名" className="input" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="パスワード" className="input" />
        <button className="btn">ログイン</button>
      </form>
      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </main>
  );
}
