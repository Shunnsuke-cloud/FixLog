# プロジェクト構造・アーキテクチャ - FixLog

## 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│         Client (Web Browser)                        │
│        http://localhost:3000                        │
└────────────────┬──────────────────────────────────┘
                 │ HTTP(S)
        ┌────────▼────────┐
        │  Next.js App    │
        │ (Frontend)      │
        │                 │
        │ ├─ App Router   │
        │ ├─ Components   │
        │ └─ API Routes   │
        └────────┬────────┘
                 │ HTTP REST API
        ┌────────▼──────────┐
        │   Express.js      │
        │   (Backend API)   │
        │                   │
        │ ├─ Routes         │
        │ ├─ Controllers    │
        │ └─ Middleware     │
        └────────┬──────────┘
                 │ SQL / Prisma ORM
        ┌────────▼──────────┐
        │  PostgreSQL       │
        │  Database         │
        │                   │
        │ ├─ users          │
        │ ├─ posts          │
        │ ├─ comments       │
        │ ├─ tags           │
        │ └─ ...            │
        └───────────────────┘
```

---

## ファイル構造（詳細）

### ルートディレクトリ

```
FixLog/
├── .git/                   # Git リポジトリ
├── frontend/               # Next.js フロントエンド
├── backend/                # Express バックエンド
├── docs/                   # ドキュメント
├── .env.example            # 環境変数テンプレート
├── README.md               # プロジェクト概要
├── DEVELOPMENT.md          # 開発ガイド
└── .gitignore              # Git 無視ファイル設定
```

### frontend/ - Next.js フロントエンド

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ (/
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx    # ログインページ (/auth/login)
│   │   └── register/
│   │       └── page.tsx    # 登録ページ (/auth/register)
│   ├── posts/
│   │   ├── page.tsx        # 投稿一覧 (/posts)
│   │   ├── [id]/
│   │   │   └── page.tsx    # 投稿詳細 (/posts/:id)
│   │   └── new/
│   │       └── page.tsx    # 投稿作成 (/posts/new)
│   ├── api/                # API ルート
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── logout.ts
│   │   └── ...
│   └── error.tsx           # エラーバウンダリー
│
├── components/             # React コンポーネント
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   ├── PostDetail.tsx
│   │   └── CommentSection.tsx
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Button.tsx
│   └── layout/
│       ├── MainLayout.tsx
│       └── AuthLayout.tsx
│
├── lib/                    # ユーティリティ関数
│   ├── api.ts              # API 通信ロジック
│   ├── auth.ts             # 認証ユーティリティ
│   ├── jwt.ts              # JWT 処理
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useComments.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── post.ts
│   │   └── api.ts
│   └── utils/
│       ├── format.ts       # フォーマッティング
│       └── validation.ts   # バリデーション
│
├── styles/
│   └── globals.css         # グローバルスタイル
│
├── public/                 # 静的ファイル
│   ├── favicon.ico
│   └── images/
│
├── .env.local              # ローカル環境変数（Git 無視）
├── next.config.js          # Next.js 設定
├── tailwind.config.js      # Tailwind CSS 設定
├── tsconfig.json           # TypeScript 設定
├── package.json
└── package-lock.json
```

### backend/ - Express バックエンド

```
backend/
├── src/
│   ├── index.ts            # アプリケーション エントリーポイント
│   │
│   ├── routes/             # ルート定義
│   │   ├── auth.ts         # /api/auth
│   │   ├── posts.ts        # /api/posts
│   │   ├── comments.ts     # /api/posts/:id/comments
│   │   ├── tags.ts         # /api/tags
│   │   └── feedback.ts     # /api/posts/:id/feedback
│   │
│   ├── controllers/        # ビジネスロジック
│   │   ├── authController.ts
│   │   ├── postsController.ts
│   │   ├── commentsController.ts
│   │   ├── tagsController.ts
│   │   └── feedbackController.ts
│   │
│   ├── middleware/         # ミドルウェア
│   │   ├── auth.ts         # JWT 検証ミドルウェア
│   │   ├── errorHandler.ts # エラーハンドリング
│   │   ├── validation.ts   # バリデーション
│   │   └── logger.ts       # ロギング
│   │
│   ├── models/             # Prisma モデル（生成される）
│   │   └── index.ts        # Prisma Client
│   │
│   ├── services/           # ビジネスロジック（オプション）
│   │   ├── authService.ts
│   │   ├── postsService.ts
│   │   └── feedbackService.ts
│   │
│   ├── config/
│   │   ├── env.ts          # 環境変数設定
│   │   ├── database.ts     # DB 接続設定
│   │   └── jwt.ts          # JWT 設定
│   │
│   ├── utils/
│   │   ├── hash.ts         # パスワードハッシュ
│   │   ├── jwt.ts          # JWT 操作
│   │   └── errors.ts       # エラークラス
│   │
│   └── types/
│       ├── auth.ts
│       ├── post.ts
│       ├── user.ts
│       └── api.ts
│
├── prisma/
│   ├── schema.prisma       # DB スキーマ
│   └── migrations/         # マイグレーションファイル
│       └── migration_lock.toml
│
├── .env                    # 環境変数（Git 無視）
├── .env.example            # 環境変数テンプレート
├── server.ts               # サーバー起動スクリプト
├── tsconfig.json           # TypeScript 設定
├── package.json
└── package-lock.json
```

### docs/ - ドキュメント

```
docs/
├── SETUP.md                # セットアップガイド
├── DATABASE_DESIGN.md      # DB 設計書
├── API_SPECIFICATION.md    # API 仕様書
├── ROADMAP.md              # 開発ロードマップ
├── ARCHITECTURE.md         # このファイル
└── TROUBLESHOOTING.md      # トラブルシューティング（今後作成）
```

