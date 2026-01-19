"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { CategorySelect } from "@/components/CategorySelect";
import { PlayerCountSelect } from "@/components/PlayerCountSelect";
import { ImposterCountSelect } from "@/components/ImposterCountSelect";
import { useGame } from "@/components/GameProvider";
import data from "@/data/data.json";

export default function Home() {
  const { state, dispatch } = useGame();
  const [players, setPlayers] = useState(state.setup.players);
  const [imposters, setImposters] = useState(state.setup.imposters);
  const [category, setCategory] = useState(state.setup.categoryName);
  const router = useRouter();

  const categories = useMemo(() => data.categories, []);

  const handleStartGame = () => {
    try {
      dispatch({
        type: "SETUP_UPDATE",
        patch: {
          categoryName: category,
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
    Boolean(category) &&
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
          <div className="p-7 text-left">
            <motion.h1 
              className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-zinc-950 mb-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Who Is the Imposter
            </motion.h1>
            <motion.p 
              className="text-[15px] text-zinc-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              A calm, pass-and-play social deduction game.
            </motion.p>
          </div>
          
          {/* Game Settings */}
          <div className="px-7 pb-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CategorySelect
                categories={categories}
                value={category}
                onChange={setCategory}
              />
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
          <p>Pass the phone • Keep votes private</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
