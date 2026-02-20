"use client";

import { useState } from "react";

interface Counter {
  id: number;
  name: string;
  value: number;
}

export default function Counter2() {
  const [counters, setCounters] = useState<Counter[]>([
    { id: 1, name: "카운터 1", value: 0 },
  ]);
  const [step, setStep] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [nextId, setNextId] = useState<number>(2);

  const total = counters.reduce((sum, c) => sum + c.value, 0);

  const increment = (id: number) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: c.value + step } : c))
    );
  };

  const decrement = (id: number) => {
    setCounters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, value: Math.max(0, c.value - step) } : c
      )
    );
  };

  const addCounter = () => {
    setCounters((prev) => [
      ...prev,
      { id: nextId, name: `카운터 ${nextId}`, value: 0 },
    ]);
    setNextId((prev) => prev + 1);
  };

  const removeCounter = (id: number) => {
    if (counters.length <= 1) return;
    setCounters((prev) => prev.filter((c) => c.id !== id));
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    setCounters((prev) =>
      prev.map((c) =>
        c.id === editingId ? { ...c, name: editingName.trim() || c.name } : c
      )
    );
    setEditingId(null);
    setEditingName("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          버튼 클릭 카운터 2
        </h1>

        {/* 증감 단위 */}
        <div className="flex items-center gap-3 justify-center">
          <span className="text-sm text-gray-500 font-medium">증감 단위:</span>
          {[1, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                step === s
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s > 0 ? "+" : ""}{s}
            </button>
          ))}
        </div>

        {/* 카운터 목록 */}
        <div className="flex flex-col gap-3">
          {counters.map((counter) => (
            <div
              key={counter.id}
              className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50"
            >
              {/* 카운터 헤더 */}
              <div className="flex items-center justify-between gap-2">
                {editingId === counter.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1 px-2 py-1 border border-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 font-semibold text-gray-700 cursor-pointer hover:text-teal-600 transition-colors"
                    onClick={() => startEdit(counter.id, counter.name)}
                    title="클릭하여 이름 수정"
                  >
                    {counter.name}
                  </span>
                )}
                <button
                  onClick={() => removeCounter(counter.id)}
                  disabled={counters.length <= 1}
                  className="text-gray-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              {/* 값 및 버튼 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => decrement(counter.id)}
                  className="px-5 py-2 bg-red-400 text-white font-bold rounded-xl hover:bg-red-500 active:scale-95 transition-all"
                >
                  -{step}
                </button>
                <span className="text-4xl font-extrabold text-green-600">
                  {counter.value}
                </span>
                <button
                  onClick={() => increment(counter.id)}
                  className="px-5 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 active:scale-95 transition-all"
                >
                  +{step}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 합계 및 추가 버튼 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-gray-600 font-medium">
            합계:{" "}
            <span className="text-2xl font-extrabold text-teal-600">{total}</span>
          </span>
          <button
            onClick={addCounter}
            className="px-5 py-2 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 active:scale-95 transition-all text-sm"
          >
            + 카운터 추가
          </button>
        </div>
      </div>
    </main>
  );
}
