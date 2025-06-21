# Database Seed Files

このディレクトリには、就活サポートアプリケーションのデータベースシードファイルが含まれています。

## 使用方法

### PostgreSQLに直接適用する場合

```bash
# データベースに接続
psql -h localhost -U postgres -d job_hunting_db

# シードファイルを実行
\i database/seeds/001_initial_seed.sql
```

### Dockerを使用している場合

```bash
# コンテナ内でシードを実行
docker exec -i postgres_container psql -U postgres -d job_hunting_db < database/seeds/001_initial_seed.sql
```

## シードデータの内容

### 001_initial_seed.sql

開発・テスト用の初期データセットを含みます。

#### 含まれるデータ：

**ユーザー（3名）**
- 山田太郎 - コンピュータサイエンス専攻
- 鈴木花子 - 経済学部、独学プログラマー
- 佐藤健 - 機械学習・AI専攻

**企業（5社）**
- 株式会社テックイノベーション - AIスタートアップ
- サイバーソリューションズ株式会社 - セキュリティ企業
- デジタルクリエイティブ株式会社 - Web・デザイン企業
- フィンテックジャパン株式会社 - 金融テック企業
- グリーンテック株式会社 - 環境テック企業

**求人イベント（12件）**
- 新卒採用情報
- インターンシップ情報
- 各種エンジニアポジション

**面接記録（3件）**
- 文字起こしデータ例
- 音声要約例
- 手動メモ例

**企業別ES（5件）**
- 各企業向けの志望動機
- AI生成要約・アドバイス例

## 注意事項

⚠️ **重要**: このシードファイルは既存のデータを削除します（TRUNCATE）。本番環境では絶対に実行しないでください。

## カスタマイズ

新しいシードデータを追加する場合は、以下の命名規則に従ってください：

- `002_additional_companies.sql` - 追加企業データ
- `003_seasonal_job_events.sql` - 季節限定求人
- `004_test_scenarios.sql` - テストシナリオ用データ

## データの確認

シード実行後、以下のクエリでデータが正しく挿入されているか確認できます：

```sql
-- データ件数の確認
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Companies', COUNT(*) FROM companies
UNION ALL
SELECT 'Job Events', COUNT(*) FROM job_events
UNION ALL
SELECT 'Interviews', COUNT(*) FROM interviews
UNION ALL
SELECT 'Company ES', COUNT(*) FROM company_es;

-- 企業と求人の関係確認
SELECT c.name as company_name, COUNT(je.id) as job_events_count
FROM companies c
LEFT JOIN job_events je ON c.id = je.company_id
GROUP BY c.id, c.name
ORDER BY c.name;
```