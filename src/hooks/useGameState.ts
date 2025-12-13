/**
 * React hook for game state management
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, SceneId, ChoiceConsequence } from '@/types/game';
import {
  createInitialGameState,
  applyChoiceConsequence,
  changeScene,
  recordChoice,
  saveGame,
  loadGame,
  hasFlag
} from '@/utils/gameState';

interface UseGameStateReturn {
  state: GameState;
  goToScene: (sceneId: SceneId, dialogueId?: string | null) => void;
  setDialogue: (dialogueId: string | null) => void;
  makeChoice: (dialogueId: string, choiceId: string, consequence?: ChoiceConsequence) => void;
  checkFlag: (flag: string) => boolean;
  setFlag: (flag: string) => void;
  removeFlag: (flag: string) => void;
  save: () => boolean;
  load: () => boolean;
  reset: () => void;
}

export function useGameState(autoSave = true, autoSaveInterval = 30000): UseGameStateReturn {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGame();
    return saved || createInitialGameState();
  });

  const playTimeRef = useRef<number>(Date.now());
  const stateRef = useRef<GameState>(state);

  // Track play time
  useEffect(() => {
    const startTime = Date.now();
    playTimeRef.current = state.playTime;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setState(prev => ({
        ...prev,
        playTime: playTimeRef.current + elapsed
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Keep latest state ref for auto-save
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Deterministic auto-save: Save immediately when state changes (if not on title screen)
  useEffect(() => {
    if (!autoSave) return;

    // Don't save if we're on the title screen (no meaningful progress)
    if (state.currentScene === 'title') return;

    // Save immediately on state change
    saveGame(state);
  }, [autoSave, state]);

  // Interval-based backup save (in case deterministic save misses something)
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      if (stateRef.current.currentScene !== 'title') {
        saveGame(stateRef.current);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval]);

  const goToScene = useCallback((sceneId: SceneId, dialogueId: string | null = null) => {
    setState(prev => changeScene(prev, sceneId, dialogueId));
  }, []);

  const setDialogue = useCallback((dialogueId: string | null) => {
    setState(prev => ({
      ...prev,
      currentDialogueId: dialogueId
    }));
  }, []);

  const makeChoice = useCallback((
    dialogueId: string,
    choiceId: string,
    consequence?: ChoiceConsequence
  ) => {
    setState(prev => {
      let newState = recordChoice(prev, dialogueId, choiceId);
      if (consequence) {
        newState = applyChoiceConsequence(newState, consequence);
      }
      return newState;
    });
  }, []);

  const checkFlag = useCallback((flag: string) => {
    return hasFlag(state, flag);
  }, [state]);

  const setFlag = useCallback((flag: string) => {
    setState(prev => ({
      ...prev,
      flags: new Set([...prev.flags, flag])
    }));
  }, []);

  const removeFlag = useCallback((flag: string) => {
    setState(prev => ({
      ...prev,
      flags: new Set([...prev.flags].filter(f => f !== flag))
    }));
  }, []);

  const save = useCallback(() => {
    return saveGame(state);
  }, [state]);

  const load = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      setState(saved);
      return true;
    }
    return false;
  }, []);

  const reset = useCallback(() => {
    setState(createInitialGameState());
  }, []);

  return {
    state,
    goToScene,
    setDialogue,
    makeChoice,
    checkFlag,
    setFlag,
    removeFlag,
    save,
    load,
    reset
  };
}
