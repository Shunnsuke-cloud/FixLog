# セットアップガイド - FixLog

> **対象環境**: Windows 11 + Node.js 18+ + PostgreSQL 14+

## 📋 前提条件

```bash
# 確認コマンド
node --version      # v18.0.0 以上
npm --version       # v9.0.0 以上
git --version
psql --version      # PostgreSQL 14+ 
```

## 🔧 初期セットアップ

### ステップ1: PostgreSQL のセットアップ

#### Windows の場合

1. **PostgreSQL をダウンロード・インストール**
   - [postgresql.org](https://www.postgresql.org/download/) からダウンロード
   - デフォルトで `postgres` ユーザーで作成されます
   - パスワードは任意に設定（記録してください）

2. **DB 作成**

```bash
# psql に接続（Windows ではコマンドプロンプトから）
psql -U postgres

# パスワード入力

# DB 作成
CREATE DATABASE fixlog;

# ユーザー作成（オプション）
CREATE USER fixlog_user WITH PASSWORD 'your_secure_password';
ALTER ROLE fixlog_user WITH CREATEDB;

# 確認
\l
```

### ステップ2: リポジトリをクローン

```bash
git clone <repository_url>
cd FixLog
```

### ステップ3: バックエンド環境構築

```bash
cd backend

# 依存関係インストール
npm install

# .env ファイル作成（テンプレートから）
cp .env.example .env

# .env を編集
# DATABASE_URL=postgresql://postgres:password@localhost:5432/fixlog
```

**編集するファイル**: `backend/.env`

```env
# DB 接続
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/fixlog

# JWT Secret（ランダム値を設定）
JWT_SECRET=your_super_secret_key_change_me

# API
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

**Prisma スキーマを DB に反映**

```bash
npm run db:push
```

**ダミーデータを挿入（オプション）**

```bash
npm run db:seed
```

### ステップ4: フロントエンド環境構築

```bash
cd ../frontend

# 依存関係インストール
npm install

# .env.local ファイル作成
cp .env.example .env.local

# .env.local を編集
```

**編集するファイル**: `frontend/.env.local`

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=FixLog
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## ▶️ 起動方法

### 方法1: 別ターミナルで起動（推奨）

**ターミナル1: バックエンド**

```bash
cd FixLog/backend
npm run dev
```

出力例:
```
Server is running on http://localhost:5000
```

**ターミナル2: フロントエンド**

```bash
cd FixLog/frontend
npm run dev
```

出力例:
```
> Local:        http://localhost:3000
```

**ブラウザにアクセス**

```
http://localhost:3000
```

### 方法2: Docker Compose で起動（後で実装予定）

```bash
docker-compose up -d
```

## 🗄️ DB 管理コマンド

### Prisma Studio でデータを確認

```bash
cd backend
npm run db:studio
# http://localhost:5555 で GUI ツール起動
```

### DB をリセット

```bash
# ⚠️ 警告: すべてのデータが削除されます
npm run db:reset
```

### マイグレーション確認

```bash
npm run db:migrate:status
```

## 🧪 開発ツール

### TypeScript 型チェック

```bash
# フロントエンド
cd frontend
npm run type-check

# バックエンド
cd ../backend
npm run type-check
```

### ESLint でコード検査

```bash
npm run lint
```

### テスト実行

```bash
npm test
```

## ⚠️ トラブルシューティング

### エラー: `DATABASE_URL connection refused`

**原因**: PostgreSQL が起動していない

```bash
# Windows: PostgreSQL サービス確認
services.msc
# → PostgreSQL を右クリック → 開始

# または
net start postgresql-x64-14
```

### エラー: `Port 3000 is already in use`

```bash
# ポートを変更
NEXT_PUBLIC_API_PORT=3001 npm run dev

# または既存プロセスを終了
lsof -i :3000
kill <PID>
```

### エラー: `EACCES: permission denied`

```bash
# npm の権限問題
npm install -g npm@latest

# もしくはキャッシュをクリア
npm cache clean --force
```

### エラー: `.env` ファイルが見つからない

```bash
# テンプレートから作成
cd backend
cp .env.example .env

cd ../frontend
cp .env.example .env.local
```

## ✅ セットアップ完了確認

```bash
# すべてが起動できたか確認
curl http://localhost:5000/api/health
# 応答: {"status":"ok"}

# フロントエンド確認
# ブラウザで http://localhost:3000 にアクセス
```

---

**最終更新**: 2026年5月5日
