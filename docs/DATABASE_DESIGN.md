# データベース設計 - FixLog

> Prisma ORM + PostgreSQL

## 🗄️ テーブル設計

### 1. `users` - ユーザー

```prisma
model User {
  id              Int       @id @default(autoincrement())
  email           String    @unique
  username        String    @unique
  password        String    // bcrypt でハッシュ化
  profile         String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // リレーション
  posts           Post[]
  comments        Comment[]
  solutionFeedback SolutionFeedback[]
}
```

**カラム説明**

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | Int | プライマリキー |
| `email` | String | メールアドレス（ユニーク） |
| `username` | String | ユーザー名（ユニーク） |
| `password` | String | bcrypt ハッシュ化パスワード |
| `profile` | String | プロフィール文 |
| `createdAt` | DateTime | 作成日時 |
| `updatedAt` | DateTime | 更新日時 |

---

### 2. `posts` - エラー投稿

```prisma
model Post {
  id                Int              @id @default(autoincrement())
  title             String           // "TypeError: Cannot read property..."
  description       String           // エラーの詳細説明
  solution          String           // 解決方法
  
  userId            Int
  user              User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  environmentId     Int?
  environment       EnvironmentInfo? @relation(fields: [environmentId], references: [id])
  
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  // リレーション
  comments          Comment[]
  tags              PostTag[]
  solutionFeedback  SolutionFeedback[]
}
```

**カラム説明**

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | Int | プライマリキー |
| `title` | String | エラーのタイトル |
| `description` | String | エラーの詳細内容 |
| `solution` | String | 解決方法 |
| `userId` | Int | 投稿者 ID（外部キー） |
| `environmentId` | Int | 環境情報 ID（外部キー） |
| `createdAt` | DateTime | 投稿日時 |
| `updatedAt` | DateTime | 更新日時 |

---

### 3. `environment_info` - 環境情報

```prisma
model EnvironmentInfo {
  id             Int     @id @default(autoincrement())
  language       String  // "JavaScript", "Python", "Java"
  framework      String? // "Next.js", "React", "Express"
  os             String  // "Windows", "macOS", "Linux"
  osVersion      String? // "11", "12.0.1", "Ubuntu 20.04"
  nodeVersion    String? // "18.0.0"
  npmVersion     String? // "9.0.0"
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // リレーション
  posts          Post[]
}
```

**カラム説明**

| カラム | 型 | 説明 |
|--------|-----|------|
| `language` | String | プログラミング言語 |
| `framework` | String | フレームワーク（任意） |
| `os` | String | OS（Windows/macOS/Linux） |
| `osVersion` | String | OS バージョン |
| `nodeVersion` | String | Node.js バージョン |
| `npmVersion` | String | npm バージョン |

---

### 4. `comments` - コメント

```prisma
model Comment {
  id        Int     @id @default(autoincrement())
  content   String
  
  postId    Int
  post      Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId    Int
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**カラム説明**

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | Int | プライマリキー |
| `content` | String | コメント内容 |
| `postId` | Int | 投稿 ID（外部キー） |
| `userId` | Int | コメント作成者 ID（外部キー） |
| `createdAt` | DateTime | 作成日時 |
| `updatedAt` | DateTime | 更新日時 |

---

### 5. `tags` - タグマスター

```prisma
model Tag {
  id      Int     @id @default(autoincrement())
  name    String  @unique // "React", "PostgreSQL", "Authentication"
  
  posts   PostTag[]
}
```

---

### 6. `post_tags` - 投稿とタグの関連

```prisma
model PostTag {
  postId Int
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  tagId  Int
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
}
```

---

### 7. `solution_feedback` - 解決率データ

```prisma
model SolutionFeedback {
  id          Int     @id @default(autoincrement())
  
  postId      Int
  post        Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId      Int
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  solved      Boolean // true: 解決できた, false: 解決できなかった
  
  createdAt   DateTime @default(now())
  
  @@unique([postId, userId]) // 1つの投稿に対して1人1回のみ評価可能
}
```

**カラム説明**

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | Int | プライマリキー |
| `postId` | Int | 投稿 ID |
| `userId` | Int | ユーザー ID |
| `solved` | Boolean | 解決できたかどうか |
| `createdAt` | DateTime | 評価日時 |

---

## 📊 リレーション図

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ username        │
│ password        │
└────────┬────────┘
         │ 1:N
         │
    ┌────▼─────────────────┐
    │      posts           │
    ├──────────────────────┤
    │ id (PK)              │
    │ title                │
    │ description          │
    │ solution             │
    │ userId (FK) ─────────┼─→ users
    │ environmentId (FK)   │
    └────┬────────────┬────┘
         │            │
         │ 1:N        │ 1:1
         │            │
    ┌────▼────┐  ┌───▼─────────────┐
    │ comments │  │ environment_info│
    └──────────┘  └─────────────────┘
         │
         └─────────→ users
```

---

## 🔄 データフロー例

### 例1: エラー投稿から解決率を計算

```sql
-- 投稿 ID=1 の解決率を計算
SELECT
  post_id,
  COUNT(*) AS total_feedback,
  SUM(CASE WHEN solved = true THEN 1 ELSE 0 END) AS solved_count,
  ROUND(
    100.0 * SUM(CASE WHEN solved = true THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) AS success_rate
FROM solution_feedback
WHERE post_id = 1
GROUP BY post_id;
```

### 例2: タグで投稿を検索

```sql
-- "React" タグを持つ投稿を取得
SELECT DISTINCT p.*
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.name = 'React'
ORDER BY p.created_at DESC;
```

---

## 📝 Prisma Schema（実装版）

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              Int       @id @default(autoincrement())
  email           String    @unique
  username        String    @unique
  password        String
  profile         String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  posts           Post[]
  comments        Comment[]
  solutionFeedback SolutionFeedback[]
}

model Post {
  id                Int              @id @default(autoincrement())
  title             String
  description       String
  solution          String
  
  userId            Int
  user              User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  environmentId     Int?
  environment       EnvironmentInfo? @relation(fields: [environmentId], references: [id])
  
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  comments          Comment[]
  tags              PostTag[]
  solutionFeedback  SolutionFeedback[]
}

model EnvironmentInfo {
  id             Int     @id @default(autoincrement())
  language       String
  framework      String?
  os             String
  osVersion      String?
  nodeVersion    String?
  npmVersion     String?
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  posts          Post[]
}

model Comment {
  id        Int     @id @default(autoincrement())
  content   String
  
  postId    Int
  post      Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId    Int
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tag {
  id      Int     @id @default(autoincrement())
  name    String  @unique
  
  posts   PostTag[]
}

model PostTag {
  postId Int
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  tagId  Int
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
}

model SolutionFeedback {
  id          Int     @id @default(autoincrement())
  
  postId      Int
  post        Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId      Int
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  solved      Boolean
  
  createdAt   DateTime @default(now())
  
  @@unique([postId, userId])
}
```

---

**最終更新**: 2026年5月5日
