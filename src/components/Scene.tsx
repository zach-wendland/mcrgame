/**
 * Scene - Container component for game scenes with background and transitions
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SceneId, DialogueSequence, DialogueChoice, DialogueNode, CharacterId } from '@/types/game';
import { useDialogue } from '@/hooks/useDialogue';
import { DialogueBox } from './DialogueBox';
import { PixiBackground } from './PixiBackground';
import { PixiCharacter } from './PixiCharacter';
import { CharacterRenderer } from './SpriteCharacter';
import { BandSilhouette } from './BandSilhouette';
import { hasSpriteSheet } from '@/utils/spriteSheet';
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
  onDialogueChange?: (dialogueId: string | null) => void;
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
  onDialogueChange,
  children
}) => {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentBg, setCurrentBg] = useState(backgroundImage);
  const [isShaking, setIsShaking] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<CharacterId | null>(null);
  const shakeTimeoutRef = useRef<number | null>(null);

  // Memoize the node change callback to prevent infinite loops
  const handleNodeChange = useCallback((node: DialogueNode | null) => {
    // Update current speaker for character display
    setCurrentSpeaker(node?.speaker ?? null);

    // Notify parent of dialogue change (for autosave)
    onDialogueChange?.(node?.id ?? null);

    // Play sound effects from dialogue
    if (node?.effect?.playSound) {
      audioManager.playSfx(node.effect.playSound);
    }

    // Trigger screen shake
    if (node?.effect?.screenShake) {
      setIsShaking(true);
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      shakeTimeoutRef.current = window.setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }

    // Trigger fade to black
    if (node?.effect?.fadeToBlack) {
      setIsFading(true);
      // Fade will be cleared on next node or scene transition
    }
  }, [onDialogueChange]);

  // Clear fade when transitioning
  useEffect(() => {
    if (isTransitioning) {
      setIsFading(false);
    }
  }, [isTransitioning]);

  // Cleanup shake timeout
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
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

  // Determine which character to show based on current speaker
  const showCharacter = currentSpeaker && currentSpeaker !== 'narrator' && currentSpeaker !== 'crowd';

  return (
    <div
      className={`${styles.scene} ${isTransitioning ? styles.transitioning : ''} ${isShaking ? styles.shaking : ''} ${backgroundClass ? `bg-${backgroundClass}` : ''}`}
      data-scene-id={sceneId}
    >
      {/* Pixi.js animated background layer */}
      <PixiBackground sceneId={sceneId} isActive={!isTransitioning} />

      {/* CSS Background */}
      <div
        className={styles.background}
        style={currentBg ? { backgroundImage: `url(${currentBg})` } : undefined}
        aria-hidden="true"
      />

      {/* Overlay for atmosphere */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Character sprite layer */}
      <div className={styles.characterLayer}>
        {showCharacter ? (
          // Use sprite sheets when available, fall back to procedural
          hasSpriteSheet(currentSpeaker) ? (
            <CharacterRenderer
              characterId={currentSpeaker}
              emotion={currentNode?.emotion}
              isActive={!isTransitioning}
            />
          ) : (
            <PixiCharacter
              characterId={currentSpeaker}
              emotion={currentNode?.emotion}
              isActive={!isTransitioning}
            />
          )
        ) : (
          /* Show band silhouette during narrator sections in scene 1 */
          <BandSilhouette
            isActive={!isTransitioning && !showCharacter}
            sceneId={sceneId}
          />
        )}
      </div>

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

      {/* Fade to black overlay */}
      <div className={`${styles.fadeOverlay} ${isFading ? styles.active : ''}`} aria-hidden="true" />
    </div>
  );
};
