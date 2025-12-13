/**
 * PixiCharacter - Pixel art character renderer using Pixi.js
 * Draws stylized gothic character silhouettes with emotion-based variations
 */

import React, { useRef, useEffect } from 'react';
import { Application, Graphics, Container } from 'pixi.js';
import type { CharacterId } from '@/types/game';

interface CharacterConfig {
  baseColor: number;
  accentColor: number;
  glowColor: number;
  height: number;
  features: 'clerk' | 'patient' | 'death' | 'pierrot';
}

const CHARACTER_CONFIGS: Record<Exclude<CharacterId, 'narrator' | 'crowd'>, CharacterConfig> = {
  'the-clerk': {
    baseColor: 0x1a1a1a,
    accentColor: 0xffffff,
    glowColor: 0x8b0000,
    height: 280,
    features: 'clerk',
  },
  'the-patient': {
    baseColor: 0x2a2a2a,
    accentColor: 0xf5f5f0,
    glowColor: 0xffd700,
    height: 240,
    features: 'patient',
  },
  'death': {
    baseColor: 0x0a0a0a,
    accentColor: 0xfff8dc,
    glowColor: 0x8b0000,
    height: 300,
    features: 'death',
  },
  'pierrot': {
    baseColor: 0x1a0a0a,
    accentColor: 0xff4444,
    glowColor: 0xff0000,
    height: 260,
    features: 'pierrot',
  },
};

type EmotionType = 'neutral' | 'sad' | 'angry' | 'hopeful' | 'fearful' | 'accepting';

interface PixiCharacterProps {
  characterId: CharacterId;
  emotion?: EmotionType;
  isActive?: boolean;
}

export const PixiCharacter: React.FC<PixiCharacterProps> = ({
  characterId,
  emotion = 'neutral',
  isActive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    if (characterId === 'narrator' || characterId === 'crowd') return;

    const config = CHARACTER_CONFIGS[characterId];
    if (!config) return;

    let isDestroyed = false;
    let animationId: number;
    let time = 0;

    const initPixi = async () => {
      const app = new Application();

      await app.init({
        width: 200,
        height: config.height + 40,
        backgroundAlpha: 0,
        antialias: false, // Pixel art style
        resolution: 1,
      });

      if (isDestroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      containerRef.current!.appendChild(app.canvas);

      const character = new Container();
      app.stage.addChild(character);

      const drawCharacter = () => {
        character.removeChildren();

        const g = new Graphics();
        character.addChild(g);

        const centerX = 100;
        const baseY = config.height + 20;

        // Breathing animation offset
        const breatheOffset = Math.sin(time * 0.03) * 2;
        const glowPulse = 0.3 + Math.sin(time * 0.05) * 0.15;

        // Draw glow effect behind character
        g.circle(centerX, baseY - config.height / 2, config.height / 2 + 20);
        g.fill({ color: config.glowColor, alpha: glowPulse * 0.2 });

        // Draw based on character type
        switch (config.features) {
          case 'clerk':
            drawClerk(g, centerX, baseY, breatheOffset, emotion, config);
            break;
          case 'patient':
            drawPatient(g, centerX, baseY, breatheOffset, emotion, config);
            break;
          case 'death':
            drawDeath(g, centerX, baseY, breatheOffset, emotion, config);
            break;
          case 'pierrot':
            drawPierrot(g, centerX, baseY, breatheOffset, emotion, config);
            break;
        }
      };

      const animate = () => {
        if (isDestroyed) return;
        time++;
        drawCharacter();
        animationId = requestAnimationFrame(animate);
      };

      animate();
    };

    initPixi();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [characterId, emotion, isActive]);

  if (!isActive || characterId === 'narrator' || characterId === 'crowd') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    />
  );
};

