"use client";

import type { GameState } from "@/types/gameEngine";
import { Button } from "./Button";

export function DiscussionCard({
  state,
  onStartVoting,
}: {
  state: GameState;
  onStartVoting: () => void;
}) {
  const aliveCount = state.round.alive.length;
  const eliminatedCount = state.round.eliminated.length;

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-7">
        <div className="mb-6">
          <div className="text-[13px] text-zinc-600 mb-2">
            Round {state.round.number} • {aliveCount} alive • {eliminatedCount} out
          </div>
          <h2 className="text-[22px] leading-snug font-semibold tracking-[-0.01em] text-zinc-950">
            Discuss
          </h2>
          <p className="mt-2 text-[15px] text-zinc-600">
            Ask questions and look for inconsistencies. When you’re ready, start a private vote.
          </p>
        </div>

        {state.lastElimination ? (
          <div className="mb-6 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
            <div className="text-[13px] text-zinc-600">Last vote</div>
            <div className="mt-1 text-[15px] font-semibold text-zinc-950">
              Player {state.lastElimination.eliminated} was eliminated
            </div>
            <div className="mt-1 text-[13px] text-zinc-600">
              Tie-break: {state.lastElimination.wasTie ? "yes" : "no"}
              {state.lastElimination.wasRevote ? " (revote used)" : ""}
            </div>
          </div>
        ) : null}

        <Button onClick={onStartVoting} className="w-full h-12 rounded-2xl text-[17px]">
          Start voting
        </Button>
      </div>
    </div>
  );
}

