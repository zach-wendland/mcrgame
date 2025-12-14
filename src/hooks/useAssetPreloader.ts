/**
 * Asset Preloader Hook
 * Preloads sprite sheets and other assets before the game starts
 * Prevents pop-in and ensures smooth gameplay
 */

import { useState, useEffect, useCallback } from 'react';
import { CHARACTER_SPRITES } from '@/utils/spriteSheet';

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset: string;
}

export interface UseAssetPreloaderReturn {
  ready: boolean;
  progress: PreloadProgress;
  error: string | null;
  retry: () => void;
}

// Cache for loaded images to prevent reloading
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Load a single image with caching
 */
function loadImage(path: string): Promise<HTMLImageElement> {
  // Return cached image if available
  if (imageCache.has(path)) {
    return Promise.resolve(imageCache.get(path)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(path, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load: ${path}`));
    img.src = path;
  });
}

/**
 * Get unique sprite sheet paths from character configs
 */
function getAssetPaths(): string[] {
  const paths = new Set<string>();

  // Add all sprite sheet paths
  for (const config of Object.values(CHARACTER_SPRITES)) {
    paths.add(config.spriteSheet.imagePath);
  }

  return Array.from(paths);
}

/**
 * Hook for preloading game assets
 */
export function useAssetPreloader(): UseAssetPreloaderReturn {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
    currentAsset: '',
  });
  const [loadAttempt, setLoadAttempt] = useState(0);

  const loadAssets = useCallback(async () => {
    const assets = getAssetPaths();
    const total = assets.length;

    if (total === 0) {
      setReady(true);
      return;
    }

    setProgress({
      loaded: 0,
      total,
      percentage: 0,
      currentAsset: assets[0] || '',
    });

    let loadedCount = 0;
    const errors: string[] = [];

    for (const path of assets) {
      setProgress(prev => ({
        ...prev,
        currentAsset: path.split('/').pop() || path,
      }));

      try {
        await loadImage(path);
        loadedCount++;
        setProgress(prev => ({
          ...prev,
          loaded: loadedCount,
          percentage: Math.round((loadedCount / total) * 100),
        }));
      } catch (e) {
        // Log but don't fail - some sprites may be missing
        console.warn(`Asset preload warning: ${path}`);
        errors.push(path);
        loadedCount++;
        setProgress(prev => ({
          ...prev,
          loaded: loadedCount,
          percentage: Math.round((loadedCount / total) * 100),
        }));
      }
    }

    // The game has procedural fallback rendering for missing sprites
    // Always proceed - sprites are optional enhancement, not required
    setReady(true);
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets, loadAttempt]);

  const retry = useCallback(() => {
    setReady(false);
    setError(null);
    setLoadAttempt(prev => prev + 1);
  }, []);

  return { ready, progress, error, retry };
}

/**
 * Get a cached image (for use after preloading)
 */
export function getCachedImage(path: string): HTMLImageElement | null {
  return imageCache.get(path) || null;
}
