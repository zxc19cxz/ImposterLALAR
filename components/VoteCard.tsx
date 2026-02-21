"use client";

import { useEffect, useMemo, useState } from "react";
import type { GameState, PlayerId } from "@/types/gameEngine";
import { Button } from "./Button";

export function VoteCard({
  state,
  onCastVote,
  onConfirmNext,
}: {
  state: GameState;
  onCastVote: (voter: PlayerId, target: PlayerId) => void;
  onConfirmNext: () => void;
}) {
  const voting = state.voting;
  const voter = voting?.voterOrder[voting.voterIndex] as PlayerId | undefined;
  const [selected, setSelected] = useState<PlayerId | null>(null);

  // Reset selection when the current voter changes
  useEffect(() => {
    setSelected(null);
  }, [voter, voting?.tie?.isRevote]);

  const candidates = useMemo(() => {
    const alive = state.round.alive.slice().sort((a, b) => a - b);
    const tieCandidates = voting?.tie?.candidates ?? null;
    const pool = tieCandidates ? alive.filter((p) => tieCandidates.includes(p)) : alive;
    return voter ? pool.filter((p) => p !== voter) : pool;
  }, [state.round.alive, voter, voting?.tie?.candidates]);

  if (!voting || !voter) return null;

  const alreadyVoted = Boolean(voting.votes[voter]);
  const isRevote = Boolean(voting.tie?.isRevote);

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-7">
        <div className="mb-5">
          <div className="text-[13px] text-zinc-600 mb-2">
            Private vote • Player {voter} • {voting.voterIndex + 1} of {voting.voterOrder.length}
          </div>
          <h2 className="text-[22px] leading-snug font-semibold tracking-[-0.01em] text-zinc-950">
            Who is the imposter?
          </h2>
          <p className="mt-2 text-[13px] text-zinc-600">
            Select one player. Keep this private.
            {isRevote ? " (Revote: only tied players)" : ""}
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {candidates.map((p) => {
            const active = selected === p || voting.votes[voter] === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelected(p)}
                className={[
                  "w-full h-12 rounded-2xl px-4 text-left",
                  "ring-1 transition-colors",
                  active
                    ? "bg-zinc-900 text-white ring-zinc-900"
                    : "bg-white text-zinc-900 ring-zinc-200 hover:bg-zinc-50",
                ].join(" ")}
              >
                <span className="text-[15px] font-semibold">Player {p}</span>
              </button>
            );
          })}
        </div>

        {!alreadyVoted ? (
          <Button
            onClick={() => {
              if (!selected) return;
              onCastVote(voter, selected);
            }}
            disabled={!selected}
            className="w-full h-12 rounded-2xl text-[17px]"
          >
            Submit vote
          </Button>
        ) : (
          <Button
            onClick={onConfirmNext}
            variant="secondary"
            className="w-full h-12 rounded-2xl text-[17px]"
          >
            Next voter
          </Button>
        )}
      </div>
    </div>
  );
}

