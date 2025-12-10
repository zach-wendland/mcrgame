/**
 * Game state management for The Black Parade: Carry On
 */

import type { GameState, EmotionalState, SaveData, SceneId, ChoiceConsequence } from '@/types/game';

const SAVE_KEY = 'black-parade-save';
const GAME_VERSION = '0.1.0';

// Default emotional state - The Patient starts conflicted
const DEFAULT_EMOTIONAL_STATE: EmotionalState = {
  acceptance: 20,
  regret: 60,
  hope: 30,
  defiance: 40
};

// Create initial game state
export function createInitialGameState(): GameState {
  return {
    currentScene: 'title',
    currentDialogueId: null,
    emotionalState: { ...DEFAULT_EMOTIONAL_STATE },
    flags: new Set<string>(),
    choiceHistory: [],
    playTime: 0
  };
}

// Apply choice consequences to game state
export function applyChoiceConsequence(
  state: GameState,
  consequence: ChoiceConsequence
): GameState {
  const newState = { ...state };

  // Update emotional state
  if (consequence.emotionalState) {
    newState.emotionalState = {
      ...state.emotionalState,
      ...Object.fromEntries(
        Object.entries(consequence.emotionalState).map(([key, value]) => [
          key,
          Math.max(0, Math.min(100, (state.emotionalState[key as keyof EmotionalState] || 0) + (value || 0)))
        ])
      )
    } as EmotionalState;
  }

  // Set flags
  if (consequence.flagsToSet) {
    newState.flags = new Set([...state.flags, ...consequence.flagsToSet]);
  }

  // Remove flags
  if (consequence.flagsToRemove) {
    newState.flags = new Set(
      [...state.flags].filter(f => !consequence.flagsToRemove?.includes(f))
    );
  }

  return newState;
}

// Change scene
export function changeScene(state: GameState, sceneId: SceneId, dialogueId: string | null = null): GameState {
  return {
    ...state,
    currentScene: sceneId,
    currentDialogueId: dialogueId
  };
}

// Record a choice
export function recordChoice(
  state: GameState,
  dialogueId: string,
  choiceId: string
): GameState {
  return {
    ...state,
    choiceHistory: [
      ...state.choiceHistory,
      { dialogueId, choiceId, timestamp: Date.now() }
    ]
  };
}

// Check if a flag is set
export function hasFlag(state: GameState, flag: string): boolean {
  return state.flags.has(flag);
}

// Get emotional state descriptor
export function getEmotionalStateDescription(state: EmotionalState): string {
  const { acceptance, regret, hope, defiance } = state;

  if (acceptance > 70) return 'at peace';
  if (regret > 70) return 'burdened by regret';
  if (defiance > 70) return 'defiant';
  if (hope > 70) return 'hopeful';
  if (acceptance < 30 && regret > 50) return 'struggling';

  return 'conflicted';
}

// Serialize game state for saving
function serializeGameState(state: GameState): SaveData {
  return {
    version: GAME_VERSION,
    timestamp: Date.now(),
    gameState: {
      ...state,
      flags: [...state.flags] // Convert Set to Array
    }
  };
}

// Deserialize saved data
function deserializeGameState(data: SaveData): GameState | null {
  if (data.version !== GAME_VERSION) {
    console.warn(`Save version mismatch: ${data.version} vs ${GAME_VERSION}`);
    // In future, add migration logic here
  }

  return {
    ...data.gameState,
    flags: new Set(data.gameState.flags)
  };
}

// Save game to localStorage
export function saveGame(state: GameState): boolean {
  try {
    const saveData = serializeGameState(state);
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
}

// Load game from localStorage
export function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;

    const data: SaveData = JSON.parse(saved);
    return deserializeGameState(data);
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

// Delete save
export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

// Check if save exists
export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
