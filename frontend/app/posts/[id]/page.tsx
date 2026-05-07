"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type PostDetail = {
  id: number;
  title: string;
  description: string;
  solution: string;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
  } | null;
  environment?: {
    language?: string | null;
    framework?: string | null;
    os?: string | null;
    osVersion?: string | null;
    nodeVersion?: string | null;
    npmVersion?: string | null;
  } | null;
};

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const postId = params?.id;
    if (!postId) {
      setError('投稿 ID が不正です');
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.success) {
          setPost(data.data);
          return;
        }
        setError(data?.error ?? '投稿の取得に失敗しました');
      })
      .catch(() => setError('投稿の取得に失敗しました'))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-slate-600">投稿を読み込んでいます...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="p-6">
        <p className="text-sm text-rose-600">{error ?? '投稿が見つかりませんでした'}</p>
        <div className="mt-4">
          <Link href="/posts" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            投稿一覧へ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
      <p className="mt-3 whitespace-pre-wrap text-slate-700">{post.description}</p>

      {post.solution && (
        <section className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <h2 className="text-sm font-semibold text-emerald-800">解決方法</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-900">{post.solution}</p>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-800">環境情報</h2>
        {post.environment ? (
          <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p>言語: {post.environment.language ?? '-'}</p>
            <p>フレームワーク: {post.environment.framework ?? '-'}</p>
            <p>OS: {post.environment.os ?? '-'}</p>
            <p>OS バージョン: {post.environment.osVersion ?? '-'}</p>
            <p>Node: {post.environment.nodeVersion ?? '-'}</p>
            <p>npm: {post.environment.npmVersion ?? '-'}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">環境情報はありません</p>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>投稿者: {post.user?.username ?? '不明'}</p>
        <p className="mt-1">作成日: {new Date(post.createdAt).toLocaleString()}</p>
      </section>

      <div className="mt-6">
        <Link href="/posts" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          投稿一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
