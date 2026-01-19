export interface GameState {
  category: string;
  players: number;
  imposters: number;
  currentPlayer: number;
  word: string;
  playerRoles: ('imposter' | 'normal')[];
  gameStarted: boolean;
  gameEnded: boolean;
}

export interface Category {
  name: string;
  words: string[];
}

export interface GameData {
  categories: Category[];
}

export type GameAction =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_PLAYERS'; payload: number }
  | { type: 'SET_IMPOSTERS'; payload: number }
  | { type: 'NEXT_PLAYER' }
  | { type: 'START_GAME'; payload?: Partial<GameState> }
  | { type: 'RESET_GAME' };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: () => void;
  nextPlayer: () => void;
  resetGame: () => void;
}