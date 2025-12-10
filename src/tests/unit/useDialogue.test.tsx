/**
 * Unit tests for useDialogue hook
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDialogue } from '@/hooks/useDialogue';
import type { DialogueSequence } from '@/types/game';

const mockSequence: DialogueSequence = {
  id: 'test-sequence',
  sceneId: 'draag-opening',
  startNodeId: 'node-1',
  nodes: [
    {
      id: 'node-1',
      speaker: 'narrator',
      text: 'This is the first node.',
      nextDialogueId: 'node-2'
    },
    {
      id: 'node-2',
      speaker: 'the-clerk',
      text: 'This is the second node.',
      choices: [
        { id: 'choice-a', text: 'Choice A', nextDialogueId: 'node-3' },
        { id: 'choice-b', text: 'Choice B', nextDialogueId: 'node-4' }
      ]
    },
    {
      id: 'node-3',
      speaker: 'narrator',
      text: 'You chose A.'
    },
    {
      id: 'node-4',
      speaker: 'narrator',
      text: 'You chose B.'
    }
  ]
};

describe('useDialogue', () => {
  it('should start with the first node', () => {
    const { result } = renderHook(() => useDialogue(mockSequence));

    expect(result.current.currentNode?.id).toBe('node-1');
  });

  it('should start typing immediately', async () => {
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 1 })
    );

    // Should start in typing state
    expect(result.current.isTyping).toBe(true);

    // Wait for typing to complete
    await waitFor(() => {
      expect(result.current.isTyping).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.displayedText).toBe('This is the first node.');
  });

  it('should skip typing when skipTyping is called', async () => {
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 100 })
    );

    expect(result.current.isTyping).toBe(true);

    act(() => {
      result.current.skipTyping();
    });

    expect(result.current.isTyping).toBe(false);
    expect(result.current.displayedText).toBe('This is the first node.');
  });

  it('should advance to next node', async () => {
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 1 })
    );

    // Wait for typing to complete
    await waitFor(() => {
      expect(result.current.isTyping).toBe(false);
    });

    // Advance
    act(() => {
      result.current.advance();
    });

    expect(result.current.currentNode?.id).toBe('node-2');
  });

  it('should not auto-advance when there are choices', async () => {
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 1 })
    );

    // Wait and advance to node with choices
    await waitFor(() => expect(result.current.isTyping).toBe(false));

    act(() => {
      result.current.advance();
    });

    await waitFor(() => expect(result.current.isTyping).toBe(false));

    // Should be on node-2 with choices
    expect(result.current.currentNode?.id).toBe('node-2');
    expect(result.current.choices).toHaveLength(2);

    // Trying to advance should not work
    act(() => {
      result.current.advance();
    });

    expect(result.current.currentNode?.id).toBe('node-2');
  });

  it('should handle choice selection', async () => {
    const onChoiceMade = vi.fn();
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 1, onChoiceMade })
    );

    // Navigate to node with choices
    await waitFor(() => expect(result.current.isTyping).toBe(false));

    act(() => {
      result.current.advance();
    });

    await waitFor(() => expect(result.current.isTyping).toBe(false));

    // Select choice A
    act(() => {
      result.current.selectChoice('choice-a');
    });

    expect(onChoiceMade).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'choice-a' })
    );
    expect(result.current.currentNode?.id).toBe('node-3');
  });

  it('should call onSequenceEnd when dialogue ends', async () => {
    const onSequenceEnd = vi.fn();
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 1, onSequenceEnd })
    );

    // Navigate through sequence
    await waitFor(() => expect(result.current.isTyping).toBe(false));

    act(() => {
      result.current.advance(); // to node-2
    });

    await waitFor(() => expect(result.current.isTyping).toBe(false));

    act(() => {
      result.current.selectChoice('choice-a'); // to node-3
    });

    await waitFor(() => expect(result.current.isTyping).toBe(false));

    act(() => {
      result.current.advance(); // end
    });

    expect(onSequenceEnd).toHaveBeenCalled();
  });

  it('should handle null sequence', () => {
    const { result } = renderHook(() => useDialogue(null));

    expect(result.current.currentNode).toBeNull();
    expect(result.current.displayedText).toBe('');
    expect(result.current.choices).toEqual([]);
  });

  it('should reset dialogue', async () => {
    const { result } = renderHook(() =>
      useDialogue(mockSequence, { typewriterSpeed: 1 })
    );

    // Navigate forward
    await waitFor(() => expect(result.current.isTyping).toBe(false));

    act(() => {
      result.current.advance();
    });

    expect(result.current.currentNode?.id).toBe('node-2');

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentNode?.id).toBe('node-1');
  });
});
