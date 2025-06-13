"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

type ScoreEntry = {
  date: string;
  score: number;
};

export default function Home() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("scores");
    if (stored) {
      const parsed = JSON.parse(stored) as ScoreEntry[];
      const recent = parsed.slice(-7).reverse();
      setScores(recent);
    }
  }, []);

  const filteredScores = scores.filter(
    (entry) => entry.score !== undefined && entry.score !== null
  );

  return (
    <AuthGuard>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">さいきんの てんすう</h1>
        <ul className="mb-4">
          {filteredScores.length === 0 ? (
            <li className="text-gray-500">きろくが ない</li>
          ) : (
            filteredScores.map((entry, i) => (
              <li key={i} className="mb-1">
                <span className="font-medium">{entry.date}</span>: {entry.score}
                点
              </li>
            ))
          )}
        </ul>
        <Link
          href="/test"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-lg"
        >
          はじめる
        </Link>
      </div>
    </AuthGuard>
  );
}
