/**
 * Main App Component - The Black Parade: Carry On
 */

import React, { useCallback, useMemo } from 'react';
import type { SceneId, DialogueChoice } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { TitleScreen } from '@/scenes/TitleScreen';
import { Scene } from '@/components/Scene';
import {
  draagOpeningDialogue,
  paradeMemoryDialogue,
  pierrotConfrontationDialogue
} from '@/dialogue';
import './App.css';

// Placeholder background images (will be replaced with AI-generated art)
const BACKGROUNDS: Record<SceneId, string> = {
  'title': '',
  'draag-opening': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"%3E%3Crect fill="%230D0D0D" width="1920" height="1080"/%3E%3Crect fill="%23141210" x="0" y="800" width="1920" height="280"/%3E%3Cellipse fill="%23704214" opacity="0.1" cx="960" cy="300" rx="800" ry="200"/%3E%3C/svg%3E',
  'parade-memory': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"%3E%3Crect fill="%23704214" width="1920" height="1080"/%3E%3Crect fill="%23B8860B" opacity="0.3" x="0" y="700" width="1920" height="380"/%3E%3Cellipse fill="%23FFF8DC" opacity="0.2" cx="960" cy="200" rx="600" ry="200"/%3E%3C/svg%3E',
  'pierrot-confrontation': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"%3E%3Crect fill="%230D0D0D" width="1920" height="1080"/%3E%3Crect fill="%238B0000" opacity="0.2" x="0" y="800" width="1920" height="280"/%3E%3Cellipse fill="%238B0000" opacity="0.1" cx="960" cy="540" rx="400" ry="300"/%3E%3C/svg%3E'
};

// Scene configuration
const SCENE_DIALOGUES = {
  'draag-opening': draagOpeningDialogue,
  'parade-memory': paradeMemoryDialogue,
  'pierrot-confrontation': pierrotConfrontationDialogue
} as const;

const SCENE_ORDER: SceneId[] = [
  'title',
  'draag-opening',
  'parade-memory',
  'pierrot-confrontation'
];

export const App: React.FC = () => {
  const {
    state,
    goToScene,
    makeChoice,
    load,
    save
  } = useGameState(true, 30000);

  // Get current dialogue for the scene
  const currentDialogue = useMemo(() => {
    const sceneId = state.currentScene;
    if (sceneId === 'title') return null;
    return SCENE_DIALOGUES[sceneId as keyof typeof SCENE_DIALOGUES] ?? null;
  }, [state.currentScene]);

  // Handle starting a new game
  const handleNewGame = useCallback(() => {
    goToScene('draag-opening');
  }, [goToScene]);

  // Handle continuing from save
  const handleContinue = useCallback(() => {
    const loaded = load();
    if (!loaded) {
      // If load fails, start new game
      handleNewGame();
    }
  }, [load, handleNewGame]);

  // Handle scene ending - advance to next scene
  const handleSceneEnd = useCallback(() => {
    const currentIndex = SCENE_ORDER.indexOf(state.currentScene);
    const nextIndex = currentIndex + 1;

    if (nextIndex < SCENE_ORDER.length) {
      const nextScene = SCENE_ORDER[nextIndex];
      if (nextScene) {
        goToScene(nextScene);
        save(); // Save progress at scene transitions
      }
    } else {
      // Demo complete - return to title
      goToScene('title');
    }
  }, [state.currentScene, goToScene, save]);

  // Handle choice made
  const handleChoiceMade = useCallback((choice: DialogueChoice) => {
    if (currentDialogue && choice.consequence) {
      makeChoice(currentDialogue.id, choice.id, choice.consequence);
    }
  }, [currentDialogue, makeChoice]);

  // Render title screen
  if (state.currentScene === 'title') {
    return (
      <TitleScreen
        onNewGame={handleNewGame}
        onContinue={handleContinue}
      />
    );
  }

  // Render game scene
  return (
    <Scene
      sceneId={state.currentScene}
      backgroundImage={BACKGROUNDS[state.currentScene] ?? BACKGROUNDS['draag-opening']}
      dialogue={currentDialogue}
      onSceneEnd={handleSceneEnd}
      onChoiceMade={handleChoiceMade}
    />
  );
};
