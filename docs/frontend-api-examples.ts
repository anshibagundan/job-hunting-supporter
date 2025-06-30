// Example: Using the new flexible evaluation criteria API
// This demonstrates how to call the new API endpoints from the frontend

interface CustomAnalysisRequest {
  content: string;
  categories: string[];
  user_id?: number;
  save_to_profile?: boolean;
}

interface CompanyAnalysisRequest {
  content: string;
  company_id: number;
  categories: string[];
}

interface AdviceItem {
  category: string;
  achievement: number;
  reason: string;
  suggestion: string;
}

interface AnalysisResponse {
  summary: string;
  advice: string;
  adviceItems: AdviceItem[];
}

// Example function to analyze ES with custom categories
export async function analyzeESWithCustomCategories(
  content: string,
  categories: string[],
  userId?: number,
  saveToProfile: boolean = false
): Promise<AnalysisResponse> {
  const request: CustomAnalysisRequest = {
    content,
    categories,
    user_id: userId,
    save_to_profile: saveToProfile
  };

  const response = await fetch('/api/users/base-es/analyze-with-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return await response.json();
}

// Example function to analyze ES with company context and custom categories
export async function analyzeESWithCompanyAndCategories(
  content: string,
  companyId: number,
  categories: string[]
): Promise<AnalysisResponse> {
  const request: CompanyAnalysisRequest = {
    content,
    company_id: companyId,
    categories
  };

  const response = await fetch('/api/company-es/analyze-with-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return await response.json();
}

// Example usage scenarios
export const ExampleUsages = {
  // Example 1: Technical position analysis
  async analyzeTechnicalES(content: string, userId?: number) {
    const technicalCategories = [
      'プログラミングスキルの実証',
      'システム設計思考', 
      '技術的問題解決能力',
      'チーム開発経験',
      '継続的学習意欲'
    ];

    return await analyzeESWithCustomCategories(
      content, 
      technicalCategories, 
      userId, 
      true
    );
  },

  // Example 2: Business position analysis
  async analyzeBusinessES(content: string, userId?: number) {
    const businessCategories = [
      '市場分析能力',
      '戦略的思考',
      'コミュニケーション能力',
      '数値管理経験',
      'リーダーシップポテンシャル'
    ];

    return await analyzeESWithCustomCategories(
      content,
      businessCategories,
      userId,
      true
    );
  },

  // Example 3: Company-specific analysis
  async analyzeForSpecificCompany(content: string, companyId: number) {
    const companySpecificCategories = [
      '企業文化への適合性',
      '業界知識の深さ',
      '具体的な貢献案',
      '長期的なビジョン',
      '価値観の一致度'
    ];

    return await analyzeESWithCompanyAndCategories(
      content,
      companyId,
      companySpecificCategories
    );
  }
};

// Example React component usage
/*
import React, { useState } from 'react';
import { analyzeESWithCustomCategories } from './api-examples';

export function CustomESAnalyzer() {
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim() || categories.length === 0) {
      alert('Please provide content and at least one category');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeESWithCustomCategories(content, categories);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          ES Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg"
          placeholder="Enter your ES content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Custom Categories (one per line)
        </label>
        <textarea
          value={categories.join('\n')}
          onChange={(e) => setCategories(e.target.value.split('\n').filter(c => c.trim()))}
          className="w-full h-24 p-3 border rounded-lg"
          placeholder="Enter evaluation categories..."
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze with Custom Categories'}
      </button>

      {analysis && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium">Summary</h3>
            <p className="text-gray-600">{analysis.summary}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Advice Items</h3>
            <div className="space-y-3">
              {analysis.adviceItems.map((item, index) => (
                <div key={index} className="border p-3 rounded-lg">
                  <h4 className="font-medium">{item.category}</h4>
                  <p className="text-sm text-gray-600">Achievement: {item.achievement}%</p>
                  <p className="text-sm">{item.reason}</p>
                  <p className="text-sm text-blue-600">{item.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
*/