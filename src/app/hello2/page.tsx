"use client";

import { useState } from "react";

export default function Hello2() {
  const [name, setName] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");

  const handleGreet = () => {
    setGreeting(name.trim() || "World");
  };

  const handleReset = () => {
    setName("");
    setGreeting("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-700">헬로월드2</h1>

        {greeting ? (
          <p className="text-4xl font-extrabold text-purple-600 text-center">
            Hello, {greeting}!
          </p>
        ) : (
          <p className="text-4xl font-extrabold text-gray-300 text-center">
            Hello, World!
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGreet()}
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-3">
            <button
              onClick={handleGreet}
              className="flex-1 px-6 py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 active:scale-95 transition-all"
            >
              인사하기
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 active:scale-95 transition-all"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
