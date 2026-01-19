'use client';

import { useGame } from '@/components/GameProvider';
import { RevealCard } from '@/components/RevealCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GamePage() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  // Handle navigation in a useEffect
  useEffect(() => {
    if (state.phase === "SETUP") {
      router.push('/');
    }
  }, [state.phase, router]);

  return (
    <div className="min-h-screen bg-[rgb(242,242,247)]">
      <main className="container mx-auto px-4 py-8">
        {state.phase === "REVEAL" ? (
          <RevealCard
            state={state}
            onNext={() => {
              const isFinal = state.revealIndex + 1 >= state.revealOrder.length;
              dispatch({ type: "REVEAL_NEXT" });
              if (isFinal) {
                dispatch({ type: "GAME_RESET" });
                router.push("/");
              }
            }}
          />
        ) : null}
      </main>
    </div>
  );
}