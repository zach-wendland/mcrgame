/**
 * Vitest test setup
 */

import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock localStorage for game state tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Howler for audio tests
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    volume: vi.fn(),
    fade: vi.fn(),
    unload: vi.fn()
  })),
  Howler: {
    ctx: { resume: vi.fn() },
    mute: vi.fn()
  }
}));

// Clean up before each test
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
