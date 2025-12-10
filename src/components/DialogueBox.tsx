/**
 * DialogueBox - Main dialogue display component
 * Renders character name, dialogue text, and choice buttons
 */

import React from 'react';
import type { CharacterId, DialogueChoice } from '@/types/game';
import { CharacterName } from './CharacterName';
import { ChoiceButton } from './ChoiceButton';
import styles from './DialogueBox.module.css';

interface DialogueBoxProps {
  speaker: CharacterId | null;
  text: string;
  isTyping: boolean;
  choices: DialogueChoice[];
  onAdvance: () => void;
  onChoiceSelect: (choiceId: string) => void;
  className?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  isTyping,
  choices,
  onAdvance,
  onChoiceSelect,
  className = ''
}) => {
  const showChoices = !isTyping && choices.length > 0;

  const handleClick = () => {
    if (!showChoices) {
      onAdvance();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={isTyping ? 'Click to skip typing' : showChoices ? 'Choose an option' : 'Click to continue'}
    >
      {/* Character name */}
      {speaker && speaker !== 'narrator' && (
        <CharacterName characterId={speaker} />
      )}

      {/* Dialogue text */}
      <div className={styles.textContainer}>
        <p className={styles.text}>
          {text}
          {isTyping && <span className={styles.cursor}>|</span>}
        </p>
      </div>

      {/* Choices */}
      {showChoices && (
        <div className={styles.choices} role="group" aria-label="Dialogue choices">
          {choices.map((choice, index) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              index={index}
              onClick={() => onChoiceSelect(choice.id)}
            />
          ))}
        </div>
      )}

      {/* Continue indicator */}
      {!isTyping && !showChoices && (
        <div className={styles.continueIndicator} aria-hidden="true">
          <span className={styles.arrow}>&#9660;</span>
        </div>
      )}
    </div>
  );
};
