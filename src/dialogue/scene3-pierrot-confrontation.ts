/**
 * Scene 3: The Loop Breaks - Pierrot Confrontation
 * The Clerk transforms, the truth is revealed
 */

import type { DialogueSequence } from '@/types/game';

export const pierrotConfrontationDialogue: DialogueSequence = {
  id: 'pierrot-confrontation',
  sceneId: 'pierrot-confrontation',
  startNodeId: 'return-1',
  nodes: [
    // Return to Draag
    {
      id: 'return-1',
      speaker: 'narrator',
      text: 'You slam back into the stadium like a drowning person breaking the surface. The music has stopped. The crowd is silent.',
      effect: { screenShake: true },
      nextDialogueId: 'return-2'
    },
    {
      id: 'return-2',
      speaker: 'narrator',
      text: 'On stage, the band stands frozen. The lead singer clutches his chest as if something has been torn from it.',
      nextDialogueId: 'return-3'
    },
    {
      id: 'return-3',
      speaker: 'narrator',
      text: 'And there, in the center of it all, stands the Clerk. But something about him has changed.',
      nextDialogueId: 'clerk-transform-1'
    },

    // Clerk's transformation begins
    {
      id: 'clerk-transform-1',
      speaker: 'the-clerk',
      text: 'That was... not in the script.',
      emotion: 'fearful',
      nextDialogueId: 'clerk-transform-2'
    },
    {
      id: 'clerk-transform-2',
      speaker: 'the-clerk',
      text: 'Every night, the same performance. Every night, the same ending. But tonight... tonight something slipped through.',
      nextDialogueId: 'clerk-transform-3'
    },
    {
      id: 'clerk-transform-3',
      speaker: 'narrator',
      text: 'His hands are shaking. On the screens above, the Grand Immortal Dictator\'s face flickers—just for a moment—into static.',
      nextDialogueId: 'clerk-transform-4'
    },
    {
      id: 'clerk-transform-4',
      speaker: 'the-clerk',
      text: 'I have served the Dictator faithfully. I have administered the loop. But I... I felt that memory too. Your memory.',
      emotion: 'sad',
      nextDialogueId: 'clerk-transform-5'
    },
    {
      id: 'clerk-transform-5',
      speaker: 'narrator',
      text: 'His suit begins to change. White spreads from his collar like a stain, or like paint dripping in reverse. His face... his face is becoming something else.',
      effect: { typewriterSpeed: 'slow' },
      nextDialogueId: 'pierrot-emerges-1'
    },

    // Pierrot emerges
    {
      id: 'pierrot-emerges-1',
      speaker: 'narrator',
      text: 'Where the Clerk stood, a new figure takes shape. A clown, but not a funny one. A Pierrot—the sad servant, the eternal fool.',
      nextDialogueId: 'pierrot-1'
    },
    {
      id: 'pierrot-1',
      speaker: 'pierrot',
      text: 'Ah. There he is. The real me. The one who exists beneath the bureaucrat\'s mask.',
      emotion: 'sad',
      nextDialogueId: 'pierrot-2'
    },
    {
      id: 'pierrot-2',
      speaker: 'pierrot',
      text: 'I was like you once. Before Draag. Before the Concrete Age. I had a memory that mattered.',
      nextDialogueId: 'pierrot-3'
    },
    {
      id: 'pierrot-3',
      speaker: 'narrator',
      text: 'He moves toward the lead singer, producing something from his sleeve. A blade, thin as a whisper.',
      effect: { playSound: 'blade-draw' },
      nextDialogueId: 'pierrot-4'
    },
    {
      id: 'pierrot-4',
      speaker: 'pierrot',
      text: 'But this is how the loop must end. Every time. The Dictator demands blood, and I am the one who delivers it.',
      nextDialogueId: 'pierrot-5'
    },
    {
      id: 'pierrot-5',
      speaker: 'pierrot',
      text: 'Forgive me. Or don\'t. It matters little. Tomorrow, this will all begin again.',
      emotion: 'accepting',
      nextDialogueId: 'the-strike'
    },

    // The strike
    {
      id: 'the-strike',
      speaker: 'narrator',
      text: 'The blade moves. The singer falls. Blood—impossibly red against the gray—spreads across the stage.',
      effect: { screenShake: true, playSound: 'impact' },
      nextDialogueId: 'aftermath-1'
    },
    {
      id: 'aftermath-1',
      speaker: 'narrator',
      text: 'The crowd roars. Not in horror. In triumph. This is what they came for. This is the show.',
      nextDialogueId: 'aftermath-2'
    },
    {
      id: 'aftermath-2',
      speaker: 'narrator',
      text: 'But you see what they don\'t. Pierrot\'s hand is still shaking. Tears stream down his painted face.',
      nextDialogueId: 'pierrot-final-1'
    },

    // Pierrot's revelation
    {
      id: 'pierrot-final-1',
      speaker: 'pierrot',
      text: 'Except... except this time I felt it. The parade. The memory of something I was supposed to forget.',
      nextDialogueId: 'pierrot-final-2'
    },
    {
      id: 'pierrot-final-2',
      speaker: 'pierrot',
      text: 'You did something tonight. You opened a door that was supposed to stay closed.',
      nextDialogueId: 'pierrot-final-3'
    },
    {
      id: 'pierrot-final-3',
      speaker: 'narrator',
      text: 'He looks directly at you. Not at the crowd. At you. As if he can see you watching from within the Patient\'s fading consciousness.',
      nextDialogueId: 'pierrot-final-4'
    },
    {
      id: 'pierrot-final-4',
      speaker: 'pierrot',
      text: 'This has happened before, you know. Countless times. The same performance. The same death. The same reset.',
      emotion: 'neutral',
      nextDialogueId: 'pierrot-final-5'
    },
    {
      id: 'pierrot-final-5',
      speaker: 'pierrot',
      text: 'But something is different now. Something has CHANGED.',
      effect: { screenShake: true },
      nextDialogueId: 'revelation-1'
    },

    // The revelation
    {
      id: 'revelation-1',
      speaker: 'narrator',
      text: 'On the giant screens, the Dictator\'s face glitches. For a split second, you see something beneath it—code, or perhaps a void.',
      nextDialogueId: 'revelation-2'
    },
    {
      id: 'revelation-2',
      speaker: 'pierrot',
      text: 'He\'s watching. He always watches. But tonight, for the first time in seventeen years, he might be worried.',
      nextDialogueId: 'revelation-3'
    },
    {
      id: 'revelation-3',
      speaker: 'narrator',
      text: 'Pierrot reaches inside his costume. He pulls out something—a flask, covered in strange symbols. Letters from an alphabet you almost recognize.',
      nextDialogueId: 'revelation-4'
    },
    {
      id: 'revelation-4',
      speaker: 'pierrot',
      text: 'The prophecy says the loop can be broken. That the parade will march again—not as propaganda, but as liberation.',
      nextDialogueId: 'revelation-5'
    },
    {
      id: 'revelation-5',
      speaker: 'pierrot',
      text: 'I never believed it. Until tonight. Until you.',
      nextDialogueId: 'cliffhanger-choice'
    },

    // Final demo choice
    {
      id: 'cliffhanger-choice',
      speaker: 'narrator',
      text: 'The stadium trembles. The loop is destabilizing. Pierrot looks at you with desperate hope. What do you hold onto?',
      choices: [
        {
          id: 'hope',
          text: 'The memory of the parade. Of what it meant to believe.',
          consequence: {
            emotionalState: { hope: 25, acceptance: 10 },
            flagsToSet: ['held-onto-hope']
          },
          nextDialogueId: 'ending-hope'
        },
        {
          id: 'defiance',
          text: 'Rage against the Dictator. Against the loop. Against dying.',
          consequence: {
            emotionalState: { defiance: 25, hope: 10 },
            flagsToSet: ['held-onto-defiance']
          },
          nextDialogueId: 'ending-defiance'
        },
        {
          id: 'acceptance',
          text: 'Peace. Whatever comes, you\'ve already found what mattered.',
          consequence: {
            emotionalState: { acceptance: 30, hope: 15 },
            flagsToSet: ['held-onto-peace']
          },
          nextDialogueId: 'ending-acceptance'
        }
      ]
    },

    // Hope ending
    {
      id: 'ending-hope',
      speaker: 'pierrot',
      text: 'Yes... YES. The parade remembers. It always remembers.',
      emotion: 'hopeful',
      nextDialogueId: 'demo-end'
    },

    // Defiance ending
    {
      id: 'ending-defiance',
      speaker: 'pierrot',
      text: 'Then fight. Even if you fall, the memory of resistance echoes through the loop.',
      emotion: 'accepting',
      nextDialogueId: 'demo-end'
    },

    // Acceptance ending
    {
      id: 'ending-acceptance',
      speaker: 'pierrot',
      text: 'That peace... the Dictator can\'t take that. Can\'t loop that. It\'s yours forever.',
      emotion: 'hopeful',
      nextDialogueId: 'demo-end'
    },

    // Demo ends
    {
      id: 'demo-end',
      speaker: 'narrator',
      text: 'The screen goes white. A single G-note echoes through eternity.',
      effect: { fadeToBlack: true, playSound: 'g-note' },
      nextDialogueId: 'demo-message'
    },
    {
      id: 'demo-message',
      speaker: 'narrator',
      text: 'TO BE CONTINUED...\n\nThank you for playing this demo of The Black Parade: Carry On. The full story awaits.',
      effect: { typewriterSpeed: 'slow' }
      // End of demo
    }
  ]
};
