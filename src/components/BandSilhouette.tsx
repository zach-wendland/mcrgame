/**
 * BandSilhouette - Shows shadowy band figures during narrator sections in Scene 1
 * Adds visual interest when no character is speaking
 */

import React, { useRef, useEffect } from 'react';
import { Application, Graphics, Container } from 'pixi.js';

interface BandSilhouetteProps {
  isActive: boolean;
  sceneId: string;
}

export const BandSilhouette: React.FC<BandSilhouetteProps> = ({
  isActive,
  sceneId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  // Only show in draag-opening scene
  const shouldShow = isActive && sceneId === 'draag-opening';

  useEffect(() => {
    if (!containerRef.current || !shouldShow) return;

    let isDestroyed = false;
    let animationId: number;
    let time = 0;

    const initPixi = async () => {
      const app = new Application();

      await app.init({
        width: 400,
        height: 200,
        backgroundAlpha: 0,
        antialias: false,
        resolution: 1,
      });

      if (isDestroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      containerRef.current!.appendChild(app.canvas);

      const band = new Container();
      app.stage.addChild(band);

      // Draw 5 band member silhouettes
      const drawBand = () => {
        band.removeChildren();
        const g = new Graphics();
        band.addChild(g);

        const positions = [50, 120, 200, 280, 350];
        const heights = [140, 160, 150, 155, 145];

        positions.forEach((x, i) => {
          const h = heights[i]!;
          const breathe = Math.sin(time * 0.02 + i * 0.5) * 2;
          const baseY = 180;

          // Body silhouette
          g.beginPath();
          g.moveTo(x - 15, baseY);
          g.lineTo(x - 20, baseY - h * 0.4 + breathe);
          g.lineTo(x - 18, baseY - h * 0.7 + breathe);
          g.lineTo(x - 8, baseY - h + breathe);
          g.lineTo(x + 8, baseY - h + breathe);
          g.lineTo(x + 18, baseY - h * 0.7 + breathe);
          g.lineTo(x + 20, baseY - h * 0.4 + breathe);
          g.lineTo(x + 15, baseY);
          g.closePath();
          g.fill({ color: 0x0a0a0a, alpha: 0.6 + Math.sin(time * 0.03 + i) * 0.1 });

          // Head
          g.circle(x, baseY - h - 12 + breathe, 12);
          g.fill({ color: 0x0a0a0a, alpha: 0.7 });

          // Subtle glow behind
          g.circle(x, baseY - h * 0.5, 30);
          g.fill({ color: 0x8b0000, alpha: 0.05 + Math.sin(time * 0.01 + i) * 0.02 });
        });
      };

      const animate = () => {
        if (isDestroyed) return;
        time++;
        drawBand();
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
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        opacity: 0.8,
        zIndex: 2,
      }}
    />
  );
};
