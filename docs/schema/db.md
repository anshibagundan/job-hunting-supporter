# データベーススキーマ定義

## 概要
就活サポートサービスで使用するデータベースのスキーマ定義です。
PostgreSQLを使用し、ユーザー、企業、求人イベント、面接、企業ESの管理を行います。

## ER図
```
users ||--o{ interviews : has
users ||--o{ company_es : writes
companies ||--o{ job_events : has
companies ||--o{ interviews : conducts
companies ||--o{ company_es : receives
job_events ||--o{ interviews : generates
```

## テーブル一覧

### 1. users テーブル
ユーザー情報を管理するテーブル

| カラム名       | データ型     | 制約                     | 説明                     | 例                     |
|----------------|--------------|--------------------------|--------------------------|------------------------|
| id             | SERIAL       | PRIMARY KEY              | ユーザーの一意な識別子   | 1                      |
| name           | VARCHAR(255) | NOT NULL                 | ユーザーの名前           | 山田太郎               |
| email          | VARCHAR(255) | NOT NULL, UNIQUE         | ユーザーのメールアドレス | yamada@example.com     |
| icon           | VARCHAR(255) | NOT NULL                 | ユーザーのアイコンURL    | https://example.com/icon.png |
| basic_es       | TEXT         | NULL                     | 基本ES                   | 私は〜                 |
| created_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | ユーザーの作成日時       | 2023-10-01 12:00:00    |
| updated_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | ユーザーの更新日時       | 2023-10-01 12:00:00    |

**注記**: Firebase Authenticationと連携するため、FirebaseのUIDをemailまたは別途firebase_uidカラムで管理することを推奨。

### 2. companies テーブル
企業情報を管理するテーブル

| カラム名           | データ型     | 制約                     | 説明                         | 例                             |
|--------------------|--------------|--------------------------|------------------------------|--------------------------------|
| id                 | SERIAL       | PRIMARY KEY              | 企業の一意な識別子           | 1                              |
| name               | VARCHAR(255) | NOT NULL, UNIQUE         | 企業名                       | 株式会社サンプル               |
| web_url            | VARCHAR(255) | NOT NULL, UNIQUE         | 企業のウェブサイトURL        | https://example.com            |
| description        | TEXT         | NOT NULL                 | 企業の説明                   | ITソリューション企業です       |
| img                | VARCHAR(255) | NULL                     | 企業のロゴ画像URL            | https://example.com/logo.png   |
| industry           | VARCHAR(255) | NOT NULL                 | 業種                         | IT・ソフトウェア               |
| scrape_target_url  | VARCHAR(255) | NOT NULL, UNIQUE         | スクレイピング対象のURL      | https://example.com/jobs       |
| last_scrape_time   | TIMESTAMP    | NOT NULL                 | 最後にスクレイピングした日時 | 2023-10-01 10:00:00            |
| created_at         | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | 企業の作成日時               | 2023-10-01 12:00:00            |
| updated_at         | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | 企業の更新日時               | 2023-10-01 12:00:00            |

### 3. job_events テーブル
求人・イベント情報を管理するテーブル

| カラム名        | データ型     | 制約                     | 説明                     | 例                         |
|-----------------|--------------|--------------------------|--------------------------|----------------------------|
| id              | SERIAL       | PRIMARY KEY              | イベントの一意な識別子   | 1                          |
| company_id      | INTEGER      | NOT NULL, FK(companies)  | 関連企業ID               | 1                          |
| job_title       | VARCHAR(255) | NOT NULL                 | 職種・ポジション名       | ソフトウェアエンジニア     |
| job_type        | VARCHAR(255) | NOT NULL                 | 雇用形態                 | 正社員                     |
| job_description | TEXT         | NOT NULL                 | 職務内容                 | Webアプリケーション開発    |
| start_date      | TIMESTAMP    | NOT NULL                 | 応募開始日時             | 2023-09-01 00:00:00        |
| deadline        | TIMESTAMP    | NOT NULL                 | 応募締切日時             | 2023-11-30 23:59:59        |
| event_url       | VARCHAR(255) | NOT NULL, UNIQUE         | 求人・イベントのURL      | https://example.com/job/1  |
| created_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | イベントの作成日時       | 2023-10-01 12:00:00        |
| updated_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | イベントの更新日時       | 2023-10-01 12:00:00        |

