"use client";

import { useState } from "react";
import { Button } from "./Button";
import { getRevealPlayer } from "@/lib/engine/gameEngine";
import type { GameState, PlayerId } from "@/types/gameEngine";

type RevealCardProps = {
  state: GameState;
  onNext: () => void;
};

export function RevealCard({ state, onNext }: RevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const player = getRevealPlayer(state) as PlayerId | null;
  const isImposter = player ? state.rolesByPlayer[player] === "IMPOSTER" : false;
  const isLastPlayer = state.revealIndex + 1 >= state.revealOrder.length;
  const buttonText = isLastPlayer ? "Done" : "Next Player";

  const handleCardClick = () => {
    setIsRevealed(!isRevealed);
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(false);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div 
        className="w-full bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-7 text-center cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="mb-6">
          <p className="text-zinc-600 mb-2 text-[13px]">
            Player {player ?? "—"} • Reveal {state.revealIndex + 1} of {state.revealOrder.length}
          </p>
          <h2 className="text-[22px] leading-snug font-semibold tracking-[-0.01em] mb-6 text-zinc-950">
            Keep this private
          </h2>
          
          <div 
            className={`py-8 px-4 rounded-2xl mb-6 min-h-[180px] flex items-center justify-center transition-colors ${
              isRevealed 
                ? isImposter 
                  ? "bg-red-50 text-red-800"
                  : "bg-[rgba(52,199,89,0.12)] text-[rgba(0,110,46,1)]"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            <p className="text-[34px] leading-none font-semibold tracking-[-0.02em]">
              {isRevealed 
                ? isImposter 
                  ? "IMPOSTER" 
                  : (state.secretWord || "No word").toUpperCase()
                : "TAP TO REVEAL"
              }
            </p>
          </div>

          {isRevealed ? (
            <p className="text-zinc-600 mb-6 text-[13px]">
              When you’re done, tap the button and pass the phone to the next player.
            </p>
          ) : null}
        </div>

        {isRevealed && (
          <Button
            onClick={handleNextClick}
            variant={isLastPlayer ? "secondary" : "primary"}
            className="w-full"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
