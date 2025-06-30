# Flexible Evaluation Criteria API Documentation

## Overview

The job hunting supporter application now supports flexible evaluation criteria for ES (Entry Sheet) analysis. Users can specify custom categories for evaluation instead of being limited to predefined categories.

## New API Endpoints

### 1. Basic ES Analysis with Custom Categories

**Endpoint:** `POST /api/users/base-es/analyze-with-categories`

**Description:** Analyze basic ES content with custom evaluation categories.

**Request Body:**
```json
{
  "content": "ES content to analyze",
  "categories": [
    "論理的思考力の表現",
    "チームワークの実績", 
    "リーダーシップの発揮",
    "創造性と問題解決能力"
  ],
  "user_id": 123,
  "save_to_profile": true
}
```

**Response:**
```json
{
  "summary": "Generated summary of the ES content",
  "advice": "Overall advice text",
  "adviceItems": [
    {
      "category": "論理的思考力の表現",
      "achievement": 75,
      "reason": "評価理由の説明",
      "suggestion": "具体的な改善提案"
    }
  ]
}
```

### 2. Company-Specific ES Analysis with Custom Categories

**Endpoint:** `POST /api/company-es/analyze-with-categories`

**Description:** Analyze ES content with company information and custom evaluation categories.

**Request Body:**
```json
{
  "content": "ES content to analyze",
  "company_id": 456,
  "categories": [
    "企業文化への適合性",
    "技術スキルの関連性",
    "成長意欲の表現",
    "具体的な貢献案"
  ]
}
```

**Response:**
```json
{
  "summary": "Generated summary with company context",
  "advice": "Company-specific advice text",
  "adviceItems": [
    {
      "category": "企業文化への適合性",
      "achievement": 80,
      "reason": "企業の特色を踏まえた評価理由",
      "suggestion": "企業に特化した改善提案"
    }
  ]
}
```

## Default Categories

### Basic ES Analysis Default Categories:
1. 具体性の向上（数値や成果の追加）
2. 企業との関連性の明確化
3. 文章構成の改善提案
4. インパクトの向上方法
5. 読みやすさの改善

### Company-Specific Analysis Default Categories:
1. 企業理解と志望動機の明確化
2. 企業文化・価値観との適合性
3. 業界知識と関連性の表現
4. 具体的な貢献可能性の提示
5. 企業が求める人材像との一致度

## Validation Rules

- **Categories**: Must contain 1-10 categories
- **Content**: Cannot be empty
- **Category names**: Should be descriptive and meaningful in Japanese

## Backward Compatibility

All existing API endpoints continue to work exactly as before:
- `POST /api/users/base-es/analyze`
- `POST /api/company-es/analyze`

These endpoints use the default categories automatically.

## Example Custom Categories

### For Technical Positions:
- プログラミングスキルの実証
- システム設計思考
- 技術的問題解決能力
- チーム開発経験

### For Business Positions:
- 市場分析能力
- 戦略的思考
- コミュニケーション能力
- 数値管理経験

### For Creative Positions:
- 創造性とアイデア力
- デザイン思考
- ユーザー視点の理解
- 表現力と伝達力

## Error Handling

- **400 Bad Request**: Invalid input (empty categories, too many categories, etc.)
- **500 Internal Server Error**: Analysis failed due to AI service issues

## Usage Tips

1. **Be Specific**: Use detailed, specific category names for better analysis
2. **Keep Relevant**: Choose categories that match the ES content and target position
3. **Balance Quantity**: 3-7 categories typically provide the best balance of detail and manageability
4. **Consider Context**: Use company-specific analysis for better targeted advice