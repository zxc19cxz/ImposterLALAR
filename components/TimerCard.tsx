"use client";

import { useEffect, useState } from "react";

const TIMER_SECONDS = 5 * 60; // 5 minutes

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TimerCard({ onTimerEnd }: { onTimerEnd: () => void }) {
  const [remaining, setRemaining] = useState(TIMER_SECONDS);

  useEffect(() => {
    if (remaining <= 0) {
      onTimerEnd();
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, onTimerEnd]);

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-7">
        <div className="mb-6 text-center">
          <div className="text-[13px] text-zinc-600 mb-2">5 minute round</div>
          <h2 className="text-[22px] leading-snug font-semibold tracking-[-0.01em] text-zinc-950">
            Time remaining
          </h2>
          <p
            className={`mt-4 text-[48px] font-mono font-bold tracking-tight ${
              remaining <= 30 ? "text-red-600" : "text-zinc-950"
            }`}
          >
            {formatTime(remaining)}
          </p>
        </div>
      </div>
    </div>
  );
}
