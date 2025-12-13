/**
 * Unit tests for dialogue content validity
 */

import { describe, it, expect } from 'vitest';
import {
  draagOpeningDialogue,
  paradeMemoryDialogue,
  pierrotConfrontationDialogue
} from '@/dialogue';
import type { DialogueSequence } from '@/types/game';

function validateSequence(sequence: DialogueSequence) {
  const nodeIds = new Set(sequence.nodes.map(n => n.id));

  // Check start node exists
  expect(nodeIds.has(sequence.startNodeId)).toBe(true);

  // Check all referenced nodes exist
  for (const node of sequence.nodes) {
    if (node.nextDialogueId) {
      expect(
        nodeIds.has(node.nextDialogueId),
        `Node "${node.id}" references non-existent node "${node.nextDialogueId}"`
      ).toBe(true);
    }

    if (node.choices) {
      for (const choice of node.choices) {
        if (choice.nextDialogueId) {
          expect(
            nodeIds.has(choice.nextDialogueId),
            `Choice "${choice.id}" in node "${node.id}" references non-existent node "${choice.nextDialogueId}"`
          ).toBe(true);
        }
      }
    }
  }

  // Check no orphan nodes (except start)
  const reachableNodes = new Set<string>();
  const queue = [sequence.startNodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (reachableNodes.has(currentId)) continue;
    reachableNodes.add(currentId);

    const node = sequence.nodes.find(n => n.id === currentId);
    if (!node) continue;

    if (node.nextDialogueId) {
      queue.push(node.nextDialogueId);
    }

    if (node.choices) {
      for (const choice of node.choices) {
        if (choice.nextDialogueId) {
          queue.push(choice.nextDialogueId);
        }
      }
    }
  }

  // All nodes should be reachable (warning only, not failure)
  const unreachable = sequence.nodes
    .filter(n => !reachableNodes.has(n.id))
    .map(n => n.id);

  if (unreachable.length > 0) {
    console.warn(`Unreachable nodes in ${sequence.id}: ${unreachable.join(', ')}`);
  }
}

function hasEndingNode(sequence: DialogueSequence): boolean {
  return sequence.nodes.some(
    node => !node.nextDialogueId && (!node.choices || node.choices.length === 0)
  );
}

describe('Dialogue Sequences', () => {
  describe('draagOpeningDialogue', () => {
    it('should have valid structure', () => {
      expect(draagOpeningDialogue.id).toBe('draag-opening');
      expect(draagOpeningDialogue.sceneId).toBe('draag-opening');
      expect(draagOpeningDialogue.nodes.length).toBeGreaterThan(0);
    });

    it('should have valid node references', () => {
      validateSequence(draagOpeningDialogue);
    });

    it('should have at least one ending node', () => {
      expect(hasEndingNode(draagOpeningDialogue)).toBe(true);
    });

    it('should have player choices', () => {
      const nodesWithChoices = draagOpeningDialogue.nodes.filter(
        n => n.choices && n.choices.length > 0
      );
      expect(nodesWithChoices.length).toBeGreaterThan(0);
    });

    it('should include key characters', () => {
      const speakers = new Set(draagOpeningDialogue.nodes.map(n => n.speaker));
      expect(speakers.has('the-clerk')).toBe(true);
      expect(speakers.has('narrator')).toBe(true);
    });
  });

  describe('paradeMemoryDialogue', () => {
    it('should have valid structure', () => {
      expect(paradeMemoryDialogue.id).toBe('parade-memory');
      expect(paradeMemoryDialogue.sceneId).toBe('parade-memory');
      expect(paradeMemoryDialogue.nodes.length).toBeGreaterThan(0);
    });

    it('should have valid node references', () => {
      validateSequence(paradeMemoryDialogue);
    });

    it('should have at least one ending node', () => {
      expect(hasEndingNode(paradeMemoryDialogue)).toBe(true);
    });

    it('should include Death as a character', () => {
      const speakers = new Set(paradeMemoryDialogue.nodes.map(n => n.speaker));
      expect(speakers.has('death')).toBe(true);
    });

    it('should have multiple choice points', () => {
      const nodesWithChoices = paradeMemoryDialogue.nodes.filter(
        n => n.choices && n.choices.length > 0
      );
      expect(nodesWithChoices.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('pierrotConfrontationDialogue', () => {
    it('should have valid structure', () => {
      expect(pierrotConfrontationDialogue.id).toBe('pierrot-confrontation');
      expect(pierrotConfrontationDialogue.sceneId).toBe('pierrot-confrontation');
      expect(pierrotConfrontationDialogue.nodes.length).toBeGreaterThan(0);
    });

    it('should have valid node references', () => {
      validateSequence(pierrotConfrontationDialogue);
    });

    it('should have at least one ending node', () => {
      expect(hasEndingNode(pierrotConfrontationDialogue)).toBe(true);
    });

    it('should include Pierrot character', () => {
      const speakers = new Set(pierrotConfrontationDialogue.nodes.map(n => n.speaker));
      expect(speakers.has('pierrot')).toBe(true);
    });

    it('should have demo end message', () => {
      const demoEndNode = pierrotConfrontationDialogue.nodes.find(
        n => n.text.includes('TO BE CONTINUED')
      );
      expect(demoEndNode).toBeDefined();
    });
  });

  describe('All Dialogues', () => {
    const allSequences = [
      draagOpeningDialogue,
      paradeMemoryDialogue,
      pierrotConfrontationDialogue
    ];

    it('should have unique IDs', () => {
      const ids = allSequences.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should not have empty text in any node', () => {
      for (const seq of allSequences) {
        for (const node of seq.nodes) {
          expect(
            node.text.trim().length,
            `Empty text in ${seq.id}, node ${node.id}`
          ).toBeGreaterThan(0);
        }
      }
    });

    it('should have valid speaker for every node', () => {
      const validSpeakers = [
        'the-patient',
        'death',
        'the-clerk',
        'pierrot',
        'crowd',
        'narrator',
        // Band members
        'the-lead-singer',
        'the-drummer',
        'the-lead-guitarist',
        'the-rhythm-guitarist',
        'the-bassist'
      ];

      for (const seq of allSequences) {
        for (const node of seq.nodes) {
          expect(
            validSpeakers.includes(node.speaker),
            `Invalid speaker "${node.speaker}" in ${seq.id}, node ${node.id}`
          ).toBe(true);
        }
      }
    });

    it('all choices should have text', () => {
      for (const seq of allSequences) {
        for (const node of seq.nodes) {
          if (node.choices) {
            for (const choice of node.choices) {
              expect(
                choice.text.trim().length,
                `Empty choice text in ${seq.id}, node ${node.id}, choice ${choice.id}`
              ).toBeGreaterThan(0);
            }
          }
        }
      }
    });
  });
});
