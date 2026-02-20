"use client";

import { useState, useEffect } from "react";

interface Counter {
  id: number;
  name: string;
  value: number;
}

interface HistoryEntry {
  id: number;
  counterId: number;
  counterName: string;
  delta: number;
  newValue: number;
  timestamp: string;
}

const STORAGE_KEYS = {
  counters: "counter3-counters",
  step: "counter3-step",
  history: "counter3-history",
  nextId: "counter3-nextId",
};

function loadCounters(): Counter[] {
  if (typeof window === "undefined") return [{ id: 1, name: "카운터 1", value: 0 }];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.counters);
    return raw ? JSON.parse(raw) : [{ id: 1, name: "카운터 1", value: 0 }];
  } catch {
    return [{ id: 1, name: "카운터 1", value: 0 }];
  }
}

function loadStep(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.step);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadNextId(): number {
  if (typeof window === "undefined") return 2;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.nextId);
    return raw ? Number(raw) : 2;
  } catch {
    return 2;
  }
}

export default function Counter3() {
  const [counters, setCounters] = useState<Counter[]>([{ id: 1, name: "카운터 1", value: 0 }]);
  const [step, setStep] = useState<number>(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [nextId, setNextId] = useState<number>(2);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 후 localStorage 로드
  useEffect(() => {
    setCounters(loadCounters());
    setStep(loadStep());
    setHistory(loadHistory());
    setNextId(loadNextId());
    setMounted(true);
  }, []);

  // 상태 변경 시 localStorage 저장
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.counters, JSON.stringify(counters));
    localStorage.setItem(STORAGE_KEYS.nextId, String(nextId));
  }, [counters, nextId, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.step, String(step));
  }, [step, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history, mounted]);

  const addHistory = (counter: Counter, delta: number, newValue: number) => {
    const entry: HistoryEntry = {
      id: Date.now(),
      counterId: counter.id,
      counterName: counter.name,
      delta,
      newValue,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 10));
  };

  const increment = (id: number) => {
    setCounters((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, value: c.value + step } : c
      );
      const target = updated.find((c) => c.id === id);
      if (target) addHistory(target, step, target.value);
      return updated;
    });
  };

  const decrement = (id: number) => {
    setCounters((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, value: Math.max(0, c.value - step) } : c
      );
      const original = prev.find((c) => c.id === id);
      const target = updated.find((c) => c.id === id);
      if (original && target) {
        const actualDelta = target.value - original.value;
        if (actualDelta !== 0) addHistory(target, actualDelta, target.value);
      }
      return updated;
    });
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

  const resetAll = () => {
    const defaults: Counter[] = [{ id: 1, name: "카운터 1", value: 0 }];
    setCounters(defaults);
    setStep(1);
    setHistory([]);
    setNextId(2);
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const total = counters.reduce((sum, c) => sum + c.value, 0);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          버튼 클릭 카운터 3
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
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
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
              <div className="flex items-center justify-between gap-2">
                {editingId === counter.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1 px-2 py-1 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors"
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

              <div className="flex items-center justify-between">
                <button
                  onClick={() => decrement(counter.id)}
                  className="px-5 py-2 bg-red-400 text-white font-bold rounded-xl hover:bg-red-500 active:scale-95 transition-all"
                >
                  -{step}
                </button>
                <span className="text-4xl font-extrabold text-indigo-600">
                  {counter.value}
                </span>
                <button
                  onClick={() => increment(counter.id)}
                  className="px-5 py-2 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 active:scale-95 transition-all"
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
            <span className="text-2xl font-extrabold text-indigo-600">{total}</span>
          </span>
          <button
            onClick={addCounter}
            className="px-5 py-2 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 active:scale-95 transition-all text-sm"
          >
            + 카운터 추가
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={resetAll}
            className="flex-1 py-2 bg-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-300 active:scale-95 transition-all text-sm"
          >
            초기화
          </button>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex-1 py-2 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 active:scale-95 transition-all text-sm"
          >
            히스토리 {showHistory ? "▲" : "▼"}
          </button>
        </div>

        {/* 히스토리 패널 */}
        {showHistory && (
          <div className="border border-purple-100 rounded-xl p-4 bg-purple-50 flex flex-col gap-2">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
              최근 클릭 기록 (최대 10개)
            </p>
            {history.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">
                아직 기록이 없습니다
              </p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-400 font-mono text-xs">
                    [{formatTime(entry.timestamp)}]
                  </span>
                  <span className="text-gray-600 flex-1 mx-2 truncate">
                    {entry.counterName}
                  </span>
                  <span
                    className={`font-bold ${
                      entry.delta > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {entry.delta > 0 ? "+" : ""}
                    {entry.delta}
                  </span>
                  <span className="text-gray-500 ml-2">→ {entry.newValue}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 저장 상태 표시 */}
        {mounted && (
          <p className="text-xs text-center text-gray-400">
            자동 저장됨 · 새로고침해도 유지됩니다
          </p>
        )}
      </div>
    </main>
  );
}
