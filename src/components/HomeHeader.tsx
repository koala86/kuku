'use client';

import { useEffect, useState } from 'react';

// ScoreEntry型を定義（QuestionCard.tsxでの定義と合わせる）
type ScoreEntry = {
  date: string; // new Date().toLocaleString() によって保存された日付文字列
  score: number;
  elapsedTime?: string; // 過去データとの互換性のためオプショナル
};

export default function HomeHeader() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [lastElapsedTime, setLastElapsedTime] = useState<string | null>(null);

  useEffect(() => {
    const rawScores = localStorage.getItem('scores');
    if (rawScores) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedScores: ScoreEntry[] = JSON.parse(rawScores);
        if (Array.isArray(parsedScores)) {
          setScores(parsedScores);
        } else {
          setScores([]);
        }
      } catch (error) {
        console.error("Failed to parse scores from localStorage:", error);
        setScores([]);
      }
    }

    const rawTime = localStorage.getItem('elapsedTime');
    if (rawTime) {
      setLastElapsedTime(rawTime);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">かけざん テスト</h1>
      {lastElapsedTime && (
        <p className="mt-1 text-sm text-gray-600">
          さいごのテストの けいかじかん: {lastElapsedTime}秒
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500">さいきん 7かの てんすう:</p>
      <ul className="mb-4">
        {scores.slice(-7).map((entry, i) => (
          <li key={i}>Recent Test {i + 1}: {entry.score}点</li>
        ))}
      </ul>
      <a href="#" className="text-blue-500 text-sm">もっと</a>
    </div>
  );
}
