"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

type Question = { a: number; b: number; answer: number };

export default function ResultPage() {
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<
    { q: Question; user: number }[]
  >([]);
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const detailRaw = localStorage.getItem("scoreDetail");
    if (detailRaw) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const detail = JSON.parse(detailRaw);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { questions, userAnswers } = detail as {
        questions: Question[];
        userAnswers: number[];
      };
      const incorrects = questions
        .map((q, i) => ({ q, user: userAnswers[i] }))
        .filter((item) => item.q.answer !== item.user);
      setWrongAnswers(incorrects);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const scoreVal = questions.reduce(
        (acc, q, i) => acc + (userAnswers[i] === q.answer ? 10 : 0),
        0
      );
      setScore(scoreVal);
    }

    const timeRaw = localStorage.getItem("elapsedTime");
    if (timeRaw) {
      setElapsedTime(timeRaw);
    }
  }, []);

  return (
    <AuthGuard>
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-6">けっか</h1>
        <p className="text-2xl text-center text-green-600 font-semibold mb-2">
          てんすう: {score}点
        </p>
        {elapsedTime && (
          <p className="text-xl text-center text-gray-700 mb-6">
            けいかじかん: {elapsedTime}秒
          </p>
        )}

        {wrongAnswers.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-2 text-red-500">
              まちがった もんだい
            </h2>
            <ul className="space-y-2">
              {wrongAnswers.map((item, idx) => (
                <li key={idx} className="bg-red-100 p-3 rounded-lg">
                  <p className="text-base">
                    {item.q.a} × {item.q.b} ={" "}
                    <span className="line-through">{item.user}</span> →{" "}
                    <span className="text-red-600 font-bold">
                      {item.q.answer}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="mt-8 bg-blue-500 text-white p-3 rounded-lg w-full text-lg"
          onClick={() => router.push("/home")}
        >
          ホームに戻る
        </button>
      </div>
    </AuthGuard>
  );
}
