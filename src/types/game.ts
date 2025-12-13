/**
 * Core game types for The Black Parade: Carry On
 */

// Scene identifiers for the demo
export type SceneId =
  | 'title'
  | 'draag-opening'      // Scene 1: The Concrete Age
  | 'parade-memory'       // Scene 2: Welcome to the Black Parade memory
  | 'pierrot-confrontation'; // Scene 3: The Loop Breaks

// Character identifiers
export type CharacterId =
  | 'the-patient'
  | 'death'
  | 'the-clerk'
  | 'pierrot'
  | 'crowd'
  | 'narrator'
  // The Black Parade Band Members
  | 'the-lead-singer'    // Front man, parade leader aesthetic
  | 'the-drummer'        // Skeletal marching drummer
  | 'the-lead-guitarist' // Twin guitarist 1
  | 'the-rhythm-guitarist' // Twin guitarist 2
  | 'the-bassist';       // Shadow with bass

// Dialogue choice structure
export interface DialogueChoice {
  id: string;
  text: string;
  consequence?: ChoiceConsequence;
  nextDialogueId?: string;
  isAvailable?: boolean;
}

// What happens when a choice is made
export interface ChoiceConsequence {
  emotionalState?: Partial<EmotionalState>;
  flagsToSet?: string[];
  flagsToRemove?: string[];
}

// The Patient's emotional journey tracking
export interface EmotionalState {
  acceptance: number;    // 0-100: How at peace The Patient is
  regret: number;        // 0-100: Lingering guilt
  hope: number;          // 0-100: Belief in something beyond
  defiance: number;      // 0-100: Resistance to the Draag regime
}

// Individual dialogue node
export interface DialogueNode {
  id: string;
  speaker: CharacterId;
  text: string;
  choices?: DialogueChoice[];
  nextDialogueId?: string; // Auto-advance if no choices
  emotion?: 'neutral' | 'sad' | 'angry' | 'hopeful' | 'fearful' | 'accepting';
  effect?: DialogueEffect;
}

// Visual/audio effects during dialogue
export interface DialogueEffect {
  screenShake?: boolean;
  fadeToBlack?: boolean;
  playSound?: string;
  showImage?: string;
  typewriterSpeed?: 'slow' | 'normal' | 'fast';
}

// A complete dialogue sequence
export interface DialogueSequence {
  id: string;
  sceneId: SceneId;
  nodes: DialogueNode[];
  startNodeId: string;
}

// Game state persisted across sessions
export interface GameState {
  currentScene: SceneId;
  currentDialogueId: string | null;
  emotionalState: EmotionalState;
  flags: Set<string>;
  choiceHistory: Array<{
    dialogueId: string;
    choiceId: string;
    timestamp: number;
  }>;
  playTime: number; // milliseconds
}

// Scene configuration
export interface SceneConfig {
  id: SceneId;
  name: string;
  backgroundImage: string;
  ambientSound?: string;
  music?: string;
  initialDialogueId: string;
}

// Character visual configuration
export interface CharacterConfig {
  id: CharacterId;
  name: string;
  displayName: string;
  sprites: {
    default: string;
    [emotion: string]: string;
  };
  position?: 'left' | 'center' | 'right';
  color: string; // For dialogue name display
}

// Audio configuration
export interface AudioConfig {
  music: {
    [key: string]: {
      src: string;
      loop: boolean;
      volume: number;
    };
  };
  sfx: {
    [key: string]: {
      src: string;
      volume: number;
    };
  };
}

// Save data structure
export interface SaveData {
  version: string;
  timestamp: number;
  gameState: Omit<GameState, 'flags'> & { flags: string[] }; // Serialize Set
}
