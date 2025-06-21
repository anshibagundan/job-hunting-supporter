-- Initial seed data for Job Hunting Supporter
-- This file contains sample data for development and testing

-- Clean existing data (be careful in production!)
TRUNCATE TABLE company_es, interviews, job_events, companies, users RESTART IDENTITY CASCADE;

-- Insert sample users
INSERT INTO users (firebase_uid, name, email, icon, basic_es) VALUES
('firebase_uid_1', '山田太郎', 'yamada@example.com', 'https://example.com/avatars/yamada.png', 
'私は大学でコンピュータサイエンスを専攻し、Webアプリケーション開発に情熱を持っています。
チーム開発の経験があり、React、Node.js、Pythonなどの技術スタックに精通しています。
新しい技術を学ぶことが好きで、常に成長を求めています。'),

('firebase_uid_2', '鈴木花子', 'suzuki@example.com', 'https://example.com/avatars/suzuki.png',
'経済学部で学びながら、独学でプログラミングを習得しました。
データ分析とビジネスの両方に興味があり、技術とビジネスの架け橋となるエンジニアを目指しています。
インターンでPythonを使った業務効率化ツールを開発した経験があります。'),

('firebase_uid_3', '佐藤健', 'sato@example.com', 'https://example.com/avatars/sato.png',
'機械学習とAIに強い興味を持つ情報工学専攻の学生です。
研究では自然言語処理に取り組んでおり、実践的なプロダクト開発にも挑戦したいと考えています。
オープンソースプロジェクトにも積極的に貢献しています。');

-- Insert sample companies
INSERT INTO companies (name, web_url, description, img, industry, scrape_target_url, last_scrape_time) VALUES
('株式会社テックイノベーション', 'https://tech-innovation.example.com', 
'最先端のAI技術を活用したSaaSプロダクトを開発しているスタートアップ企業です。
エンジニアファーストの文化を大切にし、技術力で社会課題を解決することを目指しています。', 
'https://tech-innovation.example.com/logo.png', 'IT・ソフトウェア', 
'https://tech-innovation.example.com/careers', '2024-01-15 10:00:00'),

('サイバーソリューションズ株式会社', 'https://cyber-solutions.example.com',
'セキュリティソフトウェアの開発・販売を行う大手IT企業です。
グローバルに展開し、世界中の企業のセキュリティを守っています。', 
'https://cyber-solutions.example.com/logo.png', 'セキュリティ',
'https://cyber-solutions.example.com/jobs', '2024-01-15 11:00:00'),

('デジタルクリエイティブ株式会社', 'https://digital-creative.example.com',
'Webデザインとマーケティングテクノロジーを融合させたサービスを提供しています。
クリエイティブとテクノロジーの力で、新しい価値を創造します。',
'https://digital-creative.example.com/logo.png', 'Web・インターネット',
'https://digital-creative.example.com/recruit', '2024-01-15 12:00:00'),

('フィンテックジャパン株式会社', 'https://fintech-japan.example.com',
'金融とテクノロジーを融合させた革新的なサービスを提供するフィンテック企業です。
キャッシュレス決済や資産運用アプリなど、人々の金融体験を変革しています。',
'https://fintech-japan.example.com/logo.png', 'フィンテック',
'https://fintech-japan.example.com/careers', '2024-01-15 13:00:00'),

('グリーンテック株式会社', 'https://greentech.example.com',
'環境問題をテクノロジーで解決することを目指すクリーンテック企業です。
再生可能エネルギーの最適化やカーボンフットプリント削減のためのソリューションを開発しています。',
'https://greentech.example.com/logo.png', '環境・エネルギー',
'https://greentech.example.com/jobs', '2024-01-15 14:00:00');

-- Insert job events
INSERT INTO job_events (company_id, job_title, job_type, job_description, start_date, deadline, event_url) VALUES
-- テックイノベーション
(1, 'バックエンドエンジニア（新卒）', '正社員', 
'AIプロダクトのバックエンド開発を担当していただきます。
・マイクロサービスアーキテクチャの設計・実装
・機械学習モデルのAPI化
・大規模データ処理基盤の構築
【必須スキル】プログラミング経験、【歓迎スキル】Go, Python, Kubernetes',
'2024-02-01 00:00:00', '2024-03-31 23:59:59', 'https://tech-innovation.example.com/jobs/backend-newgrad-2024'),

(1, 'フロントエンドエンジニア（新卒）', '正社員',
'最新のフロントエンド技術を使ったWebアプリケーション開発
・React/Next.jsを使ったSPA開発
・UIコンポーネントの設計・実装
・パフォーマンス最適化
【必須スキル】HTML/CSS/JavaScript、【歓迎スキル】React, TypeScript',
'2024-02-01 00:00:00', '2024-03-31 23:59:59', 'https://tech-innovation.example.com/jobs/frontend-newgrad-2024'),

(1, '夏季インターンシップ（5days）', 'インターン',
'実際のプロダクト開発を体験できる5日間のインターンシップ
・チーム開発の実践
・現役エンジニアによるメンタリング
・最終日に成果発表会
【対象】2025年卒業予定の学生',
'2024-06-01 00:00:00', '2024-06-30 23:59:59', 'https://tech-innovation.example.com/internship/summer-2024'),

-- サイバーソリューションズ
(2, 'セキュリティエンジニア（新卒）', '正社員',
'サイバーセキュリティ製品の開発・運用
・脆弱性診断ツールの開発
・セキュリティインシデント対応
・新規セキュリティ技術の研究開発
【必須スキル】プログラミング経験、ネットワーク基礎知識',
'2024-02-15 00:00:00', '2024-04-15 23:59:59', 'https://cyber-solutions.example.com/jobs/security-engineer-2024'),

(2, 'ソフトウェアエンジニア（新卒）', '正社員',
'セキュリティソフトウェアの設計・開発
・Windows/Mac/Linux向けアプリケーション開発
・クラウドセキュリティサービスの開発
【必須スキル】C/C++またはJavaの経験',
'2024-02-15 00:00:00', '2024-04-15 23:59:59', 'https://cyber-solutions.example.com/jobs/software-engineer-2024'),

-- デジタルクリエイティブ
(3, 'Webエンジニア（新卒）', '正社員',
'クライアント企業のWebサイト・Webアプリケーション開発
・要件定義から実装まで一貫して担当
・最新のWeb技術を活用した開発
【必須スキル】Web開発の基礎知識',
'2024-03-01 00:00:00', '2024-04-30 23:59:59', 'https://digital-creative.example.com/jobs/web-engineer-2024'),

(3, 'UI/UXエンジニア（新卒）', '正社員',
'ユーザー体験を重視したインターフェース開発
・デザイナーと協働したUI実装
・ユーザビリティテストの実施
【必須スキル】HTML/CSS/JavaScript、デザインへの興味',
'2024-03-01 00:00:00', '2024-04-30 23:59:59', 'https://digital-creative.example.com/jobs/uiux-engineer-2024'),

-- フィンテックジャパン
(4, 'バックエンドエンジニア（新卒）', '正社員',
'金融サービスのバックエンド開発
・決済システムの設計・実装
・高可用性・高セキュリティなシステム構築
【必須スキル】プログラミング経験、【歓迎スキル】Java, Spring Boot',
'2024-01-15 00:00:00', '2024-03-15 23:59:59', 'https://fintech-japan.example.com/jobs/backend-2024'),

(4, 'モバイルアプリエンジニア（新卒）', '正社員',
'金融アプリケーションの開発
・iOS/Androidアプリの設計・実装
・セキュアなモバイル決済機能の実装
【必須スキル】モバイルアプリ開発への興味',
'2024-01-15 00:00:00', '2024-03-15 23:59:59', 'https://fintech-japan.example.com/jobs/mobile-2024'),

-- グリーンテック
(5, 'データエンジニア（新卒）', '正社員',
'環境データの収集・分析基盤の構築
・IoTデバイスからのデータ収集システム開発
・大規模データの処理・分析
【必須スキル】プログラミング経験、データ分析への興味',
'2024-02-20 00:00:00', '2024-04-20 23:59:59', 'https://greentech.example.com/jobs/data-engineer-2024'),

(5, 'ソフトウェアエンジニア（新卒）', '正社員',
'環境ソリューションの開発
・エネルギー最適化アルゴリズムの実装
・Webアプリケーション開発
【必須スキル】プログラミング経験、環境問題への関心',
'2024-02-20 00:00:00', '2024-04-20 23:59:59', 'https://greentech.example.com/jobs/software-engineer-2024');

-- Insert sample interviews
INSERT INTO interviews (company_id, job_event_id, user_id, interview_at, stage, audio_note_path, transcript, audio_summary, text_note, location, meeting_url) VALUES
(1, 1, 1, '2024-02-15 14:00:00', '一次面接', NULL,
'面接官：本日はお時間いただきありがとうございます。まず自己紹介をお願いします。
応募者：山田太郎と申します。〇〇大学でコンピュータサイエンスを専攻しております...
面接官：弊社を志望した理由を教えてください。
応募者：御社のAI技術を活用した社会課題解決のアプローチに強く共感し...',
'技術的な質問が中心で、特にアルゴリズムとデータ構造についての理解度を確認された。プログラミング課題もその場で出題され、思考プロセスを説明しながら解答した。',
'緊張したが、準備していた内容は話せた。技術的な質問にも概ね答えられたと思う。',
'東京オフィス 会議室A', NULL),

(2, 4, 2, '2024-03-01 10:00:00', '一次面接', NULL, NULL, NULL,
'オンライン面接。接続トラブルがあったが、面接官が親切に対応してくれた。
セキュリティへの興味や、なぜセキュリティ分野を志望するのかを深く聞かれた。',
NULL, 'https://meet.google.com/abc-defg-hij'),

(3, 6, 1, '2024-03-10 15:00:00', '二次面接', '/uploads/audio/interview_001.wav',
'面接官：前回の面接を踏まえて、改めて志望動機を聞かせてください。
応募者：はい、前回お話しした内容に加えて、御社のインターンシップに参加させていただき...',
'二次面接では、より具体的なキャリアビジョンや、入社後にやりたいことについて深掘りされた。チーム開発の経験についても詳しく聞かれた。',
'手応えあり。自分の経験を具体的に話せた。', '本社ビル 20F', NULL);

-- Insert sample company_es entries
INSERT INTO company_es (user_id, company_id, title, content, ai_summary, ai_advice) VALUES
(1, 1, 'AIで社会を変える挑戦', 
'私が貴社を志望する理由は、AI技術を活用して社会課題を解決するという理念に強く共感したからです。
大学での研究を通じて、技術が人々の生活を豊かにする可能性を実感しました。
特に貴社の医療AI診断支援システムは、地方の医療格差解消に大きく貢献しており、
このような意義のあるプロダクト開発に携わりたいと考えています。

私は大学でコンピュータビジョンの研究を行っており、画像認識モデルの精度向上に取り組んできました。
この経験を活かし、貴社のAIプロダクトの発展に貢献したいと考えています。',
'AI技術による社会課題解決への共感を軸に、具体的な製品への理解と自身の研究経験をアピール。医療AI診断支援システムへの言及が効果的。',
'より具体的な入社後のビジョンを追加すると良い。例えば、「入社後は〇〇の分野でAI技術を応用し、〜のような新しい価値を創造したい」など。'),

(2, 2, 'セキュリティで世界を守る', 
'私は、増加するサイバー脅威から企業と個人を守ることに使命感を感じ、貴社を志望いたします。
大学で情報セキュリティを学ぶ中で、技術的な対策だけでなく、人的要因も含めた総合的なアプローチが重要だと学びました。

貴社の「セキュリティを文化として根付かせる」という理念に強く共感しています。
私も、技術力だけでなく、セキュリティ意識の啓発にも力を入れたいと考えています。',
'セキュリティへの使命感と総合的アプローチへの理解を示している。企業理念への共感も明確。',
'具体的なセキュリティ関連の経験やプロジェクトがあれば追加すべき。CTF参加経験やセキュリティ関連の資格なども記載を推奨。'),

(1, 3, 'デザインとテクノロジーの融合', 
'私は、美しいデザインと優れた技術の融合により、ユーザーに感動を与えるプロダクトを作りたいと考え、貴社を志望します。
個人プロジェクトでWebアプリケーションを開発する際、UIの重要性を痛感しました。
機能だけでなく、使いやすさや見た目の美しさがユーザー体験を大きく左右することを学びました。

貴社のポートフォリオを拝見し、技術力の高さだけでなく、細部までこだわったデザインに感銘を受けました。
このような環境で、エンジニアとしてもデザインセンスを磨きながら成長したいと考えています。',
'デザインとテクノロジーの融合への理解を示し、個人の経験から学んだことを効果的にアピール。企業の強みへの理解も良好。',
'デザインとエンジニアリングの協働についての具体的なビジョンを追加することで、より説得力が増す。'),

(3, 4, '金融の民主化を技術で実現', 
'私は、テクノロジーの力で金融サービスをより身近で使いやすいものにしたいという思いから、貴社を志望します。
学生時代、アルバイトで貯めたお金の運用を考えた際、既存の金融サービスの複雑さに困惑した経験があります。

貴社のシンプルで直感的な資産運用アプリは、まさに私が求めていたサービスです。
プログラミングスキルを活かし、より多くの人が金融サービスを活用できる世界を実現したいと考えています。',
'個人的な経験から金融サービスの課題を認識し、それを解決したいという明確な動機を示している。',
'金融に関する知識や、関連する技術（ブロックチェーン、暗号技術など）への興味・学習経験があれば追加すると良い。'),

(2, 5, '技術で地球の未来を守る',
'私は、環境問題の解決にテクノロジーが果たす役割の大きさを感じ、貴社を志望いたします。
データ分析の授業で、気候変動データを分析した際、問題の深刻さと同時に、データ活用の可能性を実感しました。

貴社の再生可能エネルギー最適化システムは、まさにデータとアルゴリズムの力で環境問題に立ち向かう素晴らしい例だと思います。
私も、プログラミングとデータ分析のスキルを活かし、持続可能な社会の実現に貢献したいと考えています。',
'環境問題への関心とデータ分析スキルを結びつけ、企業の事業との関連性を明確に示している。',
'環境分野での具体的なプロジェクト経験や、関連する研究・勉強会への参加経験などを追加できるとより説得力が増す。');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_events_company_id ON job_events(company_id);
CREATE INDEX IF NOT EXISTS idx_job_events_deadline ON job_events(deadline);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_company_id ON interviews(company_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job_event_id ON interviews(job_event_id);
CREATE INDEX IF NOT EXISTS idx_interviews_interview_at ON interviews(interview_at);
CREATE INDEX IF NOT EXISTS idx_company_es_user_id ON company_es(user_id);
CREATE INDEX IF NOT EXISTS idx_company_es_company_id ON company_es(company_id);

-- Update sequences to continue from the inserted data
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('job_events_id_seq', (SELECT MAX(id) FROM job_events));
SELECT setval('interviews_id_seq', (SELECT MAX(id) FROM interviews));
SELECT setval('company_es_id_seq', (SELECT MAX(id) FROM company_es));

-- Verify the data
SELECT 'Users created:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Companies created:', COUNT(*) FROM companies
UNION ALL
SELECT 'Job events created:', COUNT(*) FROM job_events
UNION ALL
SELECT 'Interviews created:', COUNT(*) FROM interviews
UNION ALL
SELECT 'Company ES created:', COUNT(*) FROM company_es;