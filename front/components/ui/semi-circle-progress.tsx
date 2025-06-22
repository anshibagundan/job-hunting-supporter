import React from 'react';

interface SemiCircleProgressProps {
  value: number; // 0-100
  size?: number; // 円の直径
  strokeWidth?: number; // 線の太さ
  className?: string;
}

export function SemiCircleProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className = ""
}: SemiCircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // 半円なので円周の半分
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // 達成度に基づく色の決定
  const getColor = (achievement: number) => {
    if (achievement >= 80) return "#22c55e"; // green-500
    if (achievement >= 60) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const color = getColor(value);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size / 2 + 20 }}>
      <svg
        width={size}
        height={size / 2 + 20}
        className="transform -rotate-0"
      >
        {/* 背景の半円 */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* プログレスの半円 */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* 中央のパーセント表示 */}
      <div className="absolute inset-0 flex items-end justify-center pb-2">
        <span className="text-2xl font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  );
}
