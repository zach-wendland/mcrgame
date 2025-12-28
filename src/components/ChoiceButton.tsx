/**
 * ChoiceButton - Individual dialogue choice button
 */

import React, { memo } from 'react';
import type { DialogueChoice } from '@/types/game';
import styles from './ChoiceButton.module.css';

interface ChoiceButtonProps {
  choice: DialogueChoice;
  index: number;
  onClick: () => void;
  className?: string;
}

export const ChoiceButton = memo<ChoiceButtonProps>(({
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

  const componentClass = `ChoiceButton ${styles.button} ${className}`.trim();

  return (
    <button
      className={componentClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-label={`Choice ${index + 1}: ${choice.text}`}
    >
      <span className={styles.index}>{index + 1}.</span>
      <span className={styles.text}>{choice.text}</span>
    </button>
  );
});
