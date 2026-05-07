"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../src/lib/AuthProvider';
import Toast from '../../../src/components/Toast';

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

type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; username: string } | null;
};
export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error' } | null>(null);
  const { token, user, authReady } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

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

  useEffect(() => {
    const postId = params?.id;
    if (!postId) return;
    setLoadingComments(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setComments(data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [params?.id]);

  async function submitComment() {
    if (!authReady) return;
    if (!token) {
      setToast({ message: 'コメントするにはログインしてください', variant: 'error' });
      return;
    }
    if (!newComment.trim()) return setToast({ message: '内容を入力してください', variant: 'error' });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params!.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? '投稿に失敗しました');
      setComments((cur) => [...cur, data.data]);
      setNewComment('');
      setToast({ message: 'コメントを投稿しました', variant: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message ?? 'エラーが発生しました', variant: 'error' });
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!token) return setToast({ message: '権限がありません', variant: 'error' });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params!.id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? '削除に失敗しました');
      setComments((cur) => cur.filter((c) => c.id !== commentId));
      setToast({ message: 'コメントを削除しました', variant: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message ?? 'エラーが発生しました', variant: 'error' });
    }
  }

  async function startEdit(c: CommentType) {
    setEditingId(c.id);
    setEditingContent(c.content);
  }

  async function submitEdit(commentId: number) {
    if (!token) return setToast({ message: '権限がありません', variant: 'error' });
    if (!editingContent.trim()) return setToast({ message: '内容を入力してください', variant: 'error' });

    // optimistic update
    const prev = comments.slice();
    setComments((cur) => cur.map((c) => (c.id === commentId ? { ...c, content: editingContent } : c)));
    setEditingId(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params!.id}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: editingContent.trim() }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error ?? '編集に失敗しました');
      // replace with server response (includes user)
      setComments((cur) => cur.map((c) => (c.id === commentId ? data.data : c)));
      setToast({ message: 'コメントを更新しました', variant: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message ?? 'エラーが発生しました', variant: 'error' });
      setComments(prev);
    }
  }

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

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-800">コメント</h2>
        <div className="mt-3">
          {!authReady ? (
            <p className="text-sm text-slate-500">認証を確認しています...</p>
          ) : !user ? (
            <p className="text-sm text-slate-500">コメントするには <Link href="/auth/login" className="text-orange-600">ログイン</Link> してください。</p>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full rounded border p-2 text-sm" rows={3} />
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => setNewComment('')} className="btn btn-secondary">キャンセル</button>
                <button type="button" onClick={submitComment} className="btn btn-primary">コメントを投稿</button>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {loadingComments ? (
              <p className="text-sm text-slate-500">コメントを読み込んでいます...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-slate-500">まだコメントはありません</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="rounded border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">{c.user?.username ?? '匿名'}</div>
                    <div className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                    {editingId === c.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea value={editingContent} onChange={(e) => setEditingContent(e.target.value)} className="w-full rounded border p-2 text-sm" rows={3} />
                        <div className="text-right">
                          <button onClick={() => { setEditingId(null); setEditingContent(''); }} className="mr-2 text-sm">キャンセル</button>
                          <button onClick={() => submitEdit(c.id)} className="text-sm font-semibold text-orange-600">保存</button>
                        </div>
                      </div>
                    ) : (
                      <>{c.content}</>
                    )}
                  </div>
                  {user && c.user && user.id === c.user.id && (
                    <div className="mt-2 flex justify-end gap-3">
                      <button onClick={() => startEdit(c)} className="text-sm text-slate-600">編集</button>
                      <button onClick={() => handleDeleteComment(c.id)} className="text-sm text-rose-600">削除</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}

      <div className="mt-6">
        <Link href="/posts" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          投稿一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
