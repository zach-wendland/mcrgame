/**
 * Main App Component - The Black Parade: Carry On
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import type { SceneId, DialogueChoice } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useAssetPreloader } from '@/hooks/useAssetPreloader';
import { TitleScreen } from '@/scenes/TitleScreen';
import { Scene } from '@/components/Scene';
import { LoadingScreen } from '@/components/LoadingScreen';
import {
  draagOpeningDialogue,
  paradeMemoryDialogue,
  pierrotConfrontationDialogue
} from '@/dialogue';
import { isTestMode } from '@/utils/testMode';
import './App.css';

// Scene-specific CSS class names for backgrounds (defined in App.css)
const SCENE_BACKGROUNDS: Record<SceneId, string> = {
  'title': '',
  'draag-opening': 'draag',
  'parade-memory': 'parade',
  'pierrot-confrontation': 'pierrot'
};

// Empty string backgrounds - we'll use CSS classes instead
const BACKGROUNDS: Record<SceneId, string> = {
  'title': '',
  'draag-opening': '',
  'parade-memory': '',
  'pierrot-confrontation': ''
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
  // Asset preloading - blocks render until sprites are loaded
  const { ready: assetsReady, progress, error, retry } = useAssetPreloader();

  // Use faster autosave interval in test mode (500ms vs 3000ms)
  const autoSaveInterval = isTestMode() ? 500 : 3000;

  const {
    state,
    goToScene,
    setDialogue,
    makeChoice,
    load,
    save,
    reset
  } = useGameState(true, autoSaveInterval);

  // Show loading screen while assets are being preloaded
  // Skip in test mode for faster tests
  if (!assetsReady && !isTestMode()) {
    return <LoadingScreen progress={progress} error={error} onRetry={retry} />;
  }

  // Escape key returns to title screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.currentScene !== 'title') {
        goToScene('title');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentScene, goToScene]);

  // Dev mode: expose reset to console
  useEffect(() => {
    (window as unknown as { resetGame: () => void }).resetGame = reset;
  }, [reset]);

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
      backgroundImage={BACKGROUNDS[state.currentScene] ?? ''}
      backgroundClass={SCENE_BACKGROUNDS[state.currentScene] ?? ''}
      dialogue={currentDialogue}
      onSceneEnd={handleSceneEnd}
      onChoiceMade={handleChoiceMade}
      onDialogueChange={setDialogue}
    />
  );
};
