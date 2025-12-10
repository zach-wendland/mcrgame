/**
 * CharacterName - Displays speaker name with character-specific styling
 */

import React from 'react';
import type { CharacterId } from '@/types/game';
import styles from './CharacterName.module.css';

interface CharacterNameProps {
  characterId: CharacterId;
  className?: string;
}

// Character display configurations
const CHARACTER_CONFIG: Record<CharacterId, { name: string; color: string }> = {
  'the-patient': { name: 'The Patient', color: '#F5F5F0' },
  'death': { name: 'Death', color: '#8B0000' },
  'the-clerk': { name: 'The Clerk', color: '#704214' },
  'pierrot': { name: 'Pierrot', color: '#FFFFFF' },
  'crowd': { name: 'The Crowd', color: '#666666' },
  'narrator': { name: '', color: 'transparent' }
};

export const CharacterName: React.FC<CharacterNameProps> = ({
  characterId,
  className = ''
}) => {
  const config = CHARACTER_CONFIG[characterId];

  if (!config || !config.name) {
    return null;
  }

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ '--character-color': config.color } as React.CSSProperties}
    >
      <span className={styles.name}>{config.name}</span>
    </div>
  );
};
