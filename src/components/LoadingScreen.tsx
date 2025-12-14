/**
 * LoadingScreen - Displays while assets are being preloaded
 * Matches the game's gothic visual style
 */

import React from 'react';
import type { PreloadProgress } from '@/hooks/useAssetPreloader';

interface LoadingScreenProps {
  progress: PreloadProgress;
  error?: string | null;
  onRetry?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  error,
  onRetry,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Title */}
        <h1 style={styles.title}>THE BLACK PARADE</h1>
        <h2 style={styles.subtitle}>CARRY ON</h2>

        {/* Loading bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress.percentage}%`,
              }}
            />
          </div>
          <div style={styles.progressText}>
            {error ? (
              <span style={styles.errorText}>{error}</span>
            ) : (
              <>
                Loading... {progress.percentage}%
                {progress.currentAsset && (
                  <span style={styles.assetName}>{progress.currentAsset}</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Retry button on error */}
        {error && onRetry && (
          <button style={styles.retryButton} onClick={onRetry}>
            Retry
          </button>
        )}

        {/* Decorative skull */}
        <div style={styles.skull}>&#9760;</div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Playfair Display", Georgia, serif',
  },
  content: {
    textAlign: 'center',
    color: '#f5f5f0',
    padding: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '0.3em',
    marginBottom: '0.5rem',
    textShadow: '0 0 20px rgba(139, 0, 0, 0.5)',
    color: '#fff',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: 400,
    letterSpacing: '0.5em',
    marginBottom: '3rem',
    color: '#8b0000',
  },
  progressContainer: {
    width: '300px',
    margin: '0 auto',
  },
  progressTrack: {
    height: '4px',
    background: '#333',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #8b0000, #cc0000)',
    transition: 'width 0.3s ease',
  },
  progressText: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#888',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  assetName: {
    fontSize: '0.75rem',
    color: '#555',
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#cc0000',
  },
  retryButton: {
    marginTop: '1.5rem',
    padding: '0.75rem 2rem',
    background: 'transparent',
    border: '1px solid #8b0000',
    color: '#f5f5f0',
    fontSize: '1rem',
    cursor: 'pointer',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
  },
  skull: {
    marginTop: '3rem',
    fontSize: '2rem',
    opacity: 0.3,
  },
};
