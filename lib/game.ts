export type Category = { name: string; words: string[] };

export type GameSetup = {
  categoryName: string;
  players: number;
  imposters: number;
  // If true, imposters see only "IMPOSTER". If false, they see an alternate word.
  imposterSeesImposterOnly: boolean;
};

export type PlayerRole = "NORMAL" | "IMPOSTER";

export type GameState = {
  setup: GameSetup;
  playersOrder: number[]; // player numbers 1..N, shuffled
  rolesByPlayer: Record<number, PlayerRole>;
  secretWord: string;
  imposterWord: string | null;
};

export function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export function sample<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickUniqueWords(words: string[]) {
  if (words.length === 0) return { secret: "", imposter: "" };
  if (words.length === 1) return { secret: words[0], imposter: words[0] };
  const secret = sample(words);
  let imposter = sample(words);
  while (imposter === secret) imposter = sample(words);
  return { secret, imposter };
}

export function buildGameState(
  setup: GameSetup,
  category: Category,
): GameState {
  const players = setup.players;
  const imposters = setup.imposters;

  const playerNumbers = Array.from({ length: players }, (_, i) => i + 1);
  const playersOrder = shuffle(playerNumbers);

  const imposterSet = new Set<number>(playersOrder.slice(0, imposters));
  const rolesByPlayer: Record<number, PlayerRole> = {};
  for (const p of playerNumbers) {
    rolesByPlayer[p] = imposterSet.has(p) ? "IMPOSTER" : "NORMAL";
  }

  const { secret, imposter } = pickUniqueWords(category.words);
  const imposterWord = setup.imposterSeesImposterOnly ? null : imposter;

  return {
    setup,
    playersOrder,
    rolesByPlayer,
    secretWord: secret,
    imposterWord,
  };
}

export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

