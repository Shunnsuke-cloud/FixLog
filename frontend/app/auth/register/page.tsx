"use client";
import { useState } from 'react';
import { useAuth } from '../../../src/lib/AuthProvider';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !username || !password) { setMessage('入力してください'); return; }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (data?.success) {
      setMessage('登録成功');
      if (data.data?.token && data.data?.user) login(data.data.token, data.data.user);
    } else {
      setMessage(data?.error ?? '登録失敗');
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">ユーザー登録</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メール" className="input" />
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ユーザー名" className="input" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="パスワード" className="input" />
        <button className="btn">登録</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
