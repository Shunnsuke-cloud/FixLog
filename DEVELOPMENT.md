# 開発ガイド - FixLog

> **重要**: 本ドキュメントに従って段階的に開発を進めます。エラーを最小限にするため、各ステップを丁寧に実行してください。

## 📋 開発ルール

### ブランチ戦略（Git Flow）

```
main（本番）
  ↑
release/v1.0.0（リリース準備）
  ↑
develop（開発ベース）
  ↑
feature/機能名（機能ブランチ）
```

### ブランチ命名規則

```
feature/認証機能の実装
feature/投稿機能の追加
feature/環境情報付き投稿
bugfix/ログインエラー修正
docs/セットアップガイド
```

### コミットメッセージ規則

```
feat: 新機能の説明
fix: バグ修正の説明
docs: ドキュメント更新
refactor: コードリファクタ
style: フォーマット・スタイル修正
test: テスト追加・修正
chore: 依存関係更新等

例：
feat: ユーザー認証機能を実装
fix: ログインエラーを修正
docs: APIドキュメントを更新
```

## 🚀 開発の進め方

### 1. 初期セットアップ（1回目のみ）

```bash
# リポジトリをクローン
git clone <repo_url>
cd FixLog

# develop ブランチを作成・切り替え
git checkout -b develop

# プッシュ
git push origin develop

# ローカルで develop を基本に
git checkout develop
```

### 2. 機能開発フロー

```bash
# develop から feature ブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/機能名

# 実装とテスト
npm run dev
# ここで各プロジェクトで動作確認

# コミット
git add .
git commit -m "feat: 機能説明"

# プッシュ
git push origin feature/機能名

# GitHub で Pull Request を作成
# → レビュー → develop へマージ
```

### 3. リリース準備

```bash
# develop から release ブランチを作成
git checkout -b release/v1.0.0

# バージョン番号更新・最終テスト
npm run test
npm run build

# main へマージ
git checkout main
git merge --no-ff release/v1.0.0

# develop へもマージ（重要）
git checkout develop
git merge --no-ff release/v1.0.0
```

## 📁 フロントエンド開発

### セットアップ

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### ファイル構造（Next.js App Router）

```
frontend/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx    # ログインページ
│   │   └── register/
│   │       └── page.tsx    # 登録ページ
│   ├── posts/
│   │   ├── page.tsx        # 投稿一覧
│   │   ├── [id]/page.tsx   # 投稿詳細
│   │   └── new/page.tsx    # 投稿作成
│   └── api/                # API ルート
│
├── components/
│   ├── auth/               # 認証関連
│   ├── posts/              # 投稿関連
│   ├── common/             # 共通コンポーネント
│   └── layout/             # レイアウト
│
├── lib/
│   ├── api.ts              # API 通信
│   ├── auth.ts             # 認証処理
│   └── hooks/              # カスタムフック
│
├── styles/
│   └── globals.css         # グローバルスタイル
│
└── public/                 # 静的ファイル
```

### 開発の手順

```bash
# 1. コンポーネント作成
# ファイル: frontend/components/posts/PostForm.tsx

# 2. ページ作成
# ファイル: frontend/app/posts/new/page.tsx

# 3. スタイル適用
# Tailwind CSS で styling

# 4. 動作確認
npm run dev
# ブラウザで確認

# 5. TypeScript のチェック
npm run type-check

# 6. ESLint でチェック
npm run lint
```

## 🔧 バックエンド開発

### セットアップ

```bash
cd backend
npm install

# PostgreSQL が起動していることを確認
npm run db:push     # Prisma スキーマをDBに反映

npm run dev
# → http://localhost:5000
```

### ファイル構造

```
backend/
├── src/
│   ├── index.ts            # メインファイル
│   ├── routes/
│   │   ├── auth.ts         # 認証ルート
│   │   ├── posts.ts        # 投稿ルート
│   │   └── comments.ts     # コメントルート
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── postsController.ts
│   │   └── commentsController.ts
│   ├── middleware/
│   │   ├── auth.ts         # JWT 検証
│   │   └── errorHandler.ts # エラーハンドリング
│   ├── models/             # Prisma モデル
│   └── config/
│       └── env.ts          # 環境変数
│
├── prisma/
│   ├── schema.prisma       # DB スキーマ
│   └── migrations/         # マイグレーションファイル
│
└── .env                    # 環境変数
```

### 開発の手順

```bash
# 1. Prisma スキーマ更新
# ファイル: backend/prisma/schema.prisma

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String
  // ...
}

# 2. マイグレーション実行
npm run db:migrate -- --name add_post_table

# 3. コントローラー実装
# ファイル: backend/src/controllers/postsController.ts

# 4. ルート定義
# ファイル: backend/src/routes/posts.ts

# 5. テスト（curl または Postman）
curl http://localhost:5000/api/posts

# 6. 動作確認
npm run dev
```

### Prisma コマンド

```bash
# スキーマをDBに反映
npm run db:push

# マイグレーション作成・実行
npm run db:migrate -- --name 説明

# Prisma Studio（DBビジュアルツール）
npm run db:studio
```

## 🔗 API 通信フロー

```
フロントエンド（Next.js）
    ↓
API ルート (frontend/app/api/*)
    ↓
バックエンド Express
    ↓
PostgreSQL DB
```

## ⚠️ 開発中の注意点

### 1. 環境変数管理

**`.env.local` に追記**（`.env` は GitIgnore）

```env
# Backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
DATABASE_URL=postgresql://user:password@localhost:5432/fixlog

# Frontend
NEXT_PUBLIC_APP_NAME=FixLog
```

### 2. DB 接続確認

```bash
# PostgreSQL が起動しているか確認
psql -U postgres
\l

# fixlog DB が存在するか確認
CREATE DATABASE fixlog;
```

### 3. ポート確認

- フロントエンド: **3000**
- バックエンド: **5000**

競合している場合は `.env` で変更

### 4. ブランチマージ前のチェックリスト

- [ ] `npm run dev` で動作確認した
- [ ] TypeScript エラーがない (`npm run type-check`)
- [ ] ESLint エラーがない (`npm run lint`)
- [ ] 新しい API の場合、Swagger ドキュメント更新した
- [ ] DB スキーマ変更した場合、マイグレーション作成した

## 📚 参考リソース

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**最終更新**: 2026年5月5日
