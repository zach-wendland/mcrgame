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
  features: 'clerk' | 'patient' | 'death' | 'pierrot' | 'lead-singer' | 'drummer' | 'lead-guitarist' | 'rhythm-guitarist' | 'bassist';
}

// Characters that don't have pixel art (no sprites)
const NO_SPRITE_CHARACTERS = ['narrator', 'crowd'];

const CHARACTER_CONFIGS: Partial<Record<CharacterId, CharacterConfig>> = {
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
  // === THE BLACK PARADE BAND MEMBERS ===
  'the-lead-singer': {
    baseColor: 0x0a0a0a,        // Black military coat
    accentColor: 0xffffff,      // White face paint
    glowColor: 0xcc0000,        // Red accent
    height: 260,
    features: 'lead-singer',
  },
  'the-drummer': {
    baseColor: 0x1a1a1a,        // Dark uniform
    accentColor: 0xfff8dc,      // Bone white
    glowColor: 0x8b0000,        // Blood red
    height: 270,
    features: 'drummer',
  },
  'the-lead-guitarist': {
    baseColor: 0x0f0f0f,        // Black
    accentColor: 0xffffff,      // White face
    glowColor: 0xff3333,        // Bright red
    height: 265,
    features: 'lead-guitarist',
  },
  'the-rhythm-guitarist': {
    baseColor: 0x0f0f0f,        // Black (mirror of lead)
    accentColor: 0xffffff,      // White face
    glowColor: 0xff3333,        // Bright red
    height: 265,
    features: 'rhythm-guitarist',
  },
  'the-bassist': {
    baseColor: 0x050505,        // Deepest black
    accentColor: 0xe0e0e0,      // Pale gray
    glowColor: 0x660000,        // Dark red
    height: 275,
    features: 'bassist',
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
    if (NO_SPRITE_CHARACTERS.includes(characterId)) return;

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
          // Band members
          case 'lead-singer':
            drawLeadSinger(g, centerX, baseY, breatheOffset, emotion, config, time);
            break;
          case 'drummer':
            drawDrummer(g, centerX, baseY, breatheOffset, emotion, config, time);
            break;
          case 'lead-guitarist':
            drawLeadGuitarist(g, centerX, baseY, breatheOffset, emotion, config, time);
            break;
          case 'rhythm-guitarist':
            drawRhythmGuitarist(g, centerX, baseY, breatheOffset, emotion, config, time);
            break;
          case 'bassist':
            drawBassist(g, centerX, baseY, breatheOffset, emotion, config, time);
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

  if (!isActive || NO_SPRITE_CHARACTERS.includes(characterId)) {
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

// ==========================================
// THE BLACK PARADE BAND MEMBERS
// ==========================================

// Draw The Lead Singer - charismatic front man, military parade leader aesthetic
function drawLeadSinger(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  emotion: EmotionType,
  config: CharacterConfig,
  time: number
) {
  const h = config.height;
  const sway = Math.sin(time * 0.04) * 3; // Slight performer sway

  // Military coat with tails (pixel blocks)
  for (let y = 0; y < h - 60; y += 8) {
    const width = 42 + Math.sin(y * 0.05) * 8;
    const xOffset = y > h - 120 ? sway * (y / h) : 0;
    g.rect(cx - width / 2 + xOffset, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Coat tails (flaring out)
  for (let i = -1; i <= 1; i += 2) {
    g.moveTo(cx + i * 15, baseY - 8);
    g.lineTo(cx + i * 25, baseY + 20);
    g.lineTo(cx + i * 20, baseY + 20);
    g.lineTo(cx + i * 10, baseY - 8);
    g.fill({ color: config.baseColor });
  }

  // Epaulettes with fringe
  g.rect(cx - 40, baseY - h + 65 + breathe, 18, 10);
  g.rect(cx + 22, baseY - h + 65 + breathe, 18, 10);
  g.fill({ color: 0xc0c0c0 });

  // Fringe on epaulettes
  for (let i = 0; i < 4; i++) {
    g.rect(cx - 38 + i * 4, baseY - h + 75 + breathe, 2, 8);
    g.rect(cx + 24 + i * 4, baseY - h + 75 + breathe, 2, 8);
    g.fill({ color: 0xffd700 });
  }

  // Medals/decorations
  for (let i = 0; i < 3; i++) {
    g.circle(cx - 12 + i * 12, baseY - h + 95 + breathe, 5);
    g.fill({ color: i === 1 ? 0xffd700 : config.glowColor });
  }

  // Head with death mask makeup
  g.circle(cx + sway * 0.5, baseY - h + 32 + breathe, 24);
  g.fill({ color: config.accentColor });

  // Black around eyes (death mask style)
  g.circle(cx - 8 + sway * 0.5, baseY - h + 28 + breathe, 10);
  g.circle(cx + 8 + sway * 0.5, baseY - h + 28 + breathe, 10);
  g.fill({ color: 0x000000 });

  // Eyes - intense, burning
  const eyeGlow = 0.6 + Math.sin(time * 0.1) * 0.2;
  g.circle(cx - 8 + sway * 0.5, baseY - h + 28 + breathe, 4);
  g.circle(cx + 8 + sway * 0.5, baseY - h + 28 + breathe, 4);
  g.fill({ color: config.glowColor, alpha: eyeGlow });

  // Mouth expression based on emotion
  if (emotion === 'angry') {
    // Open mouth, singing/shouting
    g.ellipse(cx + sway * 0.5, baseY - h + 42 + breathe, 8, 6);
    g.fill({ color: 0x000000 });
  } else {
    // Slight grimace
    g.moveTo(cx - 8 + sway * 0.5, baseY - h + 42 + breathe);
    g.lineTo(cx + 8 + sway * 0.5, baseY - h + 40 + breathe);
    g.stroke({ color: 0x000000, width: 2 });
  }

  // Hair - messy, dark
  for (let i = -3; i <= 3; i++) {
    const hairY = baseY - h + 8 + breathe + Math.sin(time * 0.05 + i) * 2;
    g.moveTo(cx + i * 6 + sway * 0.5, baseY - h + 12 + breathe);
    g.lineTo(cx + i * 8 + sway * 0.5, hairY - 10);
    g.stroke({ color: 0x1a1a1a, width: 4 });
  }

  // Microphone in hand
  g.rect(cx + 25 + sway, baseY - h + 90 + breathe, 4, 25);
  g.fill({ color: 0x333333 });
  g.circle(cx + 27 + sway, baseY - h + 88 + breathe, 6);
  g.fill({ color: 0x444444 });
}

// Draw The Drummer - skeletal figure hunched over drums
function drawDrummer(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  _emotion: EmotionType,
  config: CharacterConfig,
  time: number
) {
  void _emotion; // Drummer maintains intense focus
  const h = config.height;
  const drumHit = Math.abs(Math.sin(time * 0.15)) * 3; // Drumming motion

  // Hunched body (pixel blocks)
  for (let y = 0; y < h - 80; y += 8) {
    const width = 45 + Math.sin(y * 0.04) * 10;
    const hunch = y > h - 150 ? (y - (h - 150)) * 0.1 : 0;
    g.rect(cx - width / 2 + hunch, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Arms reaching forward (to drums)
  // Left arm
  g.moveTo(cx - 25, baseY - h + 100 + breathe);
  g.lineTo(cx - 40, baseY - h + 130 + breathe - drumHit);
  g.stroke({ color: config.baseColor, width: 8 });

  // Right arm
  g.moveTo(cx + 25, baseY - h + 100 + breathe);
  g.lineTo(cx + 40, baseY - h + 130 + breathe + drumHit);
  g.stroke({ color: config.baseColor, width: 8 });

  // Drumsticks
  g.moveTo(cx - 40, baseY - h + 130 + breathe - drumHit);
  g.lineTo(cx - 30, baseY - h + 160 + breathe - drumHit * 2);
  g.stroke({ color: 0x8b4513, width: 3 });

  g.moveTo(cx + 40, baseY - h + 130 + breathe + drumHit);
  g.lineTo(cx + 30, baseY - h + 160 + breathe + drumHit * 2);
  g.stroke({ color: 0x8b4513, width: 3 });

  // Skull head (skeletal)
  g.circle(cx, baseY - h + 45 + breathe, 26);
  g.fill({ color: config.accentColor });

  // Deep eye sockets
  g.circle(cx - 10, baseY - h + 40 + breathe, 9);
  g.circle(cx + 10, baseY - h + 40 + breathe, 9);
  g.fill({ color: 0x000000 });

  // Red glowing eyes
  const eyePulse = 0.5 + Math.sin(time * 0.08) * 0.3;
  g.circle(cx - 10, baseY - h + 40 + breathe, 4);
  g.circle(cx + 10, baseY - h + 40 + breathe, 4);
  g.fill({ color: config.glowColor, alpha: eyePulse });

  // Nose hole
  g.moveTo(cx, baseY - h + 50 + breathe);
  g.lineTo(cx - 4, baseY - h + 57 + breathe);
  g.lineTo(cx + 4, baseY - h + 57 + breathe);
  g.fill({ color: 0x000000 });

  // Teeth (grinning skull)
  for (let i = -3; i <= 3; i++) {
    g.rect(cx + i * 4 - 1.5, baseY - h + 62 + breathe, 3, 7);
    g.fill({ color: config.accentColor });
  }

  // Drum kit suggestion (simplified)
  g.ellipse(cx, baseY - h + 170 + breathe, 35, 15);
  g.fill({ color: 0x2a2a2a });
  g.ellipse(cx, baseY - h + 165 + breathe, 35, 12);
  g.stroke({ color: config.glowColor, width: 2 });
}

// Draw The Lead Guitarist - twin #1, aggressive stance
function drawLeadGuitarist(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  emotion: EmotionType,
  config: CharacterConfig,
  time: number
) {
  const h = config.height;
  const rockMotion = Math.sin(time * 0.06) * 4;

  // Body leaning into guitar
  for (let y = 0; y < h - 55; y += 8) {
    const width = 40 + Math.sin(y * 0.05) * 8;
    const lean = y > h - 150 ? -(y - (h - 150)) * 0.05 : 0;
    g.rect(cx - width / 2 + lean, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Shoulders
  g.rect(cx - 38, baseY - h + 60 + breathe, 76, 14);
  g.fill({ color: config.baseColor });

  // Guitar body (Les Paul style shape)
  const guitarX = cx - 20 + rockMotion;
  const guitarY = baseY - h + 130 + breathe;

  // Guitar body
  g.ellipse(guitarX, guitarY, 22, 28);
  g.fill({ color: 0x8b0000 });
  g.ellipse(guitarX, guitarY - 12, 18, 20);
  g.fill({ color: 0x8b0000 });

  // Guitar neck
  g.rect(guitarX - 4, guitarY - 70, 8, 60);
  g.fill({ color: 0x4a3728 });

  // Guitar strings suggestion
  for (let i = -2; i <= 2; i++) {
    g.moveTo(guitarX + i * 1.5, guitarY - 70);
    g.lineTo(guitarX + i * 1.5, guitarY + 20);
    g.stroke({ color: 0xc0c0c0, width: 1 });
  }

  // Guitar headstock
  g.rect(guitarX - 6, guitarY - 80, 12, 12);
  g.fill({ color: 0x1a1a1a });

  // Head with face paint
  g.circle(cx + 5, baseY - h + 30 + breathe, 22);
  g.fill({ color: config.accentColor });

  // Black eye makeup
  g.circle(cx - 3, baseY - h + 26 + breathe, 8);
  g.circle(cx + 13, baseY - h + 26 + breathe, 8);
  g.fill({ color: 0x000000 });

  // Eyes
  const intensity = emotion === 'angry' ? 1 : 0.7;
  g.circle(cx - 3, baseY - h + 26 + breathe, 3);
  g.circle(cx + 13, baseY - h + 26 + breathe, 3);
  g.fill({ color: config.glowColor, alpha: intensity });

  // Hair - wild, longer on one side
  for (let i = -4; i <= 2; i++) {
    const hairLen = i < 0 ? 20 : 12;
    g.moveTo(cx + 5 + i * 5, baseY - h + 10 + breathe);
    g.lineTo(cx + 5 + i * 7, baseY - h + 10 - hairLen + Math.sin(time * 0.04 + i) * 3 + breathe);
    g.stroke({ color: 0x1a1a1a, width: 5 });
  }

  // Arm on fretboard
  g.moveTo(cx + 20, baseY - h + 70 + breathe);
  g.lineTo(guitarX, guitarY - 50);
  g.stroke({ color: config.baseColor, width: 10 });
}

// Draw The Rhythm Guitarist - twin #2, mirror stance
function drawRhythmGuitarist(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  emotion: EmotionType,
  config: CharacterConfig,
  time: number
) {
  const h = config.height;
  const rockMotion = Math.sin(time * 0.06 + Math.PI) * 4; // Offset from lead

  // Body leaning opposite direction
  for (let y = 0; y < h - 55; y += 8) {
    const width = 40 + Math.sin(y * 0.05) * 8;
    const lean = y > h - 150 ? (y - (h - 150)) * 0.05 : 0; // Opposite lean
    g.rect(cx - width / 2 + lean, baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Shoulders
  g.rect(cx - 38, baseY - h + 60 + breathe, 76, 14);
  g.fill({ color: config.baseColor });

  // Guitar body (SG style - different from lead)
  const guitarX = cx + 20 + rockMotion;
  const guitarY = baseY - h + 130 + breathe;

  // Guitar body (double cutaway)
  g.ellipse(guitarX, guitarY, 20, 25);
  g.fill({ color: 0x1a1a1a });

  // Horns of SG
  g.moveTo(guitarX - 15, guitarY - 20);
  g.lineTo(guitarX - 25, guitarY - 35);
  g.lineTo(guitarX - 10, guitarY - 30);
  g.fill({ color: 0x1a1a1a });

  g.moveTo(guitarX + 15, guitarY - 20);
  g.lineTo(guitarX + 25, guitarY - 35);
  g.lineTo(guitarX + 10, guitarY - 30);
  g.fill({ color: 0x1a1a1a });

  // Guitar neck
  g.rect(guitarX - 4, guitarY - 70, 8, 45);
  g.fill({ color: 0x5a4030 });

  // Strings
  for (let i = -2; i <= 2; i++) {
    g.moveTo(guitarX + i * 1.5, guitarY - 70);
    g.lineTo(guitarX + i * 1.5, guitarY + 15);
    g.stroke({ color: 0xc0c0c0, width: 1 });
  }

  // Head with face paint (mirrored makeup pattern)
  g.circle(cx - 5, baseY - h + 30 + breathe, 22);
  g.fill({ color: config.accentColor });

  // Black eye makeup - opposite pattern
  g.circle(cx - 13, baseY - h + 26 + breathe, 8);
  g.circle(cx + 3, baseY - h + 26 + breathe, 8);
  g.fill({ color: 0x000000 });

  // Eyes
  const intensity = emotion === 'angry' ? 1 : 0.7;
  g.circle(cx - 13, baseY - h + 26 + breathe, 3);
  g.circle(cx + 3, baseY - h + 26 + breathe, 3);
  g.fill({ color: config.glowColor, alpha: intensity });

  // Hair - wild, mirrored style
  for (let i = -2; i <= 4; i++) {
    const hairLen = i > 0 ? 20 : 12;
    g.moveTo(cx - 5 + i * 5, baseY - h + 10 + breathe);
    g.lineTo(cx - 5 + i * 7, baseY - h + 10 - hairLen + Math.sin(time * 0.04 + i) * 3 + breathe);
    g.stroke({ color: 0x1a1a1a, width: 5 });
  }

  // Arm on fretboard
  g.moveTo(cx - 20, baseY - h + 70 + breathe);
  g.lineTo(guitarX, guitarY - 40);
  g.stroke({ color: config.baseColor, width: 10 });
}

// Draw The Bassist - mysterious shadow figure, bass cradled like a child
function drawBassist(
  g: Graphics,
  cx: number,
  baseY: number,
  breathe: number,
  _emotion: EmotionType,
  config: CharacterConfig,
  time: number
) {
  void _emotion; // Bassist is stoic, mysterious
  const h = config.height;
  const subtleSway = Math.sin(time * 0.02) * 2;

  // Tall, thin silhouette
  for (let y = 0; y < h - 55; y += 8) {
    const width = 35 + Math.sin(y * 0.03) * 5;
    g.rect(cx - width / 2 + subtleSway * (y / h), baseY - y - 8 + breathe * (y / h), width, 8);
    g.fill({ color: config.baseColor });
  }

  // Narrow shoulders
  g.rect(cx - 32 + subtleSway, baseY - h + 60 + breathe, 64, 12);
  g.fill({ color: config.baseColor });

  // Bass guitar - held close, cradled
  const bassX = cx - 10 + subtleSway;
  const bassY = baseY - h + 140 + breathe;

  // Bass body (Jazz bass shape)
  g.ellipse(bassX, bassY, 18, 30);
  g.fill({ color: 0x2a1a0a });

  // Bass offset waist
  g.ellipse(bassX + 5, bassY - 8, 14, 22);
  g.fill({ color: 0x2a1a0a });

  // Long bass neck
  g.rect(bassX - 3, bassY - 85, 6, 65);
  g.fill({ color: 0x3a2a1a });

  // Bass strings (4 thick strings)
  for (let i = -1.5; i <= 1.5; i++) {
    g.moveTo(bassX + i * 2, bassY - 85);
    g.lineTo(bassX + i * 2, bassY + 25);
    g.stroke({ color: 0x808080, width: 1.5 });
  }

  // Headstock
  g.rect(bassX - 5, bassY - 95, 10, 12);
  g.fill({ color: 0x1a1a1a });

  // Head - partially obscured, mysterious
  g.circle(cx + subtleSway, baseY - h + 32 + breathe, 22);
  g.fill({ color: config.accentColor, alpha: 0.9 });

  // Shadow across face
  g.rect(cx - 25 + subtleSway, baseY - h + 20 + breathe, 50, 15);
  g.fill({ color: 0x000000, alpha: 0.5 });

  // Eyes barely visible in shadow
  const eyeGlow = 0.4 + Math.sin(time * 0.03) * 0.1;
  g.circle(cx - 8 + subtleSway, baseY - h + 28 + breathe, 3);
  g.circle(cx + 8 + subtleSway, baseY - h + 28 + breathe, 3);
  g.fill({ color: config.glowColor, alpha: eyeGlow });

  // Hair hanging down
  for (let i = -3; i <= 3; i++) {
    g.moveTo(cx + i * 6 + subtleSway, baseY - h + 12 + breathe);
    g.lineTo(cx + i * 5 + subtleSway, baseY - h - 5 + breathe + Math.sin(time * 0.02 + i) * 2);
    g.stroke({ color: 0x0a0a0a, width: 6 });
  }

  // Arm cradling bass
  g.moveTo(cx - 15 + subtleSway, baseY - h + 75 + breathe);
  g.quadraticCurveTo(bassX - 20, bassY - 30, bassX - 5, bassY - 60);
  g.stroke({ color: config.baseColor, width: 12 });
}
