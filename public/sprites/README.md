# Sprite Sheets for MCR Game

This folder contains sprite sheets for character animations in The Black Parade visual novel game.

## Required Sprite Files

Save your sprite sheet images with these exact filenames:

| Filename | Character | Dimensions | Grid |
|----------|-----------|------------|------|
| `bassist-sheet.png` | The Bassist | 1024x192 | 24 cols x 3 rows |
| `guitarist-sheet.png` | Lead/Rhythm Guitarist | 342x216 | 6 cols x 3 rows |
| `patient-sheet.png` | The Patient | 384x576 | 6 cols x 6 rows |
| `lead-singer-sheet.png` | The Lead Singer | 512x384 | 6 cols x 4 rows |
| `drummer-sheet.png` | The Drummer | 612x384 | 6 cols x 4 rows |

---

## Gemini Image Generation Prompts

Use these prompts with Google Gemini to generate placeholder sprites. Each prompt is optimized for Gemini's image generation capabilities.

### The Bassist Sprite Sheet

```
Create a pixel art sprite sheet for a video game character. The character is a mysterious bassist from a gothic marching band. Style: 16-bit pixel art with black outline.

Character details:
- Tall, thin figure in all-black clothing
- Long black hair covering face partially
- Holding a brown jazz bass guitar close to body
- Pale gray face barely visible through hair
- Gothic/emo aesthetic

Layout: Create a horizontal sprite sheet with 24 frames arranged in 3 rows of 8 frames each.
- Row 1: Idle breathing animation (8 frames, subtle movement)
- Row 2: Walking animation while holding bass (8 frames)
- Row 3: Playing bass animation with finger movement (8 frames)

Technical specs:
- Each frame: 43x64 pixels
- Total image: 1024x192 pixels
- Transparent background (checkerboard pattern)
- Consistent black outline on character
- Pixel-perfect, no anti-aliasing
```

### The Lead Guitarist Sprite Sheet

```
Create a pixel art sprite sheet for a video game character. The character is a lead guitarist from a gothic rock band with dramatic makeup. Style: 16-bit detailed pixel art.

Character details:
- Messy black spiky hair
- White face paint with black circles around eyes (death mask style)
- Black military-style jacket with gold/silver details
- Red Les Paul electric guitar
- Aggressive rock stance

Layout: Create a sprite sheet with 18 frames arranged in 3 rows of 6 frames each.
- Row 1: Idle stance holding guitar (6 frames, subtle sway)
- Row 2: Walking with guitar (6 frames)
- Row 3: Playing guitar intensely, headbanging (6 frames)

Technical specs:
- Each frame: 57x72 pixels
- Total image: 342x216 pixels
- Transparent background
- Single color black outline
- Medium shading, gothic color palette (black, red, white, gold)
```

### The Patient Sprite Sheet

```
Create a pixel art sprite sheet for a video game character. The character is a sick hospital patient, young person with a fragile appearance. Style: detailed pixel art with emotional expressions.

Character details:
- Short messy dark hair
- Pale, sickly complexion with tired eyes
- Light blue hospital gown
- IV stand next to them (metal pole with bag)
- Barefoot
- Young, vulnerable appearance

Layout: Create a sprite sheet with 36 frames arranged in 6 rows of 6 frames each.
- Row 1: Standing idle with IV stand (6 frames, breathing)
- Row 2: Talking/explaining animation (6 frames)
- Row 3: Pointing gesture (6 frames)
- Row 4: Praying/pleading hands clasped (6 frames)
- Row 5: Scared/fearful expression (6 frames)
- Row 6: Neutral standing (6 frames, slight variation)

Technical specs:
- Each frame: 64x96 pixels
- Total image: 384x576 pixels
- Transparent background
- Soft outline style
- Muted colors (pale blue, gray, skin tones)
```

### The Lead Singer Sprite Sheet

```
Create a pixel art sprite sheet for a video game character. The character is a charismatic lead singer from a theatrical gothic rock band. Style: highly detailed 16-bit pixel art.

Character details:
- Wild, messy black hair
- White face with dramatic black eye makeup (skull/death mask)
- Black military parade jacket with gold epaulettes and medals
- Red accents on jacket
- Holding vintage microphone
- Theatrical, dramatic poses

Layout: Create a sprite sheet with 24 frames arranged in 4 rows of 6 frames each.
- Row 1: Idle stance with microphone (6 frames, performer sway)
- Row 2: Talking/speaking animation (6 frames)
- Row 3: Pointing dramatically at audience (6 frames)
- Row 4: Singing intensely into microphone (6 frames)

Technical specs:
- Each frame: 85x96 pixels
- Total image: 512x384 pixels
- Transparent background
- Black outline
- High contrast colors (black, white, gold, red)
```

### The Drummer Sprite Sheet

```
Create a pixel art sprite sheet for a video game character. The character is a skeletal drummer from a death-themed marching band. Style: detailed gothic pixel art.

Character details:
- Skull head (skeletal, not wearing mask)
- Black military uniform/jacket
- Sitting behind red drum kit with cymbals
- Holding wooden drumsticks
- Glowing red eyes
- Hunched, intense drumming posture

Layout: Create a sprite sheet with 24 frames arranged in 4 rows of 6 frames each.
- Row 1: Idle at drums (6 frames, slight movement)
- Row 2: Standard drumming pattern (6 frames)
- Row 3: Hard hitting drums (6 frames, sticks raised high)
- Row 4: Intense/fast drumming (6 frames, blur effect on sticks)

Technical specs:
- Each frame: 102x96 pixels (wider to fit drum kit)
- Total image: 612x384 pixels
- Transparent background
- Black outline on character, drum kit included in frame
- Dark palette with red drum accents, bone white skull
```

---

## Alternative: Simple Placeholder Generation

If you need quick placeholders, use this simplified prompt format:

```
Create a [WIDTH]x[HEIGHT] pixel art sprite sheet with [ROWS] rows of [COLS] frames each.
Character: [DESCRIPTION]
Style: 16-bit gothic pixel art, black outline, transparent background.
Show animation frames for: [ANIMATION TYPES]
```

---

## Animation Frame Mapping

The game code expects these animation names to map to sprite rows:

| Character | idle | walk | play | talk | point | sing | scared | pray |
|-----------|------|------|------|------|-------|------|--------|------|
| Bassist | Row 1 | Row 2 | Row 3 | - | - | - | - | - |
| Guitarist | Row 1 | Row 2 | Row 3 | - | - | - | - | - |
| Patient | Row 1 | - | - | Row 2 | Row 3 | - | Row 5 | Row 4 |
| Lead Singer | Row 1 | - | - | Row 2 | Row 3 | Row 4 | - | - |
| Drummer | Row 1 | - | Row 2-4 | - | - | - | - | - |

---

## Emotion to Animation Mapping

The game maps character emotions to animations:

- `neutral` -> `idle`
- `sad` / `accepting` -> `idle`
- `angry` -> `play` or `sing`
- `hopeful` -> `talk`
- `fearful` -> `scared`
