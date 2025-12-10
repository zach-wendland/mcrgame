/**
 * ChoiceButton - Individual dialogue choice button
 */

import React from 'react';
import type { DialogueChoice } from '@/types/game';
import styles from './ChoiceButton.module.css';

interface ChoiceButtonProps {
  choice: DialogueChoice;
  index: number;
  onClick: () => void;
  className?: string;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  index,
  onClick,
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dialogue box click
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <button
      className={`${styles.button} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-label={`Choice ${index + 1}: ${choice.text}`}
    >
      <span className={styles.index}>{index + 1}.</span>
      <span className={styles.text}>{choice.text}</span>
    </button>
  );
};
