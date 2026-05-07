"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../src/lib/AuthProvider';

export default function NewPostPage(){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [language,setLanguage]=useState('TypeScript');
  const [framework,setFramework]=useState('Next.js');
  const [os,setOs]=useState('Windows');
  const [osVersion,setOsVersion]=useState('');
  const [nodeVersion,setNodeVersion]=useState('');
  const [npmVersion,setNpmVersion]=useState('');
  const [message,setMessage]=useState<string | null>(null);
  const { token, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authReady && !token) router.push('/auth/login');
  }, [authReady, token, router]);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if (!token) {
      setMessage('ログインが必要です');
      return;
    }
    if (!title || !description) {
      setMessage('タイトルと説明を入力してください');
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization': `Bearer ${token}`},body:JSON.stringify({
        title,
        description,
        environment: {
          language,
          framework,
          os,
          osVersion: osVersion || null,
          nodeVersion: nodeVersion || null,
          npmVersion: npmVersion || null,
        },
      })
    });
    const data = await res.json();
    if(data?.success) setMessage('投稿しました'); else setMessage(data?.error ?? '投稿に失敗しました');
  }

  if (!authReady) {
    return (
      <main className="p-6">
        <p className="text-sm text-slate-600">認証情報を確認しています...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">新規投稿</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="タイトル" className="input" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="説明" className="input h-32" />
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">環境情報</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              言語
              <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="input mt-1">
                <option>TypeScript</option>
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>Go</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-sm text-slate-700">
              フレームワーク
              <input value={framework} onChange={(e)=>setFramework(e.target.value)} placeholder="Next.js" className="input mt-1" />
            </label>
            <label className="text-sm text-slate-700">
              OS
              <select value={os} onChange={(e)=>setOs(e.target.value)} className="input mt-1">
                <option>Windows</option>
                <option>macOS</option>
                <option>Linux</option>
              </select>
            </label>
            <label className="text-sm text-slate-700">
              OS バージョン
              <input value={osVersion} onChange={(e)=>setOsVersion(e.target.value)} placeholder="例: 11 23H2" className="input mt-1" />
            </label>
            <label className="text-sm text-slate-700">
              Node バージョン
              <input value={nodeVersion} onChange={(e)=>setNodeVersion(e.target.value)} placeholder="例: 20.11.1" className="input mt-1" />
            </label>
            <label className="text-sm text-slate-700">
              npm バージョン
              <input value={npmVersion} onChange={(e)=>setNpmVersion(e.target.value)} placeholder="例: 10.2.4" className="input mt-1" />
            </label>
          </div>
        </div>
        <button className="btn">投稿</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
