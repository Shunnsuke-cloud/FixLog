# FixLog - エンジニア向けナレッジ共有Webアプリケーション

> 開発中に発生したエラーとその解決方法を共有・蓄積できるプラットフォーム

## 概要

FixLogは、エンジニアが遭遇したエラーとその解決方法を**環境情報付き**で共有・蓄積できるナレッジ共有Webアプリケーションです。

### 主な特徴

- **環境情報の完全記録**: 言語・フレームワーク・OS・バージョンを記録
- **コメント機能**: 投稿へのコメントで解決方法の情報を蓄積
- **ユーザープロフィール**: ユーザー情報の管理と表示
- **ユーザーフォロー**: 信頼できるエンジニアをフォロー

## テーブル構成

| テーブル | 説明 |
|---------|------|
| `users` | ユーザー情報（登録・認証・プロフィール） |
| `posts` | エラー投稿（タイトル・説明・解決方法） |
| `environment_info` | 投稿の環境情報（言語・フレームワーク・OS等） |
| `comments` | 投稿へのコメント |
| `follows` | ユーザーフォロー関係 |

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form** (フォーム管理)
- **SWR** (データ取得)

### バックエンド
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM** (DB操作)
- **JWT** (認証)

## プロジェクト構造

```
FixLog/
├── frontend/              # Next.js フロントエンド
│   ├── app/              # Next.js App Router
│   ├── components/       # React コンポーネント
│   ├── lib/              # ユーティリティ
│   ├── styles/           # スタイル
│   └── public/           # 静的ファイル
│
├── backend/              # Express バックエンド
│   ├── src/
│   │   ├── routes/       # ルート定義
│   │   ├── controllers/  # コントローラー
│   │   ├── middleware/   # ミドルウェア
│   │   ├── models/       # DB モデル (Prisma)
│   │   └── config/       # 設定ファイル
│   ├── prisma/           # Prisma スキーマ
│   └── .env              # 環境変数
│
├── docs/                 # ドキュメント
├── DEVELOPMENT.md        # 開発ガイド・ルール
└── README.md             # このファイル
```

## クイックスタート

### 環境準備

```bash
# 1. リポジトリのクローン（既にクローン済み）
cd FixLog

# 2. バックエンド環境構築
cd backend
npm install
npm run dev

# 3. フロントエンド環境構築（別ターミナル）
cd frontend
npm install
npm run dev
```

詳細は [DEVELOPMENT.md](./DEVELOPMENT.md) を参照してください。

## ドキュメント

- [DEVELOPMENT.md](./DEVELOPMENT.md) - 開発ルール・ブランチ戦略
- [docs/SETUP.md](./docs/SETUP.md) - 初期セットアップ手順
- [docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md) - データベース設計書
- [docs/API_SPECIFICATION.md](./docs/API_SPECIFICATION.md) - API 仕様書
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - アーキテクチャ図

## 開発フロー

1. **フィーチャーブランチ作成**: `git checkout -b feature/機能名`
2. **実装**: 機能を実装
3. **動作確認**: 各プロジェクトで `npm run dev` で動作確認
4. **コミット**: `git commit -m "feat: 機能説明"`
5. **プッシュ**: `git push origin feature/機能名`
6. **PR作成**: メインブランチへマージするPRを作成

詳細は [DEVELOPMENT.md](./DEVELOPMENT.md) を参照してください。

## フェーズ別開発計画

### フェーズ1（基本機能）
- [ ] ユーザー認証（登録・ログイン）
- [ ] エラー投稿・一覧表示
- [ ] 投稿詳細表示・編集・削除

### フェーズ2（拡張機能）
- [ ] 環境情報付き投稿
- [ ] コメント機能
- [ ] 解決率スコア機能

### フェーズ3（最適化）
- [ ] 検索・フィルター機能
- [ ] タグシステム
- [ ] UI/UX改善

## サポート

質問や提案があれば、Issue を作成してください。

---

**最終更新**: 2026年5月7日
