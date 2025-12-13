/**
 * Sprite Sheet Utility
 * Handles loading and parsing sprite sheets for character animations
 */

export interface SpriteSheetConfig {
  imagePath: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  animations: {
    [key: string]: {
      startFrame: number;
      frameCount: number;
      frameDuration: number; // ms per frame
    };
  };
}

export interface CharacterSpriteConfig {
  id: string;
  name: string;
  spriteSheet: SpriteSheetConfig;
  scale?: number;
}

// Sprite sheet configurations for each character
export const CHARACTER_SPRITES: Record<string, CharacterSpriteConfig> = {
  'the-bassist': {
    id: 'the-bassist',
    name: 'The Bassist',
    scale: 2.5,
    spriteSheet: {
      imagePath: '/sprites/bassist-sheet.png',
      frameWidth: 43,  // 1024 / 24 cols ≈ 43
      frameHeight: 64, // 192 / 3 rows = 64
      columns: 24,
      rows: 3,
      animations: {
        idle: { startFrame: 0, frameCount: 8, frameDuration: 200 },
        walk: { startFrame: 8, frameCount: 8, frameDuration: 150 },
        play: { startFrame: 16, frameCount: 8, frameDuration: 120 },
      },
    },
  },
  'the-lead-guitarist': {
    id: 'the-lead-guitarist',
    name: 'The Lead Guitarist',
    scale: 2.5,
    spriteSheet: {
      imagePath: '/sprites/guitarist-sheet.png',
      frameWidth: 57,  // Based on 6 columns
      frameHeight: 72, // Based on 3 rows
      columns: 6,
      rows: 3,
      animations: {
        idle: { startFrame: 0, frameCount: 6, frameDuration: 200 },
        walk: { startFrame: 6, frameCount: 6, frameDuration: 150 },
        play: { startFrame: 12, frameCount: 6, frameDuration: 100 },
      },
    },
  },
  'the-rhythm-guitarist': {
    id: 'the-rhythm-guitarist',
    name: 'The Rhythm Guitarist',
    scale: 2.5,
    spriteSheet: {
      imagePath: '/sprites/guitarist-sheet.png', // Same sheet, mirrored
      frameWidth: 57,
      frameHeight: 72,
      columns: 6,
      rows: 3,
      animations: {
        idle: { startFrame: 0, frameCount: 6, frameDuration: 200 },
        walk: { startFrame: 6, frameCount: 6, frameDuration: 150 },
        play: { startFrame: 12, frameCount: 6, frameDuration: 100 },
      },
    },
  },
  'the-patient': {
    id: 'the-patient',
    name: 'The Patient',
    scale: 2,
    spriteSheet: {
      imagePath: '/sprites/patient-sheet.png',
      frameWidth: 64,  // Based on 6 columns
      frameHeight: 96, // Based on 6 rows
      columns: 6,
      rows: 6,
      animations: {
        idle: { startFrame: 0, frameCount: 6, frameDuration: 300 },
        talk: { startFrame: 6, frameCount: 6, frameDuration: 200 },
        point: { startFrame: 12, frameCount: 6, frameDuration: 180 },
        pray: { startFrame: 18, frameCount: 6, frameDuration: 250 },
        scared: { startFrame: 24, frameCount: 6, frameDuration: 150 },
        neutral: { startFrame: 30, frameCount: 6, frameDuration: 300 },
      },
    },
  },
  'the-lead-singer': {
    id: 'the-lead-singer',
    name: 'The Lead Singer',
    scale: 2,
    spriteSheet: {
      imagePath: '/sprites/lead-singer-sheet.png',
      frameWidth: 85,  // Based on 6 columns ~512/6
      frameHeight: 96, // Based on 4 rows
      columns: 6,
      rows: 4,
      animations: {
        idle: { startFrame: 0, frameCount: 6, frameDuration: 250 },
        talk: { startFrame: 6, frameCount: 6, frameDuration: 180 },
        point: { startFrame: 12, frameCount: 6, frameDuration: 200 },
        sing: { startFrame: 18, frameCount: 6, frameDuration: 150 },
      },
    },
  },
  'the-drummer': {
    id: 'the-drummer',
    name: 'The Drummer',
    scale: 2,
    spriteSheet: {
      imagePath: '/sprites/drummer-sheet.png',
      frameWidth: 102, // Based on 6 columns (wider due to drum kit)
      frameHeight: 96, // Based on 4 rows
      columns: 6,
      rows: 4,
      animations: {
        idle: { startFrame: 0, frameCount: 6, frameDuration: 200 },
        play: { startFrame: 6, frameCount: 6, frameDuration: 100 },
        hit: { startFrame: 12, frameCount: 6, frameDuration: 80 },
        intense: { startFrame: 18, frameCount: 6, frameDuration: 60 },
      },
    },
  },
};

// Get the frame position for a specific frame index
export function getFramePosition(
  config: SpriteSheetConfig,
  frameIndex: number
): { x: number; y: number } {
  const col = frameIndex % config.columns;
  const row = Math.floor(frameIndex / config.columns);
  return {
    x: col * config.frameWidth,
    y: row * config.frameHeight,
  };
}

// Get the current animation frame based on time
export function getCurrentFrame(
  animation: { startFrame: number; frameCount: number; frameDuration: number },
  elapsedTime: number
): number {
  const frameInAnimation = Math.floor(elapsedTime / animation.frameDuration) % animation.frameCount;
  return animation.startFrame + frameInAnimation;
}

// Map emotion to animation name
export function emotionToAnimation(emotion: string): string {
  switch (emotion) {
    case 'sad':
    case 'accepting':
      return 'idle';
    case 'angry':
      return 'play';
    case 'hopeful':
      return 'talk';
    case 'fearful':
      return 'scared';
    default:
      return 'idle';
  }
}

// Check if a character has sprite sheets available
export function hasSpriteSheet(characterId: string): boolean {
  return characterId in CHARACTER_SPRITES;
}

// Preload sprite sheet images
export async function preloadSpriteSheets(): Promise<Map<string, HTMLImageElement>> {
  const images = new Map<string, HTMLImageElement>();

  const loadImage = (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  };

  const uniquePaths = new Set(
    Object.values(CHARACTER_SPRITES).map(c => c.spriteSheet.imagePath)
  );

  for (const path of uniquePaths) {
    try {
      const img = await loadImage(path);
      images.set(path, img);
    } catch (e) {
      console.warn(`Could not load sprite sheet: ${path}`);
    }
  }

  return images;
}
