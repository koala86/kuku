"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const validCodes = ["0302", "1234"];

export default function LoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (validCodes.includes(code.trim())) {
      localStorage.setItem("auth", "true");
      router.push("/");
    } else {
      setError("認証コードが間違っている。");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">ログイン</h1>
        <input
          type="password"
          placeholder="認証コードを入力してください"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown} // enter key
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />
        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          ログイン
        </button>
      </div>
    </div>
  );
}
