"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = {
  id:number;
  title:string;
  description:string;
  createdAt:string;
  environment?: {
    language?: string | null;
    framework?: string | null;
    os?: string | null;
    osVersion?: string | null;
    nodeVersion?: string | null;
    npmVersion?: string | null;
  } | null;
};

export default function PostsPage(){
  const [posts,setPosts]=useState<Post[]>([]);
  useEffect(()=>{fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`).then(r=>r.json()).then(d=>{if(d?.success) setPosts(d.data);});},[]);
  return (
    <main className="container p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">投稿一覧</h1>
        <Link href="/posts/new" className="btn btn-primary">
          新規投稿を作成
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg">
              <Link href={`/posts/${p.id}`} className="hover:text-orange-600">
                {p.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-slate-600">{p.description}</p>
            {p.environment && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {p.environment.language && <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-700">{p.environment.language}</span>}
                {p.environment.framework && <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{p.environment.framework}</span>}
                {p.environment.os && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">{p.environment.os}</span>}
                {p.environment.osVersion && <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">OS {p.environment.osVersion}</span>}
                {p.environment.nodeVersion && <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Node {p.environment.nodeVersion}</span>}
                {p.environment.npmVersion && <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">npm {p.environment.npmVersion}</span>}
              </div>
            )}
            <div className="mt-3 text-xs text-slate-400">作成日: {new Date(p.createdAt).toLocaleString()}</div>
            <div className="mt-4">
              <Link href={`/posts/${p.id}`} className="btn btn-outline">
                詳細を見る
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