// Draw The Clerk - tall, menacing, white face mask
function drawClerk(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  emotion: EmotionType,
  config: CharacterConfig
) {
  const h = config.height;

  // Body - tall black suit (pixel blocks)
  for (let y = 0; y < h - 60; y += 8) {
    const width = 40 + Math.sin(y * 0.05) * 10;
    g.rect(cx - width / 2, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Shoulders (wider)
  g.rect(cx - 45, baseY - h + 60 + breathe, 90, 16);
  g.fill({ color: config.baseColor });

  // Head - white porcelain mask
  g.circle(cx, baseY - h + 30 + breathe, 28);
  g.fill({ color: config.accentColor });

  // Face details - black eyes (hollow)
  const eyeOffset = emotion === 'angry' ? -2 : emotion === 'fearful' ? 2 : 0;
  g.circle(cx - 10, baseY - h + 25 + breathe + eyeOffset, 6);
  g.circle(cx + 10, baseY - h + 25 + breathe + eyeOffset, 6);
  g.fill({ color: 0x000000 });

  // Painted smile (too wide)
  g.moveTo(cx - 15, baseY - h + 40 + breathe);
  g.quadraticCurveTo(cx, baseY - h + 50 + breathe, cx + 15, baseY - h + 40 + breathe);
  g.stroke({ color: config.glowColor, width: 3 });

  // Collar accent
  g.rect(cx - 8, baseY - h + 55 + breathe, 16, 8);
  g.fill({ color: config.glowColor });
}

// Draw The Patient - smaller, fragile, hospital gown
function drawPatient(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  emotion: EmotionType,
  config: CharacterConfig
) {
  const h = config.height;

  // Hospital gown (pixel blocks)
  for (let y = 0; y < h - 50; y += 8) {
    const width = 35 + Math.sin(y * 0.08) * 8;
    g.rect(cx - width / 2, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: 0x4a4a5a }); // Faded blue-gray
  }

  // Shoulders (thin)
  g.rect(cx - 30, baseY - h + 50 + breathe, 60, 12);
  g.fill({ color: 0x4a4a5a });

  // Head
  g.circle(cx, baseY - h + 28 + breathe, 22);
  g.fill({ color: config.accentColor, alpha: 0.9 });

  // Eyes - based on emotion
  const eyeY = baseY - h + 24 + breathe;
  if (emotion === 'sad' || emotion === 'accepting') {
    // Downcast eyes
    g.circle(cx - 8, eyeY + 2, 4);
    g.circle(cx + 8, eyeY + 2, 4);
    g.fill({ color: 0x444444 });
  } else if (emotion === 'hopeful') {
    // Wider eyes
    g.circle(cx - 8, eyeY, 5);
    g.circle(cx + 8, eyeY, 5);
    g.fill({ color: config.glowColor, alpha: 0.8 });
  } else {
    g.circle(cx - 8, eyeY, 4);
    g.circle(cx + 8, eyeY, 4);
    g.fill({ color: 0x444444 });
  }

  // IV stand hint (line to the side)
  g.moveTo(cx + 35, baseY - 20);
  g.lineTo(cx + 35, baseY - h + 40);
  g.lineTo(cx + 25, baseY - h + 60 + breathe);
  g.stroke({ color: 0x666666, width: 2 });
}

// Draw Death - skeletal, marching band uniform, imposing
function drawDeath(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  _emotion: EmotionType,
  config: CharacterConfig
) {
  void _emotion; // Death's expression doesn't change - always imposing
  const h = config.height;

  // Military coat (pixel blocks with epaulettes)
  for (let y = 0; y < h - 70; y += 8) {
    const width = 50 + Math.sin(y * 0.04) * 12;
    g.rect(cx - width / 2, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Epaulettes
  g.circle(cx - 45, baseY - h + 75 + breathe, 12);
  g.circle(cx + 45, baseY - h + 75 + breathe, 12);
  g.fill({ color: 0xc0c0c0 }); // Silver

  // Medals (small dots)
  for (let i = 0; i < 4; i++) {
    g.circle(cx - 15 + i * 10, baseY - h + 100 + breathe, 4);
    g.fill({ color: config.glowColor });
  }

  // Skull head
  g.circle(cx, baseY - h + 35 + breathe, 30);
  g.fill({ color: config.accentColor });

  // Eye sockets (deep black)
  g.circle(cx - 12, baseY - h + 28 + breathe, 8);
  g.circle(cx + 12, baseY - h + 28 + breathe, 8);
  g.fill({ color: 0x000000 });

  // Red glow in eyes
  g.circle(cx - 12, baseY - h + 28 + breathe, 4);
  g.circle(cx + 12, baseY - h + 28 + breathe, 4);
  g.fill({ color: config.glowColor, alpha: 0.7 });

  // Nose hole (triangle)
  g.moveTo(cx, baseY - h + 38 + breathe);
  g.lineTo(cx - 5, baseY - h + 45 + breathe);
  g.lineTo(cx + 5, baseY - h + 45 + breathe);
  g.fill({ color: 0x000000 });

  // Teeth
  for (let i = -3; i <= 3; i++) {
    g.rect(cx + i * 5 - 2, baseY - h + 50 + breathe, 4, 8);
    g.fill({ color: config.accentColor });
  }

  // Shako hat (tall military hat)
  g.rect(cx - 22, baseY - h - 10 + breathe, 44, 40);
  g.fill({ color: config.baseColor });
  g.rect(cx - 25, baseY - h + 5 + breathe, 50, 8);
  g.fill({ color: config.baseColor });

  // Plume on hat
  g.circle(cx, baseY - h - 20 + breathe + Math.sin(breathe) * 2, 8);
  g.fill({ color: config.glowColor });
}

// Draw Pierrot - theatrical, tragic clown, red and black
function drawPierrot(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  emotion: EmotionType,
  config: CharacterConfig
) {
  const h = config.height;

  // Loose theatrical costume (pixel blocks)
  for (let y = 0; y < h - 55; y += 8) {
    const sway = Math.sin(y * 0.1 + breathe * 0.5) * 5;
    const width = 45 + Math.sin(y * 0.06) * 15;
    g.rect(cx - width / 2 + sway, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: y % 16 < 8 ? config.baseColor : 0x2a0a0a });
  }

  // Ruffled collar
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const rx = Math.cos(angle) * 35;
    const ry = Math.sin(angle) * 15;
    g.circle(cx + rx, baseY - h + 60 + ry + breathe, 10);
    g.fill({ color: config.accentColor, alpha: 0.8 });
  }

  // Head - white face
  g.circle(cx, baseY - h + 30 + breathe, 26);
  g.fill({ color: 0xffffff });

  // Tragic eyes - always slightly sad
  const tearDrop = emotion === 'sad' || emotion === 'fearful';

  // Eye shapes (diamonds for theatrical look)
  g.moveTo(cx - 12, baseY - h + 22 + breathe);
  g.lineTo(cx - 6, baseY - h + 28 + breathe);
  g.lineTo(cx - 12, baseY - h + 34 + breathe);
  g.lineTo(cx - 18, baseY - h + 28 + breathe);
  g.fill({ color: 0x000000 });

  g.moveTo(cx + 12, baseY - h + 22 + breathe);
  g.lineTo(cx + 18, baseY - h + 28 + breathe);
  g.lineTo(cx + 12, baseY - h + 34 + breathe);
  g.lineTo(cx + 6, baseY - h + 28 + breathe);
  g.fill({ color: 0x000000 });

  // Red pupils
  g.circle(cx - 12, baseY - h + 28 + breathe, 3);
  g.circle(cx + 12, baseY - h + 28 + breathe, 3);
  g.fill({ color: config.accentColor });

  // Tear drop
  if (tearDrop) {
    g.moveTo(cx - 12, baseY - h + 36 + breathe);
    g.lineTo(cx - 14, baseY - h + 44 + breathe);
    g.lineTo(cx - 10, baseY - h + 44 + breathe);
    g.fill({ color: config.accentColor });
  }

  // Mouth - painted frown or grimace
  if (emotion === 'angry') {
    g.moveTo(cx - 10, baseY - h + 45 + breathe);
    g.quadraticCurveTo(cx, baseY - h + 38 + breathe, cx + 10, baseY - h + 45 + breathe);
    g.stroke({ color: config.accentColor, width: 3 });
  } else {
    g.moveTo(cx - 10, baseY - h + 42 + breathe);
    g.quadraticCurveTo(cx, baseY - h + 50 + breathe, cx + 10, baseY - h + 42 + breathe);
    g.stroke({ color: 0x000000, width: 3 });
  }

  // Pointed hat
  g.moveTo(cx - 20, baseY - h + 8 + breathe);
  g.lineTo(cx, baseY - h - 40 + breathe);
  g.lineTo(cx + 20, baseY - h + 8 + breathe);
  g.fill({ color: config.baseColor });

  // Pom-pom on hat
  g.circle(cx, baseY - h - 45 + breathe + Math.sin(breathe) * 3, 8);
  g.fill({ color: config.accentColor });
}
