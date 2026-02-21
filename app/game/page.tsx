'use client';

import { useGame } from '@/components/GameProvider';
import { DiscussionCard } from '@/components/DiscussionCard';
import { RevealCard } from '@/components/RevealCard';
import { ResultCard } from '@/components/ResultCard';
import { VoteCard } from '@/components/VoteCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GamePage() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (state.phase === "SETUP") {
      router.push('/');
    }
  }, [state.phase, router]);

  const handleReset = () => {
    dispatch({ type: "GAME_RESET" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[rgb(242,242,247)]">
      <main className="container mx-auto px-4 py-8">
        {state.phase === "REVEAL" && (
          <RevealCard
            state={state}
            onNext={() => dispatch({ type: "REVEAL_NEXT" })}
          />
        )}
        {state.phase === "DISCUSSION" && (
          <DiscussionCard
            state={state}
            onStartVoting={() => dispatch({ type: "DISCUSSION_START_VOTING" })}
          />
        )}
        {state.phase === "VOTING" && state.voting && (
          <VoteCard
            state={state}
            onCastVote={(voter, target) =>
              dispatch({ type: "VOTE_CAST", voter, target })
            }
            onConfirmNext={() => dispatch({ type: "VOTING_CONFIRM_NEXT" })}
          />
        )}
        {state.phase === "RESULT" && (
          <ResultCard state={state} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}