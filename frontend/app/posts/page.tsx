"use client";
import { useEffect, useState } from 'react';

type Post = { id:number; title:string; description:string; createdAt:string };

export default function PostsPage(){
  const [posts,setPosts]=useState<Post[]>([]);
  useEffect(()=>{fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`).then(r=>r.json()).then(d=>{if(d?.success) setPosts(d.data);});},[]);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.id} className="rounded-xl border p-4 bg-white shadow-sm">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{p.description}</p>
            <div className="mt-3 text-xs text-slate-400">作成日: {new Date(p.createdAt).toLocaleString()}</div>
          </article>
        ))}
      </div>
    </main>
  );
}
