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
      text: 'The Concrete Age. Draag Stadium rises from the gray earth like a monument to forgetting. Sixty thousand souls sit in perfect rows, dressed in regulation gray. The sky above is the color of static.',
      nextDialogueId: 'opening-2',
      effect: { typewriterSpeed: 'slow' }
    },
    {
      id: 'opening-2',
      speaker: 'narrator',
      text: 'Searchlights sweep the crowd in mechanical rhythm. Red and white beams cut through manufactured fog. On every wall, the symbol: a skeletal hand clutching a dying star.',
      nextDialogueId: 'opening-3'
    },
    {
      id: 'opening-3',
      speaker: 'narrator',
      text: 'The air smells of concrete dust and ozone. In the distance, beyond the walls, you can almost hear it—the MOAT, the chaotic world outside the Dictator\'s order. But here, all is control.',
      nextDialogueId: 'opening-4'
    },
    {
      id: 'opening-4',
      speaker: 'narrator',
      text: 'A figure glides onto the stage. The Clerk. Black suit, white makeup that makes his face a porcelain mask. His smile is painted on, too wide, too perfect. Behind it, nothing.',
      nextDialogueId: 'opening-5'
    },
    {
      id: 'opening-5',
      speaker: 'narrator',
      text: 'Silence stretches. The Clerk lets it build—savoring sixty thousand held breaths like wine. When he finally speaks, his voice carries without amplification, impossibly loud, impossibly intimate.',
      nextDialogueId: 'clerk-1'
    },

    // The Clerk's introduction
    {
      id: 'clerk-1',
      speaker: 'the-clerk',
      text: 'CITIZENS! Welcome, welcome, WELCOME to this most auspicious occasion! The Concrete Age blesses you with spectacle!',
      emotion: 'neutral',
      nextDialogueId: 'clerk-keposhka'
    },
    {
      id: 'clerk-keposhka',
      speaker: 'the-clerk',
      text: 'Velsharik tor mendashra! Keposhka vril!',
      emotion: 'neutral',
      nextDialogueId: 'clerk-keposhka-narrator'
    },
    {
      id: 'clerk-keposhka-narrator',
      speaker: 'narrator',
      text: 'The words are Keposhka—the Dictator\'s invented tongue. You don\'t understand them, but your body does. It flinches. The language was designed to bypass thought and strike directly at the spine.',
      nextDialogueId: 'clerk-2'
    },
    {
      id: 'clerk-2',
      speaker: 'the-clerk',
      text: 'His Grand Immortal Dictator—glory eternal to his name—has decreed that tonight, you shall witness history. You shall witness MEMORY. You shall witness the return.',
      nextDialogueId: 'clerk-3'
    },
    {
      id: 'clerk-3',
      speaker: 'the-clerk',
      text: 'Seventeen years they marched beyond our walls. Seventeen years in the MOAT, that festering chaos of the past. But the Dictator\'s reach is long. The Parade has been... reclaimed.',
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
      text: 'Five figures emerge from beneath the stage, rising on hydraulic platforms through clouds of red smoke. Black marching band uniforms, Victorian military cut. Silver epaulettes gleam like bone.',
      nextDialogueId: 'narrator-band-2'
    },
    {
      id: 'narrator-band-2',
      speaker: 'narrator',
      text: 'Their faces are painted—white greasepaint, black circles around the eyes. Death masks. Parade masks. They carry instruments like weapons, and stand at attention like soldiers who forgot how to die.',
      nextDialogueId: 'narrator-band-3'
    },
    {
      id: 'narrator-band-3',
      speaker: 'narrator',
      text: 'The one at center stage is different. Smaller. Fiercer. His jacket is festooned with medals that might be military honors or might be children\'s toys—impossible to tell. His eyes burn through the greasepaint.',
      nextDialogueId: 'narrator-band-4'
    },
    {
      id: 'narrator-band-4',
      speaker: 'narrator',
      text: 'Behind him, a skeletal figure hunches over drums like a carrion bird. To the left, two guitarists stand mirror-image, twins in violence. At the edge, barely visible, a shadow cradles a bass like a sleeping child.',
      nextDialogueId: 'narrator-band-5'
    },
    {
      id: 'narrator-band-5',
      speaker: 'narrator',
      text: 'Something about them is wrong. Not wrong like the Clerk is wrong—calculated, constructed. This is the wrongness of a wound that won\'t close. Of a memory that refuses to die.',
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
      text: 'The first note strikes. A single piano key, hanging in the manufactured silence like a last confession. Then drums—marching, funeral, inevitable.',
      effect: { playSound: 'piano-note' },
      nextDialogueId: 'music-2'
    },
    {
      id: 'music-2',
      speaker: 'narrator',
      text: 'The lead singer steps to the microphone. For an instant, beneath the death-mask makeup, his eyes meet yours. And in them, you see it—fear. Recognition. A plea.',
      nextDialogueId: 'music-3'
    },
    {
      id: 'music-3',
      speaker: 'narrator',
      text: 'He opens his mouth. The first word is a gasp, a breath, a memory surfacing. The guitars crash like waves. The sound splits the Concrete Age open.',
      nextDialogueId: 'music-4'
    },
    {
      id: 'music-4',
      speaker: 'narrator',
      text: 'And suddenly you\'re not here anymore. The stadium dissolves. The gray bleeds into gold, into amber, into sepia photographs of a world that knew color.',
      nextDialogueId: 'music-5'
    },
    {
      id: 'music-5',
      speaker: 'narrator',
      text: 'You smell antiseptic. Hospital flowers. Your mother\'s perfume. The beeping of machines you never want to hear again but never stopped hearing.',
      nextDialogueId: 'music-6'
    },
    {
      id: 'music-6',
      speaker: 'narrator',
      text: 'The singer\'s voice follows you down, down through the layers of forgetting. Not accusing. Not judging. Just... accompanying. Like a friend at a funeral. Like a parade at the end of the world.',
      effect: { typewriterSpeed: 'slow' },
      nextDialogueId: 'transition-1'
    },

    // Transition to memory scene
    {
      id: 'transition-1',
      speaker: 'narrator',
      text: 'You are falling backward. Through years. Through forgetting.',
      nextDialogueId: 'transition-2'
    },
    {
      id: 'transition-2',
      speaker: 'narrator',
      text: 'You remember a room. White walls. White sheets. A window you couldn\'t reach. A television playing news about a world that no longer mattered.',
      nextDialogueId: 'transition-3'
    },
    {
      id: 'transition-3',
      speaker: 'narrator',
      text: 'You remember being afraid. Not of dying—you\'d made peace with that. Afraid of being forgotten. Afraid it all meant nothing.',
      nextDialogueId: 'transition-4'
    },
    {
      id: 'transition-4',
      speaker: 'narrator',
      text: 'And then—drums. Distant at first, then closer. A parade, coming for you. Death, dressed in your strongest memory, arriving to carry you home.',
      effect: { typewriterSpeed: 'slow' },
      nextDialogueId: 'transition-to-memory'
    },
    {
      id: 'transition-to-memory',
      speaker: 'narrator',
      text: 'Back to when you were young, and dying, and a parade came to carry you home...',
      effect: { fadeToBlack: true, typewriterSpeed: 'slow' }
      // No nextDialogueId - scene ends here, triggers transition
    }
  ]
};
