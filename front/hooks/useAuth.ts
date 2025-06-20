import { useState, useEffect } from 'react';

// 仮のユーザー情報取得フック（実際の認証実装に置き換えてください）
export function useAuth() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際の認証ロジックをここに実装
    // 現在はデフォルトユーザーを設定
    setTimeout(() => {
      setUser({ id: '1', name: 'Default User' });
      setIsLoading(false);
    }, 100);
  }, []);

  return { user, isLoading };
}
