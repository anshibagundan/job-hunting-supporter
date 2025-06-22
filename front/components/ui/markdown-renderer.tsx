import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // 簡単なMarkdownパーサー（基本的な機能のみ）
  const parseMarkdown = (text: string) => {
    // 改行を<br>に変換
    let html = text.replace(/\n/g, '<br>');
    
    // **太字** を <strong> に変換
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // *斜体* を <em> に変換
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // ### 見出し3 を <h3> に変換
    html = html.replace(/^### (.*?)(<br>|$)/gm, '<h3 class="font-semibold text-lg mb-2 mt-4">$1</h3>');
    
    // ## 見出し2 を <h2> に変換
    html = html.replace(/^## (.*?)(<br>|$)/gm, '<h2 class="font-bold text-xl mb-3 mt-5">$1</h2>');
    
    // # 見出し1 を <h1> に変換
    html = html.replace(/^# (.*?)(<br>|$)/gm, '<h1 class="font-bold text-2xl mb-4 mt-6">$1</h1>');
    
    // - リスト項目 を <li> に変換
    html = html.replace(/^- (.*?)(<br>|$)/gm, '<li class="ml-4 mb-1">• $1</li>');
    
    // 【】で囲まれた部分を強調
    html = html.replace(/【(.*?)】/g, '<span class="font-semibold text-blue-600">【$1】</span>');
    
    return html;
  };

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
