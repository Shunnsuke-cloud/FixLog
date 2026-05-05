# API 仕様書 - FixLog

> Base URL: `http://localhost:5000/api`

## 📌 共通ルール

### レスポンスフォーマット

**成功時 (200, 201)**

```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  }
}
```

**エラー時 (400, 401, 404, 500)**

```json
{
  "success": false,
  "error": "エラーメッセージ",
  "code": "ERROR_CODE"
}
```

### 認証

JWT トークンをヘッダーに含める

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 認証 API

### POST /auth/register - ユーザー登録

リクエスト:

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "secure_password123"
}
```

レスポンス (201):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "createdAt": "2026-05-05T10:00:00Z"
  }
}
```

**バリデーション**:

- `email`: 有効なメールアドレス形式
- `username`: 3文字以上、英数字とアンダースコア
- `password`: 8文字以上

---

### POST /auth/login - ログイン

リクエスト:

```json
{
  "email": "user@example.com",
  "password": "secure_password123"
}
```

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username"
    }
  }
}
```

---

### GET /auth/me - 現在のユーザー情報取得

**認証必須**

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "profile": "プロフィール文",
    "createdAt": "2026-05-05T10:00:00Z"
  }
}
```

---

## 📝 投稿 API

### GET /posts - 投稿一覧取得

クエリパラメータ:

| パラメータ | 型 | 説明 |
|------------|-----|------|
| `page` | Int | ページ番号（デフォルト: 1） |
| `limit` | Int | 1ページあたりの件数（デフォルト: 20） |
| `tag` | String | タグでフィルター |
| `sort` | String | 並び順（`latest`, `popular`） |

リクエスト例:

```
GET /posts?page=1&limit=20&sort=latest
```

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "TypeError: Cannot read property 'name' of undefined",
        "description": "オブジェクトがnullの時にプロパティを読み込もうとした...",
        "solution": "null チェックを追加する必要があります...",
        "user": {
          "id": 1,
          "username": "developer"
        },
        "environment": {
          "language": "JavaScript",
          "framework": "React",
          "os": "Windows",
          "osVersion": "11"
        },
        "comments": 5,
        "successRate": 85.5,
        "createdAt": "2026-05-04T15:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### POST /posts - 投稿作成

**認証必須**

リクエスト:

```json
{
  "title": "TypeError: Cannot read property...",
  "description": "エラーの詳細説明",
  "solution": "解決方法の説明",
  "environment": {
    "language": "JavaScript",
    "framework": "React",
    "os": "Windows",
    "osVersion": "11",
    "nodeVersion": "18.0.0",
    "npmVersion": "9.0.0"
  },
  "tags": ["React", "TypeError", "Frontend"]
}
```

レスポンス (201):

```json
{
  "success": true,
  "data": {
    "id": 101,
    "title": "TypeError: Cannot read property...",
    "description": "エラーの詳細説明",
    "solution": "解決方法の説明",
    "userId": 1,
    "environmentId": 5,
    "createdAt": "2026-05-05T10:00:00Z"
  }
}
```

---

### GET /posts/:id - 投稿詳細取得

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "TypeError: Cannot read property...",
    "description": "エラーの詳細説明",
    "solution": "解決方法の説明",
    "user": {
      "id": 1,
      "username": "developer",
      "profile": "Webエンジニア"
    },
    "environment": {
      "id": 5,
      "language": "JavaScript",
      "framework": "React",
      "os": "Windows",
      "osVersion": "11"
    },
    "tags": [
      { "id": 1, "name": "React" },
      { "id": 2, "name": "TypeError" }
    ],
    "comments": [
      {
        "id": 10,
        "content": "私も同じエラーに遭遇しました...",
        "user": {
          "username": "another_dev"
        },
        "createdAt": "2026-05-05T11:00:00Z"
      }
    ],
    "solutionFeedback": {
      "totalFeedback": 20,
      "solvedCount": 17,
      "successRate": 85
    },
    "createdAt": "2026-05-04T15:30:00Z",
    "updatedAt": "2026-05-05T09:00:00Z"
  }
}
```

---

### PUT /posts/:id - 投稿更新

**認証必須（投稿者のみ）**

リクエスト:

```json
{
  "title": "更新されたタイトル",
  "description": "更新された説明",
  "solution": "更新された解決方法",
  "tags": ["React", "Bug"]
}
```

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新されたタイトル",
    "updatedAt": "2026-05-05T12:00:00Z"
  }
}
```

