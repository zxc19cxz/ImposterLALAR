"use client";

import type { GameState } from "@/types/gameEngine";
import { Button } from "./Button";

function titleFor(state: GameState) {
  if (!state.result) return "Game over";
  if (state.result.reason === "TIME_UP") return "Time's up!";
  return state.result.winner === "CIVILIANS" ? "Civilians win" : "Imposters win";
}

function subtitleFor(state: GameState) {
  if (!state.result) return "Thanks for playing.";
  switch (state.result.reason) {
    case "TIME_UP":
      return "The 5-minute round has ended.";
    case "ALL_IMPOSTERS_ELIMINATED":
      return "All imposters have been eliminated.";
    case "IMPOSTERS_EQUAL_OR_OUTNUMBER":
      return "Imposters now equal or outnumber civilians.";
    case "CONFIG_INVALID":
      return "Game configuration was invalid.";
    default:
      return "Thanks for playing.";
  }
}

export function ResultCard({
  state,
  onReset,
}: {
  state: GameState;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-7">
        <div className="mb-6">
          <div className="text-[13px] text-zinc-600 mb-2">Result</div>
          <h2 className="text-[24px] leading-snug font-semibold tracking-[-0.02em] text-zinc-950">
            {titleFor(state)}
          </h2>
          <p className="mt-2 text-[15px] text-zinc-600">{subtitleFor(state)}</p>
        </div>

        <div className="mb-6 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
          <div className="text-[13px] text-zinc-600">Secret word</div>
          <div className="mt-1 text-[16px] font-semibold text-zinc-950">
            {state.secretWord ? state.secretWord.toUpperCase() : "—"}
          </div>
        </div>

        <Button onClick={onReset} className="w-full h-12 rounded-2xl text-[17px]">
          New game
        </Button>
      </div>
    </div>
  );
}

