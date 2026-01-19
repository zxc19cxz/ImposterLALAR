export type Category = { name: string; words: string[] };

export type PlayerId = number; // 1..N

export type Role = "CIVILIAN" | "IMPOSTER";

export type Phase = "SETUP" | "REVEAL" | "DISCUSSION" | "VOTING" | "RESULT";

export type GameSetup = {
  /**
   * Multi-select categories. The game will randomly pick one category
   * from this list at start (deterministically via seed).
   */
  categoryNames: string[];
  players: number;
  imposters: number;
  /**
   * If true, imposters see only “IMPOSTER”. If false, they see a different word.
   * (Kept for extensibility; UI can expose later.)
   */
  imposterSeesImposterOnly: boolean;
  /**
   * Optional deterministic seed. When omitted, a seed is generated at start.
   * Useful for debugging and reproducible games.
   */
  seed?: number;
};

export type Round = {
  number: number;
  alive: PlayerId[];
  eliminated: PlayerId[]; // in order
};

export type VotingState = {
  /**
   * Voters cast privately, in this order.
   * Typically: alive players in ascending numeric order.
   */
  voterOrder: PlayerId[];
  voterIndex: number; // 0..voterOrder.length
  /**
   * votes[voter] = target
   */
  votes: Record<PlayerId, PlayerId>;
  /**
   * When a tie occurs, we do exactly one revote among tied candidates.
   * If the revote is still tied, we deterministically eliminate the lowest player id.
   */
  tie: null | {
    candidates: PlayerId[];
    isRevote: boolean;
  };
};

export type Result = {
  winner: "CIVILIANS" | "IMPOSTERS";
  reason:
    | "ALL_IMPOSTERS_ELIMINATED"
    | "IMPOSTERS_EQUAL_OR_OUTNUMBER"
    | "CONFIG_INVALID";
};

export type GameState = {
  phase: Phase;
  setup: GameSetup;
  /**
   * The category chosen for this game at start (from setup.categoryNames).
   */
  categoryName: string;

  // Deterministic RNG for fairness + reproducibility
  seed: number;

  // Static at start
  secretWord: string;
  imposterWord: string | null;
  rolesByPlayer: Record<PlayerId, Role>;

  // Reveal flow
  revealOrder: PlayerId[];
  revealIndex: number; // 0..revealOrder.length

  // Rounds
  round: Round;
  voting: VotingState | null;
  lastElimination: null | {
    eliminated: PlayerId;
    counts: Record<PlayerId, number>;
    wasTie: boolean;
    wasRevote: boolean;
  };

  result: Result | null;
};

export type GameAction =
  | { type: "SETUP_UPDATE"; patch: Partial<GameSetup> }
  | { type: "GAME_START"; categories: Category[] }
  | { type: "REVEAL_NEXT" }
  | { type: "DISCUSSION_START_VOTING" }
  | { type: "VOTE_CAST"; voter: PlayerId; target: PlayerId }
  | { type: "VOTING_CONFIRM_NEXT" }
  | { type: "ROUND_CONTINUE" }
  | { type: "GAME_RESET" };

export type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

