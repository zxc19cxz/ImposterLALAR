"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { PlayerCountSelect } from "@/components/PlayerCountSelect";
import { ImposterCountSelect } from "@/components/ImposterCountSelect";
import { useGame } from "@/components/GameProvider";
import { useCategories } from "@/components/useCategories";

const SELECTED_KEY = "imposter:selectedCategories";

function readSelected(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SELECTED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const { state, dispatch } = useGame();
  const { categories } = useCategories();
  const [players, setPlayers] = useState(state.setup.players);
  const [imposters, setImposters] = useState(state.setup.imposters);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    state.setup.categoryNames.length ? state.setup.categoryNames : [],
  );
  const router = useRouter();

  useEffect(() => {
    // Prefer persisted selection; otherwise default to first category.
    const persisted = readSelected();
    if (persisted.length) {
      setSelectedCategories(persisted);
      return;
    }
    if (selectedCategories.length === 0 && categories.length > 0) {
      setSelectedCategories([categories[0].name]);
    }
  }, [categories, selectedCategories.length]);

  const handleStartGame = () => {
    try {
      dispatch({
        type: "SETUP_UPDATE",
        patch: {
          categoryNames: selectedCategories,
          players,
          imposters,
        },
      });
      dispatch({ type: "GAME_START", categories });
      router.push("/game");
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const isFormValid =
    selectedCategories.length > 0 &&
    players >= 3 &&
    imposters >= 1 &&
    imposters < players &&
    imposters <= 3;

  return (
    <div className="min-h-screen bg-[rgb(242,242,247)] flex items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Header */}
          <div className="p-7 text-left space-y-1">
            <motion.h1 
              className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-zinc-950 mb-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Imposter хэн юм бэ пизда
            </motion.h1>
            <motion.p 
              className="text-[15px] text-zinc-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
            </motion.p>
          </div>
          
          {/* Game Settings */}
          <div className="px-7 pb-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
                  Categories
                </div>
                <div className="text-[13px] text-zinc-500">
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/categories")}
                className="w-full h-12 rounded-2xl bg-white ring-1 ring-zinc-200 px-4 text-left hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[15px] font-semibold text-zinc-950">
                    Choose categories
                  </div>
                  <div className="text-[15px] text-zinc-400">›</div>
                </div>
              </button>
              <div className="mt-2 text-[12px] text-zinc-500">
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PlayerCountSelect
                value={players}
                onChange={(value) => {
                  setPlayers(value);
                  if (value <= imposters) {
                    setImposters(Math.max(1, value - 1));
                  }
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ImposterCountSelect
                players={players}
                value={imposters}
                onChange={setImposters}
                max={Math.min(3, players - 1)}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <Button
                onClick={handleStartGame}
                disabled={!isFormValid}
                className="w-full h-12 rounded-2xl text-[17px] font-semibold"
              >
                Start
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Footer */}
        <motion.div 
          className="text-center mt-5 text-[13px] text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
        </motion.div>
      </motion.div>
    </div>
  );
}