### 4. interviews テーブル
面接情報を管理するテーブル

| カラム名         | データ型     | 制約                     | 説明                     | 例                         |
|------------------|--------------|--------------------------|--------------------------|----------------------------|
| id               | SERIAL       | PRIMARY KEY              | 面接の一意な識別子       | 1                          |
| company_id       | INTEGER      | NOT NULL, FK(companies)  | 関連企業ID               | 1                          |
| job_event_id     | INTEGER      | NOT NULL, FK(job_events) | 関連求人イベントID       | 1                          |
| user_id          | INTEGER      | NOT NULL, FK(users)      | 関連ユーザーID           | 1                          |
| interview_at     | TIMESTAMP    | NOT NULL                 | 面接実施日時             | 2023-10-15 14:00:00        |
| stage            | VARCHAR(255) | NOT NULL                 | 選考段階                 | 一次面接                   |
| audio_note_path  | TEXT         | NULL                     | 音声ファイルパス         | /uploads/audio/001.wav     |
| transcript       | TEXT         | NULL                     | 音声の文字起こし         | こんにちは、よろしく...    |
| audio_summary    | TEXT         | NULL                     | 音声の要約               | 技術的な質問が中心でした   |
| text_note        | TEXT         | NULL                     | テキストメモ             | 緊張したが良い印象だった   |
| location         | TEXT         | NULL                     | 面接場所                 | 東京オフィス2F会議室       |
| meeting_url      | TEXT         | NULL                     | オンライン面接URL        | https://meet.google.com... |
| created_at       | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | 面接記録の作成日時       | 2023-10-01 12:00:00        |
| updated_at       | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | 面接記録の更新日時       | 2023-10-01 12:00:00        |

### 5. company_es テーブル
企業別エントリーシート情報を管理するテーブル

| カラム名    | データ型     | 制約                     | 説明                     | 例                         |
|-------------|--------------|--------------------------|--------------------------|----------------------------|
| id          | SERIAL       | PRIMARY KEY              | ESの一意な識別子         | 1                          |
| user_id     | INTEGER      | NOT NULL, FK(users)      | 作成ユーザーID           | 1                          |
| company_id  | INTEGER      | NOT NULL, FK(companies)  | 対象企業ID               | 1                          |
| content     | TEXT         | NOT NULL                 | ES内容                   | 志望動機は〜               |
| created_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | ESの作成日時             | 2023-10-01 12:00:00        |
| updated_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW()  | ESの更新日時             | 2023-10-01 12:00:00        |

## 制約とリレーション

### 外部キー制約
- `job_events.company_id` → `companies.id` (ON DELETE CASCADE)
- `interviews.company_id` → `companies.id` (ON DELETE CASCADE)  
- `interviews.job_event_id` → `job_events.id` (ON DELETE CASCADE)
- `interviews.user_id` → `users.id` (ON DELETE CASCADE)
- `company_es.user_id` → `users.id` (ON DELETE CASCADE)
- `company_es.company_id` → `companies.id` (ON DELETE CASCADE)

### ユニーク制約
- `users.email`
- `companies.name`
- `companies.web_url`
- `companies.scrape_target_url`
- `job_events.event_url`

## インデックス推奨
パフォーマンス向上のため、以下のインデックスを推奨します：

```sql
-- よく検索される外部キー
CREATE INDEX idx_job_events_company_id ON job_events(company_id);
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_company_id ON interviews(company_id);
CREATE INDEX idx_company_es_user_id ON company_es(user_id);
CREATE INDEX idx_company_es_company_id ON company_es(company_id);

-- 日付範囲検索用
CREATE INDEX idx_job_events_deadline ON job_events(deadline);
CREATE INDEX idx_interviews_interview_at ON interviews(interview_at);
```


