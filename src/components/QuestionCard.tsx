"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  a: number;
  b: number;
  answer: number;
};

type ScoreEntry = {
  date: string; // new Date().toLocaleString() によって保存された日付文字列
  score: number;
  elapsedTime: string; // 例: "20.5" (秒)
};

function generateQuestions(): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    questions.push({ a, b, answer: a * b });
  }
  return questions;
}

export default function QuestionCard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [displayTime, setDisplayTime] = useState<string>("0.0");
  const [startTime, setStartTime] = useState<number | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestions(generateQuestions());
    setStartTime(Date.now()); // テスト開始時刻を記録
  }, []);

  useEffect(() => {
    inputRef.current?.focus(); // input에 자동 포커스
  }, [current]);

  useEffect(() => {
    if (!startTime) return;

    const intervalId = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      setDisplayTime(elapsedSeconds.toFixed(1));
    }, 100); // 100ミリ秒ごとに更新して滑らかに見せる

    // クリーンアップ関数
    return () => {
      clearInterval(intervalId);
    };
  }, [startTime]);

  if (questions.length === 0)
    return <div className="p-4 text-center">ロウディング中...</div>;

  const handleNext = () => {
    const userAns = parseInt(input);
    const isCorrect = userAns === questions[current].answer;

    setUserAnswers((prev) => [...prev, userAns]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (current === 9) {
      const finalScore = [...userAnswers, userAns].reduce(
        (acc, ans, idx) => acc + (ans === questions[idx].answer ? 10 : 0),
        0
      );

      // 経過時間を計算してlocalStorageに保存
      if (startTime) {
        const endTime = Date.now();
        const durationSeconds = (endTime - startTime) / 1000;
        const elapsedTimeValue = durationSeconds.toFixed(1);
        localStorage.setItem("elapsedTime", elapsedTimeValue); // 直近の時間を個別に保存 (result/page.tsx, HomeHeader.tsx 用)

        // ScoreEntry にも elapsedTime を含める
        const storedScores = localStorage.getItem("scores");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const prevScores: ScoreEntry[] = storedScores
          ? JSON.parse(storedScores)
          : [];
        const newEntry: ScoreEntry = {
          date: new Date().toLocaleString(),
          score: finalScore,
          elapsedTime: elapsedTimeValue,
        };
        localStorage.setItem("scores", JSON.stringify([...prevScores, newEntry]));
      }

      localStorage.setItem(
        "scoreDetail",
        JSON.stringify({ questions, userAnswers: [...userAnswers, userAns] })
      );

      router.push("/result");
    } else {
      setCurrent(current + 1);
      setInput("");
    }
  };

  const currentQ = questions[current];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">
        もんだい {current + 1}/10
      </h1>
      {/* <p className="text-lg text-center text-gray-600 mb-4">
        けいかじかん: {displayTime}秒
      </p> */}
      <p className="text-xl text-center mb-6">
        {currentQ.a} × {currentQ.b} = ?
      </p>
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        // pattern="[0-9]*"
        className="border p-3 w-full text-center text-xl rounded-md mb-24"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown} // enter key
        placeholder="正解は"
      />
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg"
          onClick={handleNext}
          disabled={input.trim() === ""}
        >
          {current === 9 ? "けっかみる" : "つぎへ"}
        </button>
      </div>
    </div>
  );
}
