/**
 * Scene 1: The Concrete Age - Draag Opening
 * The Clerk introduces the band in the stadium of Draag
 */

import type { DialogueSequence } from '@/types/game';

export const draagOpeningDialogue: DialogueSequence = {
  id: 'draag-opening',
  sceneId: 'draag-opening',
  startNodeId: 'opening-1',
  nodes: [
    // Narrator sets the scene
    {
      id: 'opening-1',
      speaker: 'narrator',
      text: 'The stadium of Draag stretches before you, vast and gray beneath a colorless sky. Thousands fill the concrete stands, their faces pale, their movements synchronized.',
      nextDialogueId: 'opening-2',
      effect: { typewriterSpeed: 'slow' }
    },
    {
      id: 'opening-2',
      speaker: 'narrator',
      text: 'Searchlights sweep across the crowd. Banners bearing the symbol of the Grand Immortal Dictator hang from every pillar.',
      nextDialogueId: 'opening-3'
    },
    {
      id: 'opening-3',
      speaker: 'narrator',
      text: 'A figure emerges onto the central stage. The Clerk. His suit is immaculate, his smile carefully measured.',
      nextDialogueId: 'clerk-1'
    },

    // The Clerk's introduction
    {
      id: 'clerk-1',
      speaker: 'the-clerk',
      text: 'Citizens of Draag! Welcome to this most glorious demonstration of cultural achievement!',
      emotion: 'neutral',
      nextDialogueId: 'clerk-2'
    },
    {
      id: 'clerk-2',
      speaker: 'the-clerk',
      text: 'His Grand Immortal Dictator, in his infinite wisdom and generosity, has seen fit to grace us with entertainment.',
      nextDialogueId: 'clerk-3'
    },
    {
      id: 'clerk-3',
      speaker: 'the-clerk',
      text: 'Seventeen years ago, a parade was sent to the MOAT. Tonight, by the Dictator\'s decree, that parade returns.',
      nextDialogueId: 'crowd-response-1'
    },

    // Crowd response
    {
      id: 'crowd-response-1',
      speaker: 'crowd',
      text: 'A wave of applause rises from the stands. Mechanical. Rehearsed. Yet somewhere in that sound, you sense something else. Hunger.',
      nextDialogueId: 'clerk-4'
    },

    // The Clerk continues
    {
      id: 'clerk-4',
      speaker: 'the-clerk',
      text: 'I present to you... His Grand Immortal Dictator\'s NATIONAL BAND!',
      emotion: 'neutral',
      effect: { screenShake: true },
      nextDialogueId: 'narrator-band'
    },

    // The band appears
    {
      id: 'narrator-band',
      speaker: 'narrator',
      text: 'Figures emerge from the shadows, clad in black military uniforms. Silver trim catches the light. They move with the weariness of those who have performed this ritual countless times.',
      nextDialogueId: 'clerk-5'
    },

    // The Clerk's instructions
    {
      id: 'clerk-5',
      speaker: 'the-clerk',
      text: 'Now, citizens, you know what is expected. When the music begins, you will participate. You will celebrate.',
      nextDialogueId: 'clerk-6'
    },
    {
      id: 'clerk-6',
      speaker: 'the-clerk',
      text: 'Failure to demonstrate adequate enthusiasm will be... noted.',
      emotion: 'neutral',
      nextDialogueId: 'choice-compliance'
    },

    // Player choice: How do you respond?
    {
      id: 'choice-compliance',
      speaker: 'narrator',
      text: 'The Clerk\'s eyes sweep across the crowd. For a moment, they seem to find you. What do you do?',
      choices: [
        {
          id: 'comply',
          text: 'Applaud with the others. Blend in.',
          consequence: {
            emotionalState: { defiance: -10, acceptance: 5 },
            flagsToSet: ['complied-with-draag']
          },
          nextDialogueId: 'comply-result'
        },
        {
          id: 'resist',
          text: 'Keep your hands still. Watch silently.',
          consequence: {
            emotionalState: { defiance: 15, hope: 5 },
            flagsToSet: ['resisted-draag']
          },
          nextDialogueId: 'resist-result'
        },
        {
          id: 'observe',
          text: 'Search the crowd for others who doubt.',
          consequence: {
            emotionalState: { hope: 10 },
            flagsToSet: ['observed-crowd']
          },
          nextDialogueId: 'observe-result'
        }
      ]
    },

    // Comply branch
    {
      id: 'comply-result',
      speaker: 'narrator',
      text: 'Your palms meet in rhythm with the others. Safe. Invisible. The Clerk\'s gaze moves on.',
      nextDialogueId: 'post-choice-1'
    },

    // Resist branch
    {
      id: 'resist-result',
      speaker: 'narrator',
      text: 'Your stillness is a small rebellion. The Clerk\'s attention lingers on you for a heartbeat longer than comfortable, then passes.',
      nextDialogueId: 'post-choice-1'
    },

    // Observe branch
    {
      id: 'observe-result',
      speaker: 'narrator',
      text: 'Through the sea of synchronized applause, you catch glimpses—a man whose claps don\'t quite reach his palms, a woman whose eyes remain dead despite her smile. You are not alone.',
      nextDialogueId: 'post-choice-1'
    },

    // Continue after choice
    {
      id: 'post-choice-1',
      speaker: 'the-clerk',
      text: 'Wonderful. Such enthusiasm. His Grand Immortal Dictator is most pleased.',
      nextDialogueId: 'post-choice-2'
    },
    {
      id: 'post-choice-2',
      speaker: 'narrator',
      text: 'Above, on enormous screens, a face watches. The Grand Immortal Dictator himself—or at least his image. Unblinking. Eternal.',
      nextDialogueId: 'music-begins'
    },

    // Music begins
    {
      id: 'music-begins',
      speaker: 'narrator',
      text: 'The first note strikes. A single piano key, hanging in the air like a question. Then drums. Distant at first, like memories of something lost.',
      effect: { playSound: 'piano-note' },
      nextDialogueId: 'music-2'
    },
    {
      id: 'music-2',
      speaker: 'narrator',
      text: 'The lead singer steps forward. His eyes, beneath the black and silver of his uniform, hold something the propaganda hasn\'t managed to extinguish.',
      nextDialogueId: 'music-3'
    },
    {
      id: 'music-3',
      speaker: 'narrator',
      text: 'He opens his mouth to sing, and for a moment—just a moment—you forget where you are. You remember somewhere else. Someone else.',
      nextDialogueId: 'transition-to-memory'
    },

    // Transition to memory scene
    {
      id: 'transition-to-memory',
      speaker: 'narrator',
      text: 'The stadium fades. The gray concrete dissolves into gold and sepia. You are falling backward through time, to a parade you once attended as a child...',
      effect: { fadeToBlack: true, typewriterSpeed: 'slow' }
      // No nextDialogueId - scene ends here, triggers transition
    }
  ]
};
