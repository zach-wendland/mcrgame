/**
 * Scene - Container component for game scenes with background and transitions
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SceneId, DialogueSequence, DialogueChoice, DialogueNode, CharacterId } from '@/types/game';
import { useDialogue } from '@/hooks/useDialogue';
import { DialogueBox } from './DialogueBox';
import { PixiBackground } from './PixiBackground';
import { CharacterRenderer } from './SpriteCharacter';
import { BandSilhouette } from './BandSilhouette';
import styles from './Scene.module.css';

interface SceneProps {
  sceneId: SceneId;
  backgroundImage: string;
  backgroundClass?: string;
  sceneNumber?: number;
  sceneCount?: number;
  sceneLabel?: string;
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
  sceneNumber,
  sceneCount,
  sceneLabel,
  dialogue,
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
  const [choiceToast, setChoiceToast] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<number | null>(null);
  const choiceToastTimeoutRef = useRef<number | null>(null);

  // Memoize the node change callback to prevent infinite loops
  const handleNodeChange = useCallback((node: DialogueNode | null) => {
    // Update current speaker for character display
    setCurrentSpeaker(node?.speaker ?? null);

    // Notify parent of dialogue change (for autosave)
    onDialogueChange?.(node?.id ?? null);

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
      if (choiceToastTimeoutRef.current) {
        clearTimeout(choiceToastTimeoutRef.current);
      }
    };
  }, []);

  const handleChoiceMade = useCallback((choice: DialogueChoice) => {
    const trimmed = choice.text.length > 48 ? `${choice.text.slice(0, 48)}...` : choice.text;
    setChoiceToast(`Choice recorded: ${trimmed}`);
    if (choiceToastTimeoutRef.current) {
      clearTimeout(choiceToastTimeoutRef.current);
    }
    choiceToastTimeoutRef.current = window.setTimeout(() => {
      setChoiceToast(null);
    }, 2000);
    onChoiceMade?.(choice);
  }, [onChoiceMade]);

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
    onChoiceMade: handleChoiceMade,
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

  // Handle choice selection
  const handleChoiceSelect = useCallback((choiceId: string) => {
    selectChoice(choiceId);
  }, [selectChoice]);

  // Determine which character to show based on current speaker
  const showCharacter = currentSpeaker && currentSpeaker !== 'narrator' && currentSpeaker !== 'crowd';
  const showChoices = !isTyping && choices.length > 0;

  const totalNodes = dialogue?.nodes.length ?? 0;
  const currentIndex = currentNode && dialogue
    ? dialogue.nodes.findIndex(node => node.id === currentNode.id)
    : -1;
  const lineLabel = totalNodes > 0 && currentIndex >= 0
    ? `Line ${currentIndex + 1} / ${totalNodes}`
    : null;
  const sceneProgress = sceneNumber && sceneCount ? `Scene ${sceneNumber} / ${sceneCount}` : null;
  const hintText = showChoices
    ? 'Choose an option'
    : isTyping
    ? 'Click to skip typing'
    : 'Click or press Enter/Space to continue';

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

      {/* Scene HUD */}
      <div className={styles.hud} aria-live="polite">
        <div className={styles.hudPanel}>
          {sceneProgress && (
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Progress</span>
              <span className={styles.hudValue}>{sceneProgress}</span>
            </div>
          )}
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Location</span>
            <span className={styles.hudValue}>{sceneLabel ?? sceneId}</span>
          </div>
          {lineLabel && (
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Dialogue</span>
              <span className={styles.hudValue}>{lineLabel}</span>
            </div>
          )}
        </div>

        <div className={styles.hudPanel}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Autosave</span>
            <span className={styles.hudValue}>On</span>
          </div>
        </div>
      </div>

      <div className={styles.hudHint}>
        {hintText} • Esc: Title
      </div>

      {choiceToast && (
        <div className={styles.hudToast} role="status">
          {choiceToast}
        </div>
      )}

      {/* Character sprite layer */}
      <div className={styles.characterLayer}>
        {showCharacter ? (
          <CharacterRenderer
            characterId={currentSpeaker}
            emotion={currentNode?.emotion}
            isActive={!isTransitioning}
          />
        ) : (
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
