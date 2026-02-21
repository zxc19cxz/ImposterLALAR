'use client';

import { useGame } from '@/components/GameProvider';
import { RevealCard } from '@/components/RevealCard';
import { ResultCard } from '@/components/ResultCard';
import { TimerCard } from '@/components/TimerCard';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export default function GamePage() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (state.phase === "SETUP") {
      router.push('/');
    }
  }, [state.phase, router]);

  const handleReset = useCallback(() => {
    dispatch({ type: "GAME_RESET" });
    router.push("/");
  }, [dispatch, router]);

  const handleTimerEnd = useCallback(() => {
    dispatch({ type: "TIMER_END" });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[rgb(242,242,247)]">
      <main className="container mx-auto px-4 py-8">
        {state.phase === "REVEAL" && (
          <RevealCard
            state={state}
            onNext={() => dispatch({ type: "REVEAL_NEXT" })}
          />
        )}
        {state.phase === "TIMER" && (
          <TimerCard onTimerEnd={handleTimerEnd} />
        )}
        {state.phase === "RESULT" && (
          <ResultCard state={state} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}