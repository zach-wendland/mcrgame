/**
 * Unit tests for game state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialGameState,
  applyChoiceConsequence,
  changeScene,
  recordChoice,
  hasFlag,
  getEmotionalStateDescription,
  saveGame,
  loadGame,
  deleteSave,
  hasSave
} from '@/utils/gameState';
import type { GameState, ChoiceConsequence } from '@/types/game';

describe('gameState', () => {
  describe('createInitialGameState', () => {
    it('should create a valid initial state', () => {
      const state = createInitialGameState();

      expect(state.currentScene).toBe('title');
      expect(state.currentDialogueId).toBeNull();
      expect(state.emotionalState).toBeDefined();
      expect(state.flags).toBeInstanceOf(Set);
      expect(state.flags.size).toBe(0);
      expect(state.choiceHistory).toEqual([]);
      expect(state.playTime).toBe(0);
    });

    it('should have default emotional state values', () => {
      const state = createInitialGameState();

      expect(state.emotionalState.acceptance).toBeGreaterThan(0);
      expect(state.emotionalState.regret).toBeGreaterThan(0);
      expect(state.emotionalState.hope).toBeGreaterThan(0);
      expect(state.emotionalState.defiance).toBeGreaterThan(0);
    });
  });

  describe('applyChoiceConsequence', () => {
    let state: GameState;

    beforeEach(() => {
      state = createInitialGameState();
    });

    it('should update emotional state', () => {
      const consequence: ChoiceConsequence = {
        emotionalState: { acceptance: 20, regret: -10 }
      };

      const newState = applyChoiceConsequence(state, consequence);

      expect(newState.emotionalState.acceptance).toBe(state.emotionalState.acceptance + 20);
      expect(newState.emotionalState.regret).toBe(state.emotionalState.regret - 10);
    });

    it('should clamp emotional state between 0 and 100', () => {
      const consequence: ChoiceConsequence = {
        emotionalState: { acceptance: 200 } // Way over 100
      };

      const newState = applyChoiceConsequence(state, consequence);

      expect(newState.emotionalState.acceptance).toBe(100);
    });

    it('should not go below 0', () => {
      const consequence: ChoiceConsequence = {
        emotionalState: { hope: -500 }
      };

      const newState = applyChoiceConsequence(state, consequence);

      expect(newState.emotionalState.hope).toBe(0);
    });

    it('should set flags', () => {
      const consequence: ChoiceConsequence = {
        flagsToSet: ['test-flag', 'another-flag']
      };

      const newState = applyChoiceConsequence(state, consequence);

      expect(newState.flags.has('test-flag')).toBe(true);
      expect(newState.flags.has('another-flag')).toBe(true);
    });

    it('should remove flags', () => {
      state.flags.add('remove-me');
      state.flags.add('keep-me');

      const consequence: ChoiceConsequence = {
        flagsToRemove: ['remove-me']
      };

      const newState = applyChoiceConsequence(state, consequence);

      expect(newState.flags.has('remove-me')).toBe(false);
      expect(newState.flags.has('keep-me')).toBe(true);
    });
  });

  describe('changeScene', () => {
    it('should change the current scene', () => {
      const state = createInitialGameState();
      const newState = changeScene(state, 'draag-opening');

      expect(newState.currentScene).toBe('draag-opening');
    });

    it('should optionally set dialogue id', () => {
      const state = createInitialGameState();
      const newState = changeScene(state, 'parade-memory', 'memory-1');

      expect(newState.currentScene).toBe('parade-memory');
      expect(newState.currentDialogueId).toBe('memory-1');
    });
  });

  describe('recordChoice', () => {
    it('should add choice to history', () => {
      const state = createInitialGameState();
      const newState = recordChoice(state, 'dialogue-1', 'choice-a');

      expect(newState.choiceHistory).toHaveLength(1);
      expect(newState.choiceHistory[0]?.dialogueId).toBe('dialogue-1');
      expect(newState.choiceHistory[0]?.choiceId).toBe('choice-a');
      expect(newState.choiceHistory[0]?.timestamp).toBeGreaterThan(0);
    });
  });

  describe('hasFlag', () => {
    it('should return true if flag exists', () => {
      const state = createInitialGameState();
      state.flags.add('my-flag');

      expect(hasFlag(state, 'my-flag')).toBe(true);
    });

    it('should return false if flag does not exist', () => {
      const state = createInitialGameState();

      expect(hasFlag(state, 'nonexistent')).toBe(false);
    });
  });

  describe('getEmotionalStateDescription', () => {
    it('should return "at peace" when acceptance is high', () => {
      const state = { acceptance: 80, regret: 20, hope: 50, defiance: 30 };
      expect(getEmotionalStateDescription(state)).toBe('at peace');
    });

    it('should return "burdened by regret" when regret is high', () => {
      const state = { acceptance: 20, regret: 80, hope: 30, defiance: 30 };
      expect(getEmotionalStateDescription(state)).toBe('burdened by regret');
    });

    it('should return "defiant" when defiance is high', () => {
      const state = { acceptance: 20, regret: 30, hope: 30, defiance: 80 };
      expect(getEmotionalStateDescription(state)).toBe('defiant');
    });

    it('should return "hopeful" when hope is high', () => {
      const state = { acceptance: 30, regret: 30, hope: 80, defiance: 30 };
      expect(getEmotionalStateDescription(state)).toBe('hopeful');
    });

    it('should return "conflicted" for balanced state', () => {
      const state = { acceptance: 50, regret: 50, hope: 50, defiance: 50 };
      expect(getEmotionalStateDescription(state)).toBe('conflicted');
    });
  });

  describe('save/load', () => {
    it('should save and load game state', () => {
      const state = createInitialGameState();
      state.currentScene = 'parade-memory';
      state.flags.add('test-flag');

      saveGame(state);
      const loaded = loadGame();

      expect(loaded).not.toBeNull();
      expect(loaded?.currentScene).toBe('parade-memory');
      expect(loaded?.flags.has('test-flag')).toBe(true);
    });

    it('should return null if no save exists', () => {
      const loaded = loadGame();
      expect(loaded).toBeNull();
    });

    it('should correctly report save existence', () => {
      expect(hasSave()).toBe(false);

      saveGame(createInitialGameState());

      expect(hasSave()).toBe(true);
    });

    it('should delete save', () => {
      saveGame(createInitialGameState());
      expect(hasSave()).toBe(true);

      deleteSave();

      expect(hasSave()).toBe(false);
    });
  });
});
