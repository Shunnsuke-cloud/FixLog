"use client";
import { useState } from 'react';
import { useAuth } from '../../../src/lib/AuthProvider';


export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOrUsername || !password) { setMessage('入力してください'); return; }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await res.json();
    if (data?.success && data.data?.token && data.data?.user) {
      login(data.data.token, data.data.user);
      setMessage('ログイン成功');
    } else {
      setMessage(data?.error ?? 'ログイン失敗');
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} placeholder="メール or ユーザー名" className="input" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="パスワード" className="input" />
        <button className="btn">ログイン</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
