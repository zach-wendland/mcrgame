/**
 * Scene 2: The Memory - Welcome to the Black Parade
 * The Patient relives his fondest memory and meets Death
 */

import type { DialogueSequence } from '@/types/game';

export const paradeMemoryDialogue: DialogueSequence = {
  id: 'parade-memory',
  sceneId: 'parade-memory',
  startNodeId: 'memory-1',
  nodes: [
    // Memory begins
    {
      id: 'memory-1',
      speaker: 'narrator',
      text: 'You stand on a sunlit street. The colors are warm—golden hour light spilling across cobblestones. The smell of popcorn and cotton candy hangs in the air.',
      effect: { typewriterSpeed: 'slow' },
      nextDialogueId: 'memory-2'
    },
    {
      id: 'memory-2',
      speaker: 'narrator',
      text: 'You are small again. Seven years old, perhaps eight. Your father\'s hand wraps around yours, warm and certain.',
      nextDialogueId: 'memory-3'
    },
    {
      id: 'memory-3',
      speaker: 'narrator',
      text: 'In the distance, you hear it: drums. The steady march of a parade approaching.',
      effect: { playSound: 'distant-drums' },
      nextDialogueId: 'father-1'
    },

    // Father's words (echoed memory)
    {
      id: 'father-1',
      speaker: 'narrator',
      text: 'Your father\'s voice comes to you, not as sound but as feeling. As truth carved into your bones.',
      nextDialogueId: 'father-2'
    },
    {
      id: 'father-2',
      speaker: 'narrator',
      text: '"Son," he had said, his grip tightening on your hand, "when you grow up, would you be the savior of the broken, the beaten, and the damned?"',
      emotion: 'hopeful',
      nextDialogueId: 'father-3'
    },
    {
      id: 'father-3',
      speaker: 'narrator',
      text: '"And one day, I\'ll leave you. A phantom to lead you in the summer. To join the Black Parade."',
      nextDialogueId: 'memory-shift-1'
    },

    // Memory shifts
    {
      id: 'memory-shift-1',
      speaker: 'narrator',
      text: 'The light changes. The warmth drains from the air like blood from a wound.',
      effect: { screenShake: true },
      nextDialogueId: 'memory-shift-2'
    },
    {
      id: 'memory-shift-2',
      speaker: 'narrator',
      text: 'The parade is closer now. You can see them—figures in black, marching in perfect unison. Their uniforms catch no light.',
      nextDialogueId: 'memory-shift-3'
    },
    {
      id: 'memory-shift-3',
      speaker: 'narrator',
      text: 'At their head walks a figure far taller than the rest. A band leader whose shadow seems to stretch across the entire street.',
      nextDialogueId: 'death-appears'
    },

    // Death appears
    {
      id: 'death-appears',
      speaker: 'narrator',
      text: 'The Parade Leader stops before you. Up close, you realize they are not simply tall—they are colossal. Their hand, when it rests upon your shoulder, is gentle as falling ash.',
      nextDialogueId: 'death-1'
    },
    {
      id: 'death-1',
      speaker: 'death',
      text: 'Hello, Patient.',
      emotion: 'neutral',
      nextDialogueId: 'death-2'
    },
    {
      id: 'death-2',
      speaker: 'death',
      text: 'I\'ve been waiting for you. Longer than you know. Through every hospital room, every sleepless night, every prayer unanswered.',
      nextDialogueId: 'death-3'
    },
    {
      id: 'death-3',
      speaker: 'death',
      text: 'I am what comes for everyone. But I appear to each as their fondest memory. Your father chose well when he brought you here.',
      nextDialogueId: 'patient-response-choice'
    },

    // Player choice: First response to Death
    {
      id: 'patient-response-choice',
      speaker: 'the-patient',
      text: 'You look up at this towering figure—at Death made manifest as childhood wonder. What do you say?',
      choices: [
        {
          id: 'afraid',
          text: '"I\'m not ready. There\'s so much I haven\'t done."',
          consequence: {
            emotionalState: { regret: 15, acceptance: -10 },
            flagsToSet: ['expressed-fear']
          },
          nextDialogueId: 'death-response-afraid'
        },
        {
          id: 'accepting',
          text: '"I think I\'ve been waiting for you too."',
          consequence: {
            emotionalState: { acceptance: 20, hope: 10 },
            flagsToSet: ['expressed-acceptance']
          },
          nextDialogueId: 'death-response-accepting'
        },
        {
          id: 'angry',
          text: '"Why now? Why like this?"',
          consequence: {
            emotionalState: { defiance: 15, regret: 5 },
            flagsToSet: ['expressed-anger']
          },
          nextDialogueId: 'death-response-angry'
        }
      ]
    },

    // Afraid response branch
    {
      id: 'death-response-afraid',
      speaker: 'death',
      text: 'No one is ever ready. That\'s not what determines whether a life was worth living.',
      nextDialogueId: 'death-continue-1'
    },

    // Accepting response branch
    {
      id: 'death-response-accepting',
      speaker: 'death',
      text: 'That... is rare. Most fight until the very end. Perhaps you understand something they don\'t.',
      emotion: 'accepting',
      nextDialogueId: 'death-continue-1'
    },

    // Angry response branch
    {
      id: 'death-response-angry',
      speaker: 'death',
      text: 'The timing was never in my hands. Only the manner of the meeting. I chose something you might find... less terrible.',
      nextDialogueId: 'death-continue-1'
    },

    // Continue after choice
    {
      id: 'death-continue-1',
      speaker: 'death',
      text: 'Do you remember what you wanted to be, when you were this small? Before the world taught you to want smaller things?',
      nextDialogueId: 'second-choice'
    },

    // Second choice: What you wanted to be
    {
      id: 'second-choice',
      speaker: 'narrator',
      text: 'The question hangs in the air. In this place between memory and oblivion, what do you recall?',
      choices: [
        {
          id: 'hero',
          text: 'I wanted to save people. To matter.',
          consequence: {
            emotionalState: { hope: 15, regret: 10 },
            flagsToSet: ['wanted-to-be-hero']
          },
          nextDialogueId: 'death-hero-response'
        },
        {
          id: 'forgotten',
          text: 'I don\'t remember anymore. It was so long ago.',
          consequence: {
            emotionalState: { regret: 20 },
            flagsToSet: ['forgotten-dreams']
          },
          nextDialogueId: 'death-forgotten-response'
        },
        {
          id: 'this',
          text: 'I think I wanted exactly this. To understand.',
          consequence: {
            emotionalState: { acceptance: 15, hope: 10 },
            flagsToSet: ['wanted-understanding']
          },
          nextDialogueId: 'death-this-response'
        }
      ]
    },

    // Hero branch
    {
      id: 'death-hero-response',
      speaker: 'death',
      text: 'And did you? Even once? Even in some small way that no one noticed?',
      nextDialogueId: 'death-philosophy-1'
    },

    // Forgotten branch
    {
      id: 'death-forgotten-response',
      speaker: 'death',
      text: 'That forgetting... that is its own kind of death. The one that happens while you\'re still breathing.',
      emotion: 'sad',
      nextDialogueId: 'death-philosophy-1'
    },

    // This branch
    {
      id: 'death-this-response',
      speaker: 'death',
      text: 'Understanding is rare. Most seek comfort, or meaning, or even punishment. You seek truth. That is... something.',
      emotion: 'accepting',
      nextDialogueId: 'death-philosophy-1'
    },

    // Death's philosophy
    {
      id: 'death-philosophy-1',
      speaker: 'death',
      text: 'I have led many parades, Patient. Each one unique. Each one a celebration of what was, not mourning for what might have been.',
      nextDialogueId: 'death-philosophy-2'
    },
    {
      id: 'death-philosophy-2',
      speaker: 'death',
      text: 'Your father knew this. When he brought you here, he was teaching you how to die—which is the same as teaching you how to live.',
      nextDialogueId: 'death-philosophy-3'
    },
    {
      id: 'death-philosophy-3',
      speaker: 'death',
      text: 'The parade never truly ends. It only waits for those ready to join it.',
      nextDialogueId: 'third-choice'
    },

    // Third and final choice
    {
      id: 'third-choice',
      speaker: 'death',
      text: 'You don\'t have to decide now. But when the time comes—and it will come—will you carry on?',
      choices: [
        {
          id: 'yes-carry-on',
          text: '"I will. I\'m not afraid to keep on living."',
          consequence: {
            emotionalState: { acceptance: 25, hope: 20, regret: -10 },
            flagsToSet: ['chose-to-carry-on']
          },
          nextDialogueId: 'carry-on-response'
        },
        {
          id: 'unsure',
          text: '"I don\'t know. I\'m still figuring out what I believe."',
          consequence: {
            emotionalState: { acceptance: 10, hope: 10 },
            flagsToSet: ['chose-uncertainty']
          },
          nextDialogueId: 'unsure-response'
        },
        {
          id: 'refuse',
          text: '"I\'m not afraid to walk this world alone."',
          consequence: {
            emotionalState: { defiance: 20, acceptance: 5 },
            flagsToSet: ['chose-solitude']
          },
          nextDialogueId: 'refuse-response'
        }
      ]
    },

    // Carry on response
    {
      id: 'carry-on-response',
      speaker: 'death',
      text: 'Then carry on. And know that the parade—that I—will be waiting at the end. Not as punishment. As reward.',
      emotion: 'hopeful',
      nextDialogueId: 'memory-fade-1'
    },

    // Unsure response
    {
      id: 'unsure-response',
      speaker: 'death',
      text: 'That honesty serves you better than false conviction. Take the time you have left to find your answer.',
      nextDialogueId: 'memory-fade-1'
    },

    // Refuse response
    {
      id: 'refuse-response',
      speaker: 'death',
      text: 'Then walk alone. But remember—even the lonely march eventually finds its way to the parade.',
      nextDialogueId: 'memory-fade-1'
    },

    // Memory fades, transition to Scene 3
    {
      id: 'memory-fade-1',
      speaker: 'narrator',
      text: 'The golden light begins to fracture. The memory is ending—or being interrupted.',
      nextDialogueId: 'memory-fade-2'
    },
    {
      id: 'memory-fade-2',
      speaker: 'narrator',
      text: 'Through the cracks, you see gray. Concrete. The stadium of Draag bleeding back into existence.',
      effect: { screenShake: true },
      nextDialogueId: 'memory-fade-3'
    },
    {
      id: 'memory-fade-3',
      speaker: 'death',
      text: 'Wait. Something is different this time. Someone is watching who should not be watching...',
      emotion: 'fearful',
      nextDialogueId: 'memory-fade-4'
    },
    {
      id: 'memory-fade-4',
      speaker: 'narrator',
      text: 'The Parade Leader\'s hand tightens on your shoulder. In their ancient eyes, you see something you never expected to see: surprise.',
      effect: { fadeToBlack: true, typewriterSpeed: 'slow' }
      // Scene ends - transition to Scene 3
    }
  ]
};