---

## データフロー

### ユーザー登録フロー

```
┌─ ブラウザ ─┐
│ /register  │
└─────┬──────┘
      │ フォーム入力・送信
      ▼
┌────────────────────────────────┐
│ frontend/app/auth/register     │
│   ↓ (API 呼び出し)             │
│ POST /api/auth/register        │
└────────────────────────────────┘
              │
              ▼
┌────────────────────────────────┐
│ backend/src/routes/auth.ts     │
│   ↓ (コントローラーへ)          │
│ backend/src/controllers/       │
│   authController.register()    │
└────────────────────────────────┘
              │
      ┌───────▼────────┐
      │ ユーザー情報    │
      │ バリデーション  │
      │ パスワードHash  │
      │ DB 保存         │
      └────────┬────────┘
               │
               ▼
┌────────────────────────────┐
│ PostgreSQL Database        │
│ INSERT INTO users (...)    │
└────────────────────────────┘
```

### 投稿作成フロー

```
┌─ ブラウザ ─┐
│ /posts/new │
└─────┬──────┘
      │ フォーム入力・送信
      ▼
┌─────────────────────────────┐
│ frontend/app/posts/new      │
│   ↓ (API 呼び出し)          │
│ POST /api/posts             │
│ Authorization: Bearer JWT   │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│ backend/middleware/auth.ts  │
│ JWT トークン検証             │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│ backend/routes/posts.ts     │
│   ↓ (コントローラーへ)      │
│ postsController.create()    │
└─────────────────────────────┘
              │
      ┌───────▼──────────┐
      │ 投稿データ処理    │
      │ 環境情報保存      │
      │ タグ紐付け        │
      └────────┬─────────┘
               │
               ▼
┌─────────────────────────────┐
│ PostgreSQL Database         │
│ INSERT INTO posts (...)     │
│ INSERT INTO post_tags (...)  │
└─────────────────────────────┘
```

---

## 技術スタック詳細

### フロントエンド

| ツール | 役割 | バージョン |
|--------|------|-----------|
| **Next.js** | フレームワーク | 14.x |
| **React** | UI ライブラリ | 18.x |
| **TypeScript** | 言語 | 5.x |
| **Tailwind CSS** | スタイリング | 3.x |
| **SWR** | データフェッチ | 2.x |
| **React Hook Form** | フォーム | 7.x |
| **Zod** | バリデーション | 3.x |
| **jwt-decode** | JWT デコード | 4.x |

### バックエンド

| ツール | 役割 | バージョン |
|--------|------|-----------|
| **Express.js** | フレームワーク | 4.x |
| **Node.js** | ランタイム | 18.x |
| **TypeScript** | 言語 | 5.x |
| **Prisma ORM** | DB アクセス | 5.x |
| **PostgreSQL** | データベース | 14.x |
| **jsonwebtoken** | JWT | 9.x |
| **bcryptjs** | パスワード Hash | 2.x |
| **dotenv** | 環境変数 | 16.x |
| **cors** | CORS 対応 | 2.x |

---

## セキュリティアーキテクチャ

```
┌─────────────────────────────────┐
│  Untrusted External Input       │
│  (Browser / API Request)        │
└────────────────┬────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Input Validation│
        │ (Zod / express │
        │  validator)    │
        └────────┬───────┘
                 │ Invalid? → Error
                 │ Valid?
                 ▼
        ┌────────────────┐
        │ Authentication │
        │ (JWT Verify)   │
        └────────┬───────┘
                 │ Invalid? → 401
                 │ Valid?
                 ▼
        ┌────────────────┐
        │ Authorization  │
        │ (Permission    │
        │  Check)        │
        └────────┬───────┘
                 │ Denied? → 403
                 │ Allowed?
                 ▼
        ┌────────────────────┐
        │ Business Logic     │
        │ (SQL Injection safe│
        │  w/ Prisma)        │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Parameterized      │
        │ Query Execution    │
        │ (Prisma ORM)       │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ PostgreSQL         │
        │ Database           │
        └────────────────────┘
```

---

## DB スキーマ関連図

```
┌──────────────┐
│ users (PK:id)│
└────────┬─────┘
         │ 1:N
    ┌────┴──────┬─────────┬──────────┐
    │            │         │          │
    ▼            ▼         ▼          ▼
┌────────┐ ┌───────────┐ ┌───────┐ ┌──────────────┐
│ posts  │ │ comments  │ │ posts │ │ solution     │
│ (FK:   │ │ (FK:user) │ │ (tags)│ │ feedback     │
│  user) │ │ (FK:post) │ │       │ │ (FK:user)    │
└────────┘ └───────────┘ └───────┘ │ (FK:post)    │
    │                              └──────────────┘
    └──────────────┬─────────────────┘
                   │ 1:1
                   ▼
        ┌────────────────────┐
        │ environment_info   │
        │ (言語・OS等の情報) │
        └────────────────────┘
```

---

## API エンドポイント（概要）

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| POST | `/api/auth/register` | ユーザー登録 |
| POST | `/api/auth/login` | ログイン |
| GET | `/api/posts` | 投稿一覧 |
| POST | `/api/posts` | 投稿作成 |
| GET | `/api/posts/:id` | 投稿詳細 |
| PUT | `/api/posts/:id` | 投稿更新 |
| DELETE | `/api/posts/:id` | 投稿削除 |
| POST | `/api/posts/:id/comments` | コメント作成 |
| GET | `/api/posts/:id/comments` | コメント一覧 |
| POST | `/api/posts/:id/feedback` | 解決率投票 |
| GET | `/api/posts/:id/feedback` | 解決率取得 |
| GET | `/api/tags` | タグ一覧 |

---

**最終更新**: 2026年5月7日
