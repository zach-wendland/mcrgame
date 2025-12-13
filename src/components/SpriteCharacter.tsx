/**
 * SpriteCharacter - Renders characters using sprite sheets with canvas
 * Falls back to PixiCharacter procedural rendering if sprite not available
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { CharacterId } from '@/types/game';
import {
  CHARACTER_SPRITES,
  hasSpriteSheet,
  getFramePosition,
  getCurrentFrame,
  emotionToAnimation,
} from '@/utils/spriteSheet';

type EmotionType = 'neutral' | 'sad' | 'angry' | 'hopeful' | 'fearful' | 'accepting';

interface SpriteCharacterProps {
  characterId: CharacterId;
  emotion?: EmotionType;
  isActive?: boolean;
  mirror?: boolean; // For rhythm guitarist
}

export const SpriteCharacter: React.FC<SpriteCharacterProps> = ({
  characterId,
  emotion = 'neutral',
  isActive = true,
  mirror = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const config = CHARACTER_SPRITES[characterId];

  // Load sprite sheet image
  useEffect(() => {
    if (!config || !isActive) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setLoadError(false);
    };
    img.onerror = () => {
      console.warn(`Failed to load sprite sheet for ${characterId}`);
      setLoadError(true);
    };
    img.src = config.spriteSheet.imagePath;

    return () => {
      imageRef.current = null;
      setImageLoaded(false);
    };
  }, [characterId, config, isActive]);

  // Animation loop
  const animate = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !config) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { spriteSheet, scale = 2 } = config;
    const animationName = emotionToAnimation(emotion);
    const animation = spriteSheet.animations[animationName] || spriteSheet.animations.idle;

    if (!animation) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const elapsedTime = Date.now() - startTimeRef.current;
    const frameIndex = getCurrentFrame(animation, elapsedTime);
    const framePos = getFramePosition(spriteSheet, frameIndex);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for potential mirroring
    ctx.save();

    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Enable crisp pixel rendering
    ctx.imageSmoothingEnabled = false;

    // Draw the sprite frame
    ctx.drawImage(
      imageRef.current,
      framePos.x,
      framePos.y,
      spriteSheet.frameWidth,
      spriteSheet.frameHeight,
      0,
      0,
      spriteSheet.frameWidth * scale,
      spriteSheet.frameHeight * scale
    );

    ctx.restore();

    animationRef.current = requestAnimationFrame(animate);
  }, [config, emotion, mirror]);

  // Start animation loop when image is loaded
  useEffect(() => {
    if (!imageLoaded || !isActive) return;

    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageLoaded, isActive, animate]);

  // Don't render if no sprite available or load error
  if (!config || !isActive || loadError) {
    return null;
  }

  const { spriteSheet, scale = 2 } = config;
  const canvasWidth = spriteSheet.frameWidth * scale;
  const canvasHeight = spriteSheet.frameHeight * scale;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          imageRendering: 'pixelated',
          width: canvasWidth,
          height: canvasHeight,
        }}
      />
    </div>
  );
};

// Wrapper component that chooses between sprite and procedural rendering
export const CharacterRenderer: React.FC<SpriteCharacterProps> = (props) => {
  const { characterId } = props;

  // Check if sprite sheet exists for this character
  const hasSprite = hasSpriteSheet(characterId);

  if (hasSprite) {
    // Special case: rhythm guitarist uses same sheet but mirrored
    const mirror = characterId === 'the-rhythm-guitarist';
    return <SpriteCharacter {...props} mirror={mirror} />;
  }

  // Fall back to procedural rendering (PixiCharacter)
  // Import dynamically to avoid circular dependency
  const { PixiCharacter } = require('./PixiCharacter');
  return <PixiCharacter {...props} />;
};

export default SpriteCharacter;
