import type {
  Category,
  GameAction,
  GameSetup,
  GameState,
  PlayerId,
  Role,
  VotingState,
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

function computeWinnerIfAny(
  alive: PlayerId[],
  rolesByPlayer: Record<PlayerId, Role>,
): GameState["result"] {
  const impostersAlive = alive.filter((p) => rolesByPlayer[p] === "IMPOSTER")
    .length;
  const civiliansAlive = alive.length - impostersAlive;

  if (impostersAlive === 0) {
    return { winner: "CIVILIANS", reason: "ALL_IMPOSTERS_ELIMINATED" };
  }
  if (impostersAlive >= civiliansAlive) {
    return { winner: "IMPOSTERS", reason: "IMPOSTERS_EQUAL_OR_OUTNUMBER" };
  }
  return null;
}

function tallyVotes(votes: Record<PlayerId, PlayerId>): Record<PlayerId, number> {
  const counts: Record<PlayerId, number> = {};
  for (const voterStr of Object.keys(votes)) {
    const voter = Number(voterStr) as PlayerId;
    const target = votes[voter];
    counts[target] = (counts[target] ?? 0) + 1;
  }
  return counts;
}

function resolveTopCandidates(counts: Record<PlayerId, number>) {
  const entries = Object.entries(counts).map(([k, v]) => [
    Number(k),
    v,
  ]) as Array<[PlayerId, number]>;
  if (entries.length === 0) return { max: 0, candidates: [] as PlayerId[] };
  const max = Math.max(...entries.map(([, v]) => v));
  const candidates = entries
    .filter(([, v]) => v === max)
    .map(([p]) => p)
    .sort((a, b) => a - b);
  return { max, candidates };
}

function buildVotingState(alive: PlayerId[]): VotingState {
  const voterOrder = [...alive].sort((a, b) => a - b);
  return { voterOrder, voterIndex: 0, votes: {}, tie: null };
}

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
      const revealOrder = shuffleWithRng(playerNumbers, rng);
      const imposterSet = new Set<PlayerId>(
        revealOrder.slice(0, validated.imposters),
      );

      const rolesByPlayer: Record<PlayerId, Role> = {};
      for (const p of playerNumbers) {
        rolesByPlayer[p] = imposterSet.has(p) ? "IMPOSTER" : "CIVILIAN";
      }

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
        phase: done ? "DISCUSSION" : "REVEAL",
      };
    }
    case "DISCUSSION_START_VOTING": {
      if (state.phase !== "DISCUSSION") return state;
      return {
        ...state,
        phase: "VOTING",
        voting: buildVotingState(state.round.alive),
        lastElimination: null,
      };
    }
    case "VOTE_CAST": {
      if (state.phase !== "VOTING" || !state.voting) return state;
      const voting = state.voting;
      const expectedVoter = voting.voterOrder[voting.voterIndex];
      if (action.voter !== expectedVoter) return state;
      if (!state.round.alive.includes(action.target)) return state;
      if (action.target === action.voter) return state;
      return {
        ...state,
        voting: {
          ...voting,
          votes: { ...voting.votes, [action.voter]: action.target },
        },
      };
    }
    case "VOTING_CONFIRM_NEXT": {
      if (state.phase !== "VOTING" || !state.voting) return state;
      const voting = state.voting;
      const currentVoter = voting.voterOrder[voting.voterIndex];
      if (!currentVoter) return state;
      if (!voting.votes[currentVoter]) return state; // must cast before continuing

      const nextIndex = voting.voterIndex + 1;
      const done = nextIndex >= voting.voterOrder.length;
      if (!done) {
        return { ...state, voting: { ...voting, voterIndex: nextIndex } };
      }

      // Resolve vote (with deterministic tie-breaking).
      const counts = tallyVotes(voting.votes);
      const { candidates } = resolveTopCandidates(counts);

      if (candidates.length === 0) return state;

      const isTie = candidates.length > 1;
      if (isTie && !voting.tie) {
        // One revote among tied candidates.
        return {
          ...state,
          voting: {
            voterOrder: voting.voterOrder,
            voterIndex: 0,
            votes: {},
            tie: { candidates, isRevote: true },
          },
          lastElimination: null,
        };
      }

      const eliminated = isTie ? candidates[0] : candidates[0];
      const nextAlive = state.round.alive.filter((p) => p !== eliminated);
      const nextEliminated = [...state.round.eliminated, eliminated];

      const result = computeWinnerIfAny(nextAlive, state.rolesByPlayer);
      return {
        ...state,
        phase: result ? "RESULT" : "DISCUSSION",
        round: { ...state.round, alive: nextAlive, eliminated: nextEliminated },
        voting: null,
        lastElimination: {
          eliminated,
          counts,
          wasTie: isTie,
          wasRevote: Boolean(voting.tie?.isRevote),
        },
        result,
      };
    }
    case "ROUND_CONTINUE": {
      if (state.phase !== "DISCUSSION") return state;
      return {
        ...state,
        round: { ...state.round, number: state.round.number + 1 },
        lastElimination: null,
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

