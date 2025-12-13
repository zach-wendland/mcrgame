/**
 * Comprehensive Dialogue and Pixel Art Mapping Test
 * Validates all dialogue nodes, character appearances, and scene flow
 */

const fs = require('fs');
const path = require('path');

// Read the dialogue files
const scene1 = fs.readFileSync(path.join(__dirname, 'src/dialogue/scene1-draag-opening.ts'), 'utf8');
const scene2 = fs.readFileSync(path.join(__dirname, 'src/dialogue/scene2-parade-memory.ts'), 'utf8');
const scene3 = fs.readFileSync(path.join(__dirname, 'src/dialogue/scene3-pierrot-confrontation.ts'), 'utf8');

// Valid character IDs that have pixel art
const VALID_CHARACTERS = [
  'narrator', 'the-clerk', 'the-patient', 'death', 'pierrot', 'crowd',
  // Band members
  'the-lead-singer', 'the-drummer', 'the-lead-guitarist', 'the-rhythm-guitarist', 'the-bassist'
];
const CHARACTERS_WITH_SPRITES = [
  'the-clerk', 'the-patient', 'death', 'pierrot',
  // Band members have sprites too
  'the-lead-singer', 'the-drummer', 'the-lead-guitarist', 'the-rhythm-guitarist', 'the-bassist'
];

// Valid audio effects
const VALID_AUDIO = ['piano-note', 'distant-drums', 'blade-draw', 'impact', 'g-note'];

// Extract dialogue nodes from file content
function extractNodes(content) {
  const nodeMatches = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"]/g);
  const speakerMatches = content.matchAll(/speaker:\s*['"]([^'"]+)['"]/g);
  const nextMatches = content.matchAll(/nextDialogueId:\s*['"]([^'"]+)['"]/g);
  const soundMatches = content.matchAll(/playSound:\s*['"]([^'"]+)['"]/g);
  const choiceNextMatches = content.matchAll(/choices:\s*\[([^\]]+)\]/gs);

  const nodes = [...nodeMatches].map(m => m[1]);
  const speakers = [...speakerMatches].map(m => m[1]);
  const nextIds = [...nextMatches].map(m => m[1]);
  const sounds = [...soundMatches].map(m => m[1]);

  return { nodes, speakers, nextIds, sounds };
}

console.log('========================================');
console.log('DIALOGUE AND PIXEL ART MAPPING ANALYSIS');
console.log('========================================\n');

let totalErrors = 0;
let totalWarnings = 0;

function analyzeScene(sceneName, content) {
  console.log(`\n--- ${sceneName} ---\n`);

  const { nodes, speakers, nextIds, sounds } = extractNodes(content);

  // Count speakers
  const speakerCounts = {};
  speakers.forEach(s => {
    speakerCounts[s] = (speakerCounts[s] || 0) + 1;
  });

  console.log('Speaker Distribution:');
  Object.entries(speakerCounts).forEach(([speaker, count]) => {
    const hasSprite = CHARACTERS_WITH_SPRITES.includes(speaker) ? '[HAS PIXEL ART]' : '[no sprite]';
    console.log(`  ${speaker}: ${count} nodes ${hasSprite}`);
  });

  // Validate speakers
  const invalidSpeakers = speakers.filter(s => !VALID_CHARACTERS.includes(s));
  if (invalidSpeakers.length > 0) {
    console.log(`\nERROR: Invalid speakers found: ${[...new Set(invalidSpeakers)].join(', ')}`);
    totalErrors += invalidSpeakers.length;
  }

  // Validate node references
  const missingRefs = nextIds.filter(n => !nodes.includes(n));
  if (missingRefs.length > 0) {
    console.log(`\nERROR: Missing node references: ${[...new Set(missingRefs)].join(', ')}`);
    totalErrors += missingRefs.length;
  } else {
    console.log('\n✓ All nextDialogueId references are valid');
  }

  // Validate sound effects
  const invalidSounds = sounds.filter(s => !VALID_AUDIO.includes(s));
  if (invalidSounds.length > 0) {
    console.log(`\nWARNING: Unknown audio effects: ${[...new Set(invalidSounds)].join(', ')}`);
    totalWarnings += invalidSounds.length;
  } else if (sounds.length > 0) {
    console.log(`✓ All ${sounds.length} audio effects are valid: ${[...new Set(sounds)].join(', ')}`);
  }

  // Calculate sprite visibility percentage
  const narratorCount = speakers.filter(s => s === 'narrator' || s === 'crowd').length;
  const spriteCount = speakers.filter(s => CHARACTERS_WITH_SPRITES.includes(s)).length;
  const totalNodes = speakers.length;

  console.log(`\nVisual Coverage:`);
  console.log(`  Total dialogue nodes: ${totalNodes}`);
  console.log(`  Nodes with character sprite: ${spriteCount} (${Math.round(spriteCount/totalNodes*100)}%)`);
  console.log(`  Narrator-only nodes: ${narratorCount} (${Math.round(narratorCount/totalNodes*100)}%)`);

  return { nodes, speakers, sounds, speakerCounts };
}

