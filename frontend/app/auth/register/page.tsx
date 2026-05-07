"use client";
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (data?.success) setMessage('登録成功'); else setMessage(data?.error ?? '登録失敗');
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
