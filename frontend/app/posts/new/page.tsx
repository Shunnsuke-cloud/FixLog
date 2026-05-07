"use client";
import { useState } from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../src/lib/AuthProvider';

export default function NewPostPage(){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [message,setMessage]=useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push('/auth/login');
  }, [token, router]);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization': token?`Bearer ${token}`:''},body:JSON.stringify({title,description})
    });
    const data = await res.json();
    if(data?.success) setMessage('投稿しました'); else setMessage(data?.error ?? '投稿に失敗しました');
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">新規投稿</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="タイトル" className="input" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="説明" className="input h-32" />
        <button className="btn">投稿</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
