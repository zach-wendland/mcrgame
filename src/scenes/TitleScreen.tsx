/**
 * TitleScreen - Main menu / title screen
 */

import React, { useState, useEffect } from 'react';
import { hasSave, deleteSave } from '@/utils/gameState';
import { PixiBackground } from '@/components/PixiBackground';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onNewGame,
  onContinue
}) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [saveExists, setSaveExists] = useState(false);

  useEffect(() => {
    // Staggered fade-in
    const titleTimer = setTimeout(() => setShowTitle(true), 500);
    const buttonTimer = setTimeout(() => setShowButtons(true), 1500);
    setSaveExists(hasSave());

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleNewGame = () => {
    if (saveExists) {
      const confirm = window.confirm('This will overwrite your existing save. Continue?');
      if (confirm) {
        deleteSave();
        onNewGame();
      }
    } else {
      onNewGame();
    }
  };

  return (
    <div className={styles.container}>
      {/* Pixi.js animated background */}
      <PixiBackground sceneId="title" isActive={true} />

      {/* CSS Background */}
      <div className={styles.background} />

      {/* Title */}
      <div className={`${styles.titleContainer} ${showTitle ? styles.visible : ''}`}>
        <h1 className={styles.title}>THE BLACK PARADE</h1>
        <h2 className={styles.subtitle}>CARRY ON</h2>
        <p className={styles.tagline}>An Interactive Experience</p>
      </div>

      {/* Menu buttons */}
      <div className={`${styles.menu} ${showButtons ? styles.visible : ''}`}>
        {saveExists && (
          <button
            className={styles.menuButton}
            onClick={onContinue}
            type="button"
          >
            Continue
          </button>
        )}
        <button
          className={styles.menuButton}
          onClick={handleNewGame}
          type="button"
        >
          New Game
        </button>
      </div>

      {/* Footer */}
      <div className={`${styles.footer} ${showButtons ? styles.visible : ''}`}>
        <p>A fan-made tribute to My Chemical Romance</p>
        <p className={styles.demo}>DEMO VERSION</p>
      </div>
    </div>
  );
};
