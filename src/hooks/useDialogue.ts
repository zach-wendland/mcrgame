/**
 * React hook for dialogue system management
 */

import { useState, useCallback, useEffect } from 'react';
import type { DialogueNode, DialogueSequence, DialogueChoice } from '@/types/game';

interface UseDialogueReturn {
  currentNode: DialogueNode | null;
  isTyping: boolean;
  displayedText: string;
  choices: DialogueChoice[];
  advance: () => void;
  selectChoice: (choiceId: string) => DialogueChoice | null;
  skipTyping: () => void;
  reset: () => void;
}

interface UseDialogueOptions {
  typewriterSpeed?: number; // ms per character
  onNodeChange?: (node: DialogueNode | null) => void;
  onSequenceEnd?: () => void;
  onChoiceMade?: (choice: DialogueChoice) => void;
}

export function useDialogue(
  sequence: DialogueSequence | null,
  options: UseDialogueOptions = {}
): UseDialogueReturn {
  const {
    typewriterSpeed = 30,
    onNodeChange,
    onSequenceEnd,
    onChoiceMade
  } = options;

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Get current node from sequence
  const currentNode = sequence?.nodes.find(n => n.id === currentNodeId) ?? null;

  // Initialize when sequence changes
  useEffect(() => {
    if (sequence) {
      setCurrentNodeId(sequence.startNodeId);
    } else {
      setCurrentNodeId(null);
      setDisplayedText('');
    }
  }, [sequence]);

  // Typewriter effect
  useEffect(() => {
    if (!currentNode) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    const text = currentNode.text;
    const speed = currentNode.effect?.typewriterSpeed === 'slow' ? 60
      : currentNode.effect?.typewriterSpeed === 'fast' ? 15
      : typewriterSpeed;

    setDisplayedText('');
    setIsTyping(true);
    onNodeChange?.(currentNode);

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [currentNode, typewriterSpeed, onNodeChange]);

  // Skip typewriter effect
  const skipTyping = useCallback(() => {
    if (currentNode && isTyping) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
    }
  }, [currentNode, isTyping]);

  // Advance to next dialogue (only if no choices)
  const advance = useCallback(() => {
    if (isTyping) {
      skipTyping();
      return;
    }

    if (!currentNode) return;

    // If there are choices, can't auto-advance
    if (currentNode.choices && currentNode.choices.length > 0) {
      return;
    }

    // Move to next node
    if (currentNode.nextDialogueId) {
      setCurrentNodeId(currentNode.nextDialogueId);
    } else {
      // End of sequence
      setCurrentNodeId(null);
      setDisplayedText('');
      onSequenceEnd?.();
    }
  }, [currentNode, isTyping, skipTyping, onSequenceEnd]);

  // Select a choice
  const selectChoice = useCallback((choiceId: string): DialogueChoice | null => {
    if (!currentNode?.choices) return null;

    const choice = currentNode.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    // Check availability
    if (choice.isAvailable === false) return null;

    onChoiceMade?.(choice);

    // Navigate to next dialogue
    if (choice.nextDialogueId) {
      setCurrentNodeId(choice.nextDialogueId);
    } else if (currentNode.nextDialogueId) {
      setCurrentNodeId(currentNode.nextDialogueId);
    } else {
      setCurrentNodeId(null);
      setDisplayedText('');
      onSequenceEnd?.();
    }

    return choice;
  }, [currentNode, onChoiceMade, onSequenceEnd]);

  // Reset dialogue
  const reset = useCallback(() => {
    if (sequence) {
      setCurrentNodeId(sequence.startNodeId);
    } else {
      setCurrentNodeId(null);
    }
    setDisplayedText('');
    setIsTyping(false);
  }, [sequence]);

  // Get available choices
  const choices = currentNode?.choices?.filter(c => c.isAvailable !== false) ?? [];

  return {
    currentNode,
    isTyping,
    displayedText,
    choices,
    advance,
    selectChoice,
    skipTyping,
    reset
  };
}
