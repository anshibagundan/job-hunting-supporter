# シーケンス図

## 概要
就活サポートサービスの主要な機能に関するシーケンス図を示します。

## 1. ユーザー登録・ログインフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant FB as Firebase Auth
    participant B as バックエンド
    participant DB as データベース

    U->>F: ログイン画面アクセス
    F->>U: ログイン画面表示
    U->>F: Googleログインボタンクリック
    F->>FB: signInWithPopup(GoogleProvider)
    FB->>U: Google認証画面表示
    U->>FB: 認証情報入力
    FB->>F: FirebaseUser & IDトークン返却
    F->>B: POST /api/users (IDトークン)
    B->>FB: IDトークン検証
    FB->>B: 検証結果・ユーザー情報
    B->>DB: ユーザー情報確認/作成
    DB->>B: ユーザー情報返却
    B->>F: ユーザー情報返却
    F->>U: ダッシュボード画面表示
```

## 2. ES作成・AI添削フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant DB as データベース
    participant AI as Gemini API

    U->>F: ES作成画面アクセス
    F->>B: GET /api/companies (企業一覧取得)
    B->>DB: SELECT companies
    DB->>B: 企業一覧
    B->>F: 企業一覧返却
    F->>U: ES作成フォーム表示

    U->>F: ES内容入力・企業選択
    U->>F: 保存ボタンクリック
    F->>B: POST /api/company-es
    B->>DB: INSERT company_es
    DB->>B: ES ID返却
    B->>F: 保存完了通知

    U->>F: AI添削ボタンクリック
    F->>B: POST /api/analyze-es
    B->>AI: Gemini API呼び出し
    AI->>B: 添削結果返却
    B->>F: 添削結果返却
    F->>U: 添削結果表示
```

## 3. 面接記録・音声要約フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant DB as データベース
    participant S as ストレージ
    participant AI as Gemini API

    U->>F: 面接記録画面アクセス
    F->>U: 面接記録フォーム表示

    U->>F: 面接情報入力（企業、日時等）
    U->>F: 音声ファイルアップロード
    F->>B: POST /api/interviews/audio/upload
    B->>S: 音声ファイルストレージ保存
    S->>B: ファイルパス返却

    B->>AI: 音声文字起こし依頼
    AI->>B: 文字起こし結果返却
    B->>AI: 要約生成依頼
    AI->>B: 要約結果返却

    B->>DB: INSERT interviews (音声パス、文字起こし、要約)
    DB->>B: 面接ID返却
    B->>F: 面接記録完了通知
    F->>U: 完了画面表示
```

## 4. ダッシュボード表示フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant DB as データベース

    U->>F: ダッシュボードアクセス
    
    par 並行データ取得
        F->>B: GET /api/users/:id
        B->>DB: SELECT users WHERE id = ?
        DB->>B: ユーザー情報
        B->>F: ユーザー情報返却
    and
        F->>B: GET /api/company-es/user/:userID
        B->>DB: SELECT company_es WHERE user_id = ?
        DB->>B: ユーザーのES一覧
        B->>F: ES一覧返却
    and
        F->>B: GET /api/interviews/user/:userID
        B->>DB: SELECT interviews WHERE user_id = ?
        DB->>B: ユーザーの面接一覧
        B->>F: 面接一覧返却
    and
        F->>B: GET /api/job-events (今週の予定)
        B->>DB: SELECT job_events WHERE deadline BETWEEN ? AND ?
        DB->>B: 今週の求人イベント
        B->>F: 今週の予定返却
    end

    F->>U: ダッシュボード表示
```

## 5. 企業別情報表示フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant DB as データベース

    U->>F: 企業詳細画面アクセス (/companies/:id)
    
    par 企業関連データ取得
        F->>B: GET /api/companies/:id
        B->>DB: SELECT companies WHERE id = ?
        DB->>B: 企業情報
        B->>F: 企業情報返却
    and
        F->>B: GET /api/company-es/company/:companyID
        B->>DB: SELECT company_es WHERE company_id = ?
        DB->>B: 企業向けES一覧
        B->>F: ES一覧返却
    and
        F->>B: GET /api/interviews/company/:companyID
        B->>DB: SELECT interviews WHERE company_id = ?
        DB->>B: 企業での面接一覧
        B->>F: 面接一覧返却
    and
        F->>B: GET /api/job-events/company/:companyID
        B->>DB: SELECT job_events WHERE company_id = ?
        DB->>B: 企業の求人イベント一覧
        B->>F: 求人イベント一覧返却
    end

    F->>U: 企業詳細画面表示
```

## 6. データ更新フロー（ES編集）

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant DB as データベース

    U->>F: ES編集画面アクセス
    F->>B: GET /api/company-es/:id
    B->>DB: SELECT company_es WHERE id = ?
    DB->>B: ES情報
    B->>F: ES情報返却
    F->>U: ES編集フォーム表示

    U->>F: ES内容編集
    U->>F: 更新ボタンクリック
    F->>B: PUT /api/company-es
    B->>DB: UPDATE company_es SET content = ?, updated_at = NOW()
    DB->>B: 更新完了
    B->>F: 更新完了通知
    F->>U: 更新完了画面表示
```

## 7. エラーハンドリングフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant DB as データベース

    U->>F: API呼び出し操作
    F->>B: API リクエスト
    
    alt 正常処理
        B->>DB: データベース操作
        DB->>B: 正常レスポンス
        B->>F: 200 OK + データ
        F->>U: 正常画面表示
    else データベースエラー
        B->>DB: データベース操作
        DB->>B: エラー（接続エラー等）
        B->>F: 500 Internal Server Error
        F->>U: エラーメッセージ表示
    else バリデーションエラー
        B->>B: バリデーション失敗
        B->>F: 400 Bad Request
        F->>U: 入力エラーメッセージ表示
    else 認証エラー
        B->>B: 認証失敗
        B->>F: 401 Unauthorized
        F->>U: ログイン画面リダイレクト
    end
```

## 注意事項

- すべてのAPI呼び出しにはFirebase IDトークンによる認証が必要
- バックエンドではFirebase Admin SDKを使用してIDトークンを検証
- エラーハンドリングは各フローで適切に実装する必要がある
- AI APIの呼び出しは非同期処理として実装し、タイムアウト対策も考慮する
- ファイルアップロードは適切なサイズ制限とファイル形式チェックを行う