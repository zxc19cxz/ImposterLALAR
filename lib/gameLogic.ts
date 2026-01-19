import { GameState, GameAction } from '@/types/game';
import { getRandomItem, shuffleArray } from './shuffle';

export const initialState: GameState = {
  category: '',
  players: 5,
  imposters: 1,
  currentPlayer: 1,
  word: '',
  playerRoles: [],
  gameStarted: false,
  gameEnded: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'SET_IMPOSTERS':
      return { ...state, imposters: action.payload };
    case 'NEXT_PLAYER': {
      const nextPlayer = state.currentPlayer + 1;
      const gameEnded = nextPlayer > state.players;
      return {
        ...state,
        currentPlayer: gameEnded ? state.players : nextPlayer,
        gameEnded,
      };
    }
    case 'START_GAME':
      return {
        ...state,
        ...action.payload,
        gameStarted: true,
        currentPlayer: 1,
        gameEnded: false,
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        players: state.players,
        imposters: state.imposters,
        category: state.category,
      };
    default:
      return state;
  }
}

export function initializeGame(
  state: GameState,
  categories: { name: string; words: string[] }[]
): GameState {
  console.log('Initializing game with state:', state);
  console.log('Available categories:', categories);
  
  // Select a random word from the chosen category
  const selectedCategory = categories.find((c) => c.name === state.category);
  
  if (!selectedCategory) {
    console.error('Category not found:', state.category);
    throw new Error(`Category '${state.category}' not found in available categories`);
  }
  
  if (!selectedCategory.words || selectedCategory.words.length === 0) {
    console.error('No words found in category:', selectedCategory);
    throw new Error(`No words found in category '${state.category}'`);
  }
  
  const word = getRandomItem(selectedCategory.words);
  console.log('Selected word:', word, 'from category:', state.category);

  // Assign roles to players
  const playerRoles: ('imposter' | 'normal')[] = Array(state.players).fill('normal');
  
  // Randomly assign imposter roles
  const imposterIndices = shuffleArray(
    Array.from({ length: state.players }, (_, i) => i)
  ).slice(0, state.imposters);
  
  imposterIndices.forEach((index) => {
    playerRoles[index] = 'imposter';
  });

  return {
    ...state,
    word,
    playerRoles,
    gameStarted: true,
    currentPlayer: 1,
    gameEnded: false,
  };
}