// Analyze each scene
const scene1Data = analyzeScene('Scene 1: Draag Opening', scene1);
const scene2Data = analyzeScene('Scene 2: Parade Memory', scene2);
const scene3Data = analyzeScene('Scene 3: Pierrot Confrontation', scene3);

// Summary
console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================\n');

const totalNodes = scene1Data.nodes.length + scene2Data.nodes.length + scene3Data.nodes.length;
const totalSprites =
  scene1Data.speakers.filter(s => CHARACTERS_WITH_SPRITES.includes(s)).length +
  scene2Data.speakers.filter(s => CHARACTERS_WITH_SPRITES.includes(s)).length +
  scene3Data.speakers.filter(s => CHARACTERS_WITH_SPRITES.includes(s)).length;

console.log(`Total dialogue nodes across all scenes: ${totalNodes}`);
console.log(`Total nodes with character sprites: ${totalSprites} (${Math.round(totalSprites/totalNodes*100)}%)`);
console.log(`\nErrors: ${totalErrors}`);
console.log(`Warnings: ${totalWarnings}`);

console.log('\n--- Character Appearances by Scene ---\n');

// Aggregate all speakers
const allSpeakers = [
  ...scene1Data.speakers,
  ...scene2Data.speakers,
  ...scene3Data.speakers
];

const totalSpeakerCounts = {};
allSpeakers.forEach(s => {
  totalSpeakerCounts[s] = (totalSpeakerCounts[s] || 0) + 1;
});

Object.entries(totalSpeakerCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([speaker, count]) => {
    const inScene1 = scene1Data.speakers.filter(s => s === speaker).length;
    const inScene2 = scene2Data.speakers.filter(s => s === speaker).length;
    const inScene3 = scene3Data.speakers.filter(s => s === speaker).length;
    console.log(`${speaker.padEnd(15)} Total: ${count.toString().padStart(3)} | S1: ${inScene1.toString().padStart(2)} | S2: ${inScene2.toString().padStart(2)} | S3: ${inScene3.toString().padStart(2)}`);
  });

console.log('\n--- Audio Effects Summary ---\n');

const allSounds = [
  ...scene1Data.sounds,
  ...scene2Data.sounds,
  ...scene3Data.sounds
];

console.log(`Total audio triggers: ${allSounds.length}`);
const soundCounts = {};
allSounds.forEach(s => {
  soundCounts[s] = (soundCounts[s] || 0) + 1;
});
Object.entries(soundCounts).forEach(([sound, count]) => {
  console.log(`  ${sound}: ${count} triggers`);
});

console.log('\n========================================');
if (totalErrors === 0) {
  console.log('✓ ALL VALIDATIONS PASSED');
} else {
  console.log(`✗ FOUND ${totalErrors} ERRORS`);
}
console.log('========================================\n');

process.exit(totalErrors > 0 ? 1 : 0);
