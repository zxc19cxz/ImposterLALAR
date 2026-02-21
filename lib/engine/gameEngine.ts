import type {
  Category,
  GameAction,
  GameSetup,
  GameState,
  PlayerId,
  Role,
} from "@/types/gameEngine";
import { mulberry32, nextSeed, sampleWithRng, shuffleWithRng } from "./random";

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function buildDefaultSetup(): GameSetup {
  return {
    categoryNames: [],
    players: 5,
    imposters: 1,
    imposterSeesImposterOnly: true,
  };
}

export const initialEngineState: GameState = {
  phase: "SETUP",
  setup: buildDefaultSetup(),
  categoryName: "",
  seed: 0,
  secretWord: "",
  imposterWord: null,
  rolesByPlayer: {},
  revealOrder: [],
  revealIndex: 0,
  round: { number: 1, alive: [], eliminated: [] },
  voting: null,
  lastElimination: null,
  result: null,
};

function validateSetup(setup: GameSetup, categories: Category[]) {
  const selected = (setup.categoryNames ?? []).filter(Boolean);
  if (selected.length === 0) return { ok: false as const, reason: "CATEGORY_NOT_FOUND" };
  const selectedCategories = categories.filter((c) => selected.includes(c.name));
  if (selectedCategories.length === 0)
    return { ok: false as const, reason: "CATEGORY_NOT_FOUND" };
  const players = clampInt(setup.players, 3, 12);
  const imposters = clampInt(setup.imposters, 1, 3);
  if (imposters >= players) return { ok: false as const, reason: "BAD_COUNTS" };
  // Ensure at least one selected category has words.
  if (!selectedCategories.some((c) => c.words?.length))
    return { ok: false as const, reason: "NO_WORDS" };
  return { ok: true as const, selectedCategories, players, imposters };
}

function pickUniqueWords(words: string[], rng: () => number) {
  if (words.length === 1) return { secret: words[0], imposter: words[0] };
  const secret = sampleWithRng(words, rng);
  let imposter = sampleWithRng(words, rng);
  while (imposter === secret) imposter = sampleWithRng(words, rng);
  return { secret, imposter };
}

export function engineReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SETUP_UPDATE": {
      const nextSetup = { ...state.setup, ...action.patch };
      return { ...state, setup: nextSetup };
    }
    case "GAME_START": {
      const setup = state.setup;
      const validated = validateSetup(setup, action.categories);
      if (!validated.ok) {
        return {
          ...state,
          phase: "RESULT",
          result: { winner: "CIVILIANS", reason: "CONFIG_INVALID" },
        };
      }

      const seed = (setup.seed ?? nextSeed()) >>> 0;
      const rng = mulberry32(seed);

      // Pick a category from the selected set (deterministically via seed).
      const chosenCategory = sampleWithRng(validated.selectedCategories, rng);

      const playerNumbers: PlayerId[] = Array.from(
        { length: validated.players },
        (_, i) => (i + 1) as PlayerId,
      );
      // Shuffle player numbers for reveal order
      const revealOrder = shuffleWithRng(playerNumbers, rng);
      
      // Select imposters via Fisher-Yates shuffle for uniform, deterministic selection
      const shuffledPlayers = shuffleWithRng([...playerNumbers], rng);
      const imposterSet = new Set<PlayerId>(
        shuffledPlayers.slice(0, validated.imposters)
      );

      // Assign roles to all players
      const rolesByPlayer = Object.fromEntries(
        playerNumbers.map(p => [p, imposterSet.has(p) ? "IMPOSTER" : "CIVILIAN"])
      ) as Record<PlayerId, Role>;

      const { secret, imposter } = pickUniqueWords(chosenCategory.words, rng);
      const imposterWord = setup.imposterSeesImposterOnly ? null : imposter;

      return {
        ...state,
        phase: "REVEAL",
        categoryName: chosenCategory.name,
        seed,
        secretWord: secret,
        imposterWord,
        rolesByPlayer,
        revealOrder,
        revealIndex: 0,
        round: { number: 1, alive: playerNumbers, eliminated: [] },
        voting: null,
        lastElimination: null,
        result: null,
        setup: {
          ...setup,
          players: validated.players,
          imposters: validated.imposters,
        },
      };
    }
    case "REVEAL_NEXT": {
      if (state.phase !== "REVEAL") return state;
      const nextIndex = clampInt(state.revealIndex + 1, 0, state.revealOrder.length);
      const done = nextIndex >= state.revealOrder.length;
      return {
        ...state,
        revealIndex: nextIndex,
        phase: done ? "TIMER" : "REVEAL",
      };
    }
    case "TIMER_END": {
      if (state.phase !== "TIMER") return state;
      return {
        ...state,
        phase: "RESULT",
        result: { winner: "CIVILIANS", reason: "TIME_UP" },
      };
    }
    case "GAME_RESET": {
      return {
        ...initialEngineState,
        setup: {
          ...buildDefaultSetup(),
          // keep last used values for convenience
          categoryNames: state.setup.categoryNames,
          players: state.setup.players,
          imposters: state.setup.imposters,
          imposterSeesImposterOnly: state.setup.imposterSeesImposterOnly,
        },
      };
    }
    default:
      return state;
  }
}

export function getRevealPlayer(state: GameState): PlayerId | null {
  if (state.phase !== "REVEAL") return null;
  return state.revealOrder[state.revealIndex] ?? null;
}

