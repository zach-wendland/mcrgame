/**
 * Scene - Container component for game scenes with background and transitions
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { SceneId, DialogueSequence, DialogueChoice, DialogueNode } from '@/types/game';
import { useDialogue } from '@/hooks/useDialogue';
import { DialogueBox } from './DialogueBox';
import { audioManager } from '@/utils/audioManager';
import styles from './Scene.module.css';

interface SceneProps {
  sceneId: SceneId;
  backgroundImage: string;
  backgroundClass?: string;
  dialogue: DialogueSequence | null;
  music?: string;
  ambientSound?: string;
  onSceneEnd?: () => void;
  onChoiceMade?: (choice: DialogueChoice) => void;
  children?: React.ReactNode;
}

export const Scene: React.FC<SceneProps> = ({
  sceneId,
  backgroundImage,
  backgroundClass = '',
  dialogue,
  music,
  ambientSound,
  onSceneEnd,
  onChoiceMade,
  children
}) => {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentBg, setCurrentBg] = useState(backgroundImage);

  // Memoize the node change callback to prevent infinite loops
  const handleNodeChange = useCallback((node: DialogueNode | null) => {
    // Play sound effects from dialogue
    if (node?.effect?.playSound) {
      audioManager.playSfx(node.effect.playSound);
    }
  }, []);

  // Handle dialogue
  const {
    currentNode,
    isTyping,
    displayedText,
    choices,
    advance,
    selectChoice
  } = useDialogue(dialogue, {
    onSequenceEnd: onSceneEnd,
    onChoiceMade,
    onNodeChange: handleNodeChange
  });

  // Scene transition effect
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setCurrentBg(backgroundImage);
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [sceneId, backgroundImage]);

  // Music management
  useEffect(() => {
    if (music) {
      audioManager.playMusic(music);
    }
    return () => {
      // Don't stop music on unmount - let new scene take over
    };
  }, [music]);

  // Ambient sound
  useEffect(() => {
    if (ambientSound) {
      audioManager.playSfx(ambientSound);
    }
  }, [ambientSound]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choiceId: string) => {
    selectChoice(choiceId);
  }, [selectChoice]);

  return (
    <div
      className={`${styles.scene} ${isTransitioning ? styles.transitioning : ''} ${backgroundClass ? `bg-${backgroundClass}` : ''}`}
      data-scene-id={sceneId}
    >
      {/* Background */}
      <div
        className={styles.background}
        style={currentBg ? { backgroundImage: `url(${currentBg})` } : undefined}
        aria-hidden="true"
      />

      {/* Overlay for atmosphere */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Scene content (character sprites, etc.) */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Dialogue box */}
      {currentNode && (
        <DialogueBox
          speaker={currentNode.speaker}
          text={displayedText}
          isTyping={isTyping}
          choices={choices}
          onAdvance={advance}
          onChoiceSelect={handleChoiceSelect}
        />
      )}
    </div>
  );
};
