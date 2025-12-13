/**
 * PixiBackground - Pixi.js canvas for animated background effects
 * Renders atmospheric particles and dynamic visual elements
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Application, Graphics } from 'pixi.js';
import type { SceneId } from '@/types/game';
import styles from './Scene.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: number;
  life: number;
  maxLife: number;
}

interface SceneConfig {
  particleCount: number;
  particleColor: number;
  particleSize: { min: number; max: number };
  particleSpeed: { min: number; max: number };
  particleAlpha: { min: number; max: number };
  direction: 'up' | 'down' | 'random';
  additionalEffects?: 'searchlight' | 'glow' | 'dust';
}

const SCENE_CONFIGS: Record<SceneId, SceneConfig> = {
  'title': {
    particleCount: 30,
    particleColor: 0xffffff,
    particleSize: { min: 1, max: 3 },
    particleSpeed: { min: 0.2, max: 0.8 },
    particleAlpha: { min: 0.1, max: 0.4 },
    direction: 'up',
  },
  'draag-opening': {
    particleCount: 50,
    particleColor: 0xff4444,
    particleSize: { min: 1, max: 4 },
    particleSpeed: { min: 0.3, max: 1.2 },
    particleAlpha: { min: 0.2, max: 0.6 },
    direction: 'up',
    additionalEffects: 'searchlight',
  },
  'parade-memory': {
    particleCount: 40,
    particleColor: 0xffd700,
    particleSize: { min: 1, max: 3 },
    particleSpeed: { min: 0.1, max: 0.5 },
    particleAlpha: { min: 0.15, max: 0.4 },
    direction: 'down',
    additionalEffects: 'dust',
  },
  'pierrot-confrontation': {
    particleCount: 60,
    particleColor: 0x8b0000,
    particleSize: { min: 2, max: 5 },
    particleSpeed: { min: 0.5, max: 1.5 },
    particleAlpha: { min: 0.3, max: 0.7 },
    direction: 'random',
    additionalEffects: 'glow',
  },
};

interface PixiBackgroundProps {
  sceneId: SceneId;
  isActive?: boolean;
}

export const PixiBackground: React.FC<PixiBackgroundProps> = ({
  sceneId,
  isActive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const graphicsRef = useRef<Graphics | null>(null);
  const searchlightRef = useRef<{ angle: number; speed: number }>({ angle: 0, speed: 0.005 });

  const createParticle = useCallback((width: number, height: number, config: SceneConfig): Particle => {
    const speed = config.particleSpeed.min + Math.random() * (config.particleSpeed.max - config.particleSpeed.min);
    let vx = 0;
    let vy = 0;

    switch (config.direction) {
      case 'up':
        vy = -speed;
        vx = (Math.random() - 0.5) * speed * 0.5;
        break;
      case 'down':
        vy = speed;
        vx = (Math.random() - 0.5) * speed * 0.5;
        break;
      case 'random':
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        break;
    }

    const maxLife = 200 + Math.random() * 300;

    return {
      x: Math.random() * width,
      y: config.direction === 'up' ? height + 10 : config.direction === 'down' ? -10 : Math.random() * height,
      vx,
      vy,
      size: config.particleSize.min + Math.random() * (config.particleSize.max - config.particleSize.min),
      alpha: config.particleAlpha.min + Math.random() * (config.particleAlpha.max - config.particleAlpha.min),
      color: config.particleColor,
      life: maxLife,
      maxLife,
    };
  }, []);

  const initParticles = useCallback((width: number, height: number, config: SceneConfig) => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const particle = createParticle(width, height, config);
      // Distribute initial particles across the screen
      particle.y = Math.random() * height;
      particle.life = Math.random() * particle.maxLife;
      particlesRef.current.push(particle);
    }
  }, [createParticle]);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const config = SCENE_CONFIGS[sceneId];
    let animationId: number;
    let isDestroyed = false;

    const initPixi = async () => {
      // Create Pixi application
      const app = new Application();

      await app.init({
        resizeTo: containerRef.current!,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (isDestroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      containerRef.current!.appendChild(app.canvas);

      // Create graphics for particles
      const graphics = new Graphics();
      app.stage.addChild(graphics);
      graphicsRef.current = graphics;

      // Initialize particles
      initParticles(app.screen.width, app.screen.height, config);

      // Animation loop
      const animate = () => {
        if (isDestroyed || !graphicsRef.current || !appRef.current) return;

        const g = graphicsRef.current;
        const width = appRef.current.screen.width;
        const height = appRef.current.screen.height;

        g.clear();

        // Draw searchlight effect for draag scene
        if (config.additionalEffects === 'searchlight') {
          searchlightRef.current.angle += searchlightRef.current.speed;
          const beamX = width / 2 + Math.sin(searchlightRef.current.angle) * (width * 0.3);

          // Draw beam
          g.moveTo(beamX, 0);
          g.lineTo(beamX - 100, height);
          g.lineTo(beamX + 100, height);
          g.lineTo(beamX, 0);
          g.fill({ color: 0xffffff, alpha: 0.03 });
        }

        // Draw glow effect for pierrot scene
        if (config.additionalEffects === 'glow') {
          const pulseAlpha = 0.05 + Math.sin(Date.now() * 0.002) * 0.03;
          g.circle(width / 2, height / 2, Math.min(width, height) * 0.4);
          g.fill({ color: 0x8b0000, alpha: pulseAlpha });
        }

        // Update and draw particles
        particlesRef.current.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life--;

          // Fade based on life
          const lifeRatio = particle.life / particle.maxLife;
          const currentAlpha = particle.alpha * lifeRatio;

          // Draw particle
          g.circle(particle.x, particle.y, particle.size);
          g.fill({ color: particle.color, alpha: currentAlpha });

          // Reset particle if dead or off screen
          if (particle.life <= 0 || particle.y < -20 || particle.y > height + 20 ||
              particle.x < -20 || particle.x > width + 20) {
            particlesRef.current[index] = createParticle(width, height, config);
          }
        });

        animationId = requestAnimationFrame(animate);
      };

      animate();
    };

    initPixi();

    // Handle resize
    const handleResize = () => {
      if (appRef.current) {
        appRef.current.resize();
        initParticles(appRef.current.screen.width, appRef.current.screen.height, config);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDestroyed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
      graphicsRef.current = null;
      particlesRef.current = [];
    };
  }, [sceneId, isActive, createParticle, initParticles]);

  if (!isActive) return null;

  return <div ref={containerRef} className={styles.pixiCanvas} />;
};