---

### DELETE /posts/:id - 投稿削除

**認証必須（投稿者のみ）**

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "message": "投稿が削除されました"
  }
}
```

---

## 💬 コメント API

### POST /posts/:id/comments - コメント作成

**認証必須**

リクエスト:

```json
{
  "content": "私も同じエラーに遭遇しました。以下の方法で解決しました..."
}
```

レスポンス (201):

```json
{
  "success": true,
  "data": {
    "id": 50,
    "content": "私も同じエラーに...",
    "postId": 1,
    "userId": 2,
    "user": {
      "username": "another_dev"
    },
    "createdAt": "2026-05-05T13:00:00Z"
  }
}
```

---

### GET /posts/:id/comments - コメント一覧取得

クエリパラメータ: `page`, `limit`

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 50,
        "content": "コメント内容...",
        "user": {
          "username": "another_dev"
        },
        "createdAt": "2026-05-05T13:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "totalPages": 1
  }
}
```

---

### DELETE /posts/:id/comments/:commentId - コメント削除

**認証必須（コメント作成者のみ）**

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "id": 50,
    "message": "コメントが削除されました"
  }
}
```

---

## 🎯 解決率 API

### POST /posts/:id/feedback - 解決率を投票

**認証必須**

リクエスト:

```json
{
  "solved": true  // true: 解決できた, false: 解決できなかった
}
```

レスポンス (201):

```json
{
  "success": true,
  "data": {
    "id": 100,
    "postId": 1,
    "userId": 2,
    "solved": true,
    "createdAt": "2026-05-05T14:00:00Z"
  }
}
```

---

### GET /posts/:id/feedback - 解決率を取得

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "postId": 1,
    "totalFeedback": 20,
    "solvedCount": 17,
    "notSolvedCount": 3,
    "successRate": 85
  }
}
```

---

## 🏷️ タグ API

### GET /tags - タグ一覧取得

クエリパラメータ: `q` (検索キーワード)

レスポンス (200):

```json
{
  "success": true,
  "data": {
    "tags": [
      { "id": 1, "name": "React", "count": 45 },
      { "id": 2, "name": "TypeError", "count": 23 },
      { "id": 3, "name": "Frontend", "count": 67 }
    ]
  }
}
```

---

## ❌ エラーコード

| コード | HTTP | 説明 |
|--------|------|------|
| `INVALID_EMAIL` | 400 | メールアドレスが無効 |
| `DUPLICATE_EMAIL` | 400 | メールアドレスが既に登録済み |
| `WEAK_PASSWORD` | 400 | パスワードが弱い |
| `INVALID_CREDENTIALS` | 401 | ユーザー名またはパスワードが不正 |
| `UNAUTHORIZED` | 401 | 認証トークンが無効 |
| `FORBIDDEN` | 403 | アクセス権がない |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `SERVER_ERROR` | 500 | サーバーエラー |

---

## 🔍 使用例（curl）

### ユーザー登録

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecurePass123"
  }'
```

### ログイン

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 投稿一覧取得

```bash
curl -X GET "http://localhost:5000/api/posts?page=1&limit=10"
```

### 投稿作成（認証必須）

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "TypeError: Cannot read property...",
    "description": "エラーの詳細",
    "solution": "解決方法",
    "environment": {
      "language": "JavaScript",
      "framework": "React",
      "os": "Windows",
      "osVersion": "11"
    },
    "tags": ["React", "TypeError"]
  }'
```

---

**最終更新**: 2026年5月5日
