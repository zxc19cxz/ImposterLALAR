"use client";

import React, { createContext, useContext, useReducer } from "react";
import type { GameContextValue } from "@/types/gameEngine";
import { engineReducer, initialEngineState } from "@/lib/engine/gameEngine";

export const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(engineReducer, initialEngineState);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
