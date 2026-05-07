"use client";
import { useEffect, useState } from 'react';

type Post = { id:number; title:string; description:string; createdAt:string };

export default function PostsPage(){
  const [posts,setPosts]=useState<Post[]>([]);
  useEffect(()=>{fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`).then(r=>r.json()).then(d=>{if(d?.success) setPosts(d.data);});},[]);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      <ul className="space-y-3">
        {posts.map(p=> (
          <li key={p.id} className="border p-3 rounded"> 
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
