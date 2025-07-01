<div align="center">

# Job Hunting Supporter 🎯

**就活生向けの総合サポートサービス**
_AI 添削と音声要約で効率的な就職活動を支援_

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

</div>

## 📊 背景・課題・解決されること

### 🎯 背景

現代の就職活動では、学生は数十社に及ぶ企業への応募を行い、それぞれに対して ES（エントリーシート）の作成、面接対策、スケジュール管理を個別に行う必要があります。これらの作業は膨大な時間と労力を要求し、学生にとって大きな負担となっています。

### ❌ 課題

- **ES 作成の効率化不足**: 企業ごとに異なる ES を一から作成する必要があり、時間がかかる
- **客観的な自己分析の困難さ**: 自分の ES を客観的に評価し、改善点を見つけることが難しい
- **面接振り返りの非効率性**: 面接後の振り返りが感覚的で、具体的な改善につながりにくい
- **情報の分散管理**: 企業情報、ES、面接記録、スケジュールが別々に管理され、全体把握が困難

### ✅ 解決されること

- **AI 添削による ES 品質向上**: Gemini API を活用した詳細な分析と改善提案により、説得力のある ES を作成
- **音声による面接振り返り**: 面接音声を AI が自動で文字起こし・要約し、効率的な振り返りを実現
- **企業別情報の一元管理**: 企業ごとの ES、面接記録、スケジュールを統合管理
- **データドリブンな就活戦略**: 分析結果に基づいた具体的な改善アクションの提示

---

## 🏗️ 構成要素

### 🎨 フロントエンド

- **Next.js (App Router)**: モダンな React フレームワークによる高速な Web アプリケーション
- **Tailwind CSS + shadcn/ui**: 統一感のある UI コンポーネントと効率的なスタイリング
- **TypeScript**: 型安全性を確保した開発

### ⚡ バックエンド

- **Go**: Clean Architecture ベースの高性能 API サーバー
- **Gin**: 軽量で高速な Web フレームワーク
- **GORM**: PostgreSQL 用の ORM ライブラリ

### 🤖 AI・音声処理

- **Gemini API**: ES 分析・添削、企業情報生成、面接要約生成
- **OpenAI Whisper/GPT**: 音声文字起こしと面接分析（補完機能）

### 🗄️ インフラ・データベース

- **PostgreSQL**: リレーショナルデータベース（GCP Cloud SQL）
- **Firebase Authentication**: Google OAuth 連携による認証
- **Google Cloud Storage**: 音声ファイル等の保存

---

## 📱 プロダクト説明

### 🚀 主要機能

#### 📝 ES 作成・AI 添削機能

- **基本 ES 管理**: 自己 PR や志望動機のベース文章を保存・管理
- **企業別 ES 生成**: 基本 ES と企業情報を組み合わせた自動 ES 生成
- **AI 添削分析**: 5 つの観点（具体性、企業関連性、文章構成、インパクト、読みやすさ）からの詳細分析
- **項目別達成度評価**: 各項目の達成度を数値化し、具体的な改善提案を提供

#### 🎤 面接記録・音声要約機能

- **音声アップロード**: 面接音声を Web ブラウザから直接アップロード
- **自動文字起こし**: AI による高精度な音声テキスト変換
- **面接要約生成**: 要点整理、強み・弱み分析、改善提案の自動生成
- **手動メモ機能**: AI では捉えきれない細かな気づきを記録

#### 🏢 企業情報管理

- **企業登録**: 企業名から基本情報を AI 自動生成
- **企業別情報統合**: ES、面接記録、選考スケジュールを企業ごとに一元管理
- **選考状況追跡**: 各企業での選考進捗を可視化

#### 📊 ダッシュボード・分析

- **活動状況可視化**: ES 作成状況、面接実施状況の俯瞰的な把握
- **分析結果表示**: AI 分析による達成度グラフと改善トレンド
- **スケジュール管理**: ES 締切、面接予定の統合カレンダー

---

## 💡 注力したポイント

### 🧠 高度な AI 分析エンジン

Gemini API を活用した多層的な分析システムを構築。単純な文法チェックではなく、企業の特色を踏まえた戦略的なアドバイスを提供することで、他の就活支援ツールとの差別化を図りました。

### 🎯 企業特化型 ES 分析

一般的な ES 添削ではなく、選択した企業の事業内容・価値観・求める人材像と照らし合わせた分析を実現。これにより、より実践的で効果的なフィードバックが可能になりました。

### 🔄 音声からの価値抽出

面接音声を単純に文字起こしするだけでなく、AI による要約・分析機能を組み合わせることで、面接後の振り返りを飛躍的に効率化しました。

### 🏗️ スケーラブルなアーキテクチャ

Clean Architecture を採用したバックエンド実装により、新機能追加や外部 API 変更に対する柔軟性を確保。長期的な運用・拡張を見据えた設計になっています。

### 💻 現代的な UX 設計

Next.js App Router と Tailwind CSS を活用した高速で直感的な UI。レスポンシブデザインにより、PC・スマートフォンの両方で快適に利用できます。

---

## 🛠️ 使用技術

### フロントエンド

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form**
- **Lucide React** (アイコン)

### バックエンド

- **Go 1.21+**
- **Gin** (Web フレームワーク)
- **GORM** (ORM)
- **PostgreSQL**

### AI・外部 API

- **Google Gemini API** (ES 分析・企業情報生成・面接要約)
- **OpenAI API** (音声文字起こし・補完分析)

### インフラ・認証

- **Firebase Authentication**
- **Google Cloud Platform**
  - Cloud SQL (PostgreSQL)
  - Cloud Storage
  - Cloud Run (予定)
- **Docker** & **Docker Compose**

### 開発・デプロイ

- **Air** (Go ホットリロード)
- **pnpm** (Node.js パッケージ管理)
- **Biome** (JavaScript/TypeScript フォーマッター・リンター)
- **GitHub Actions** (CI/CD 予定)

---

## 🛠️ 開発環境

### フロントエンド コード品質管理

このプロジェクトではフロントエンドのコード品質管理に [Biome](https://biomejs.dev/) を使用しています。

#### 利用可能なコマンド

```bash
# フロントエンドディレクトリに移動
cd front

# コードフォーマット
pnpm format

# フォーマットチェック（CI用）
pnpm format:check

# リント・フォーマット全体チェック
pnpm biome:check

# 自動修正（安全な修正のみ）
pnpm biome:fix

# CI用総合チェック
pnpm biome:ci
```

#### VS Code 設定

- Biome 拡張機能が自動でインストール推奨されます
- ファイル保存時の自動フォーマットが有効化されています
- import 文の自動整理機能が有効化されています

#### 設定ファイル

- **`biome.json`**: Biome の設定（フォーマット・リントルール）
- **`.vscode/settings.json`**: VS Code 用プロジェクト設定
- **`.vscode/extensions.json`**: 推奨拡張機能の設定